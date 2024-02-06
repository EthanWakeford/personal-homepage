import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { onRequest } from 'firebase-functions/v2/https';
import { debug } from 'firebase-functions/logger';
import { defineString } from 'firebase-functions/params';
import axios from 'axios';

const GITHUB_REPO = defineString('GITHUB_REPO');
const GITHUB_TOKEN = defineString('GITHUB_TOKEN');
const WORKFLOW_ID = defineString('WORKFLOW_ID');
const PROJECT_ID = defineString('PROJECT_ID');
const QUEUE_NAME = defineString('QUEUE_NAME');
const BUILD_URL = defineString('BUILD_URL');
const location = 'us-central1';

initializeApp();

export const buildMe = onRequest(async (req, res) => {
  debug('hi im building');
  const currentDate = new Date();
  const thisTimestamp = Math.floor(currentDate.getTime() / 1000);

  // run in 5 minutes
  const toRunTimestamp = thisTimestamp + 5 * 60;

  await createBuildTask(toRunTimestamp)
    .then(() => {
      res.send('success');
    })
    .catch((error: any) => {
      debug('error caught');
      res.send(error);
    });
});

export const buildOnWritten = onDocumentWritten('test/**', async (event) => {
  debug('hi document was written');

  axios
    .get(BUILD_URL.value())
    .then((response) => {
      debug('Response:', response.data);
    })
    .catch((error) => {
      debug('Error Caught:', error.message);
    });
});

const createBuildTask = async (toRunTimestamp: number) => {
  const { v2beta3 } = await import('@google-cloud/tasks');

  const tasksClient = new v2beta3.CloudTasksClient();

  debug('building task');

  const getTasksRequest = {
    parent: `projects/${PROJECT_ID.value()}/locations/${location}/queues/${QUEUE_NAME.value()}`,
  };

  const [tasklist] = await tasksClient.listTasks(getTasksRequest);

  debug('got task list');

  // quit if task list isnt empty
  if (tasklist.length > 0) {
    debug('build is already queued');
    return;
  }
  debug('queue is empty');

  const body = {
    ref: 'main',
    inputs: {},
  };

  const formattedParent = tasksClient.queuePath(
    PROJECT_ID.value(),
    location,
    QUEUE_NAME.value()
  );

  const task = {
    scheduleTime: {
      seconds: toRunTimestamp,
    },
    httpRequest: {
      httpMethod: 'POST' as const,
      url: `https://api.github.com/repos/${GITHUB_REPO.value()}/actions/workflows/${WORKFLOW_ID.value()}/dispatches`,
      body: Buffer.from(JSON.stringify(body)).toString('base64'),
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN.value()}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
    },
  };

  const request = {
    parent: formattedParent,
    task: task,
  };
  const [response] = await tasksClient.createTask(request);
  debug('task added');
  return response;
};
