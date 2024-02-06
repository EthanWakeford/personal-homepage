// import { CloudTasksClient } from '@google-cloud/tasks';
const { CloudTasksClient } = require('@google-cloud/tasks');

const tasksClient = new CloudTasksClient();

const createBuildTask = async () => {
  const body = {
    ref: 'main',
    inputs: {},
  };

  const formattedParent = tasksClient.queuePath(
    'wakeford11901',
    'us-central1',
    'queue-build'
  );

  const task = {
    scheduleTime: {
      seconds: 60 + Date.now() / 1000,
    },
    httpRequest: {
      httpMethod: 'POST',
      url: `https://api.github.com/repos/${'EthanWakeford/personal-homepage'}/actions/workflows/${62189612}/dispatches`,
      body: Buffer.from(JSON.stringify(body)).toString('base64'),
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${'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'}`,
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

createBuildTask();
