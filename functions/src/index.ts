// import axios, { AxiosResponse } from 'axios';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { debug } from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import { defineString } from 'firebase-functions/params';
import { CloudTasksClient } from '@google-cloud/tasks';

const GITHUB_REPO = defineString('GITHUB_REPO');
const GITHUB_TOKEN = defineString('GITHUB_TOKEN');
const WORKFLOW_ID = defineString('WORKFLOW_ID');
// const SERVICE_ACCOUNT_EMAIL = defineString('SERVICE_ACCOUNT_EMAIL');
const PROJECT_ID = defineString('PROJECT_ID');
const QUEUE_NAME = defineString('QUEUE_NAME');
const LOCATION = 'us-central';
// const serviceAccountEmail = 'PROJECT_ID@appspot.gserviceaccount.com';
// const url =
// 'https://europe-west1-PROJECT_ID.cloudfunctions.net/requestQueuedUpdateBackend';

initializeApp();
const db = admin.firestore();

const createBuildTask = async (toRunTimestamp: number) => {
  const tasksClient = new CloudTasksClient();

  const body = {
    ref: 'main',
    inputs: {},
  };

  const formattedParent = tasksClient.queuePath(
    PROJECT_ID.value(),
    LOCATION,
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
      // oidcToken: {
      // serviceAccountEmail: SERVICE_ACCOUNT_EMAIL.value(),
      // },
    },
  };

  const request = {
    parent: formattedParent,
    task: task,
  };
  const [response] = await tasksClient.createTask(request);
  return response;
};

export const buildOnWritten = onDocumentWritten('test/**', async (event) => {
  debug(GITHUB_REPO.value());
  // get current time
  const currentDate = new Date();
  const thisTimestamp = Math.floor(currentDate.getTime() / 1000);

  // retrieve most recent timestamp in firebase
  const recentTimestamp = await getMostRecentTimestamp();

  if (recentTimestamp !== null) {
    const timeDifference = Math.abs(thisTimestamp - recentTimestamp);

    debug(
      `this timestamp: ${thisTimestamp} recent timestamp${recentTimestamp}`
    );

    const fiveMinutesInSeconds = 5 * 60;

    if (timeDifference <= fiveMinutesInSeconds) {
      // quit to limit the number of build invocations

      debug('quitting');
      return;
    }
  }

  // add current timestamp to firestore
  debug('uploading timestamp');
  await uploadTimestamp(thisTimestamp);

  // wait 5 minutes???
  debug('now waiting');
  await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));

  debug('wait finished');
  // send http request to github actions

  // const apiUrl = `https://api.github.com/repos/${GITHUB_REPO.value()}/actions/workflows/${WORKFLOW_ID.value()}/dispatches`;

  // const headers = {
  //   Accept: 'application/vnd.github+json',
  //   Authorization: `Bearer ${GITHUB_TOKEN.value()}`,
  //   'X-GitHub-Api-Version': '2022-11-28',
  //   'Content-Type': 'application/json',
  // };

  // const body = {
  //   ref: 'main',
  //   inputs: {},
  // };

  // axios

  // run in 5 minutes from now
  const toRunTimestamp = thisTimestamp + 1 * 60 * 1000;

  // const response = await
  createBuildTask(toRunTimestamp)
    .then((response) => debug('success', response.scheduleTime))
    .catch((error: any) => debug('Error:', error));
});

const uploadTimestamp = async (timestamp: number) => {
  // upload timestamp when run to firestore
  const collection = db.collection('build_timestamps');
  await collection.add({ timestamp });
};

const getMostRecentTimestamp = async (): Promise<number | null> => {
  // retrieve the most recent run timestamp
  const snapshot = await db
    .collection('build_timestamps')
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();

  if (snapshot.docs.length === 0) return null;

  const mostRecentTimestamp = snapshot.docs[0].get('timestamp');

  return mostRecentTimestamp;
};
