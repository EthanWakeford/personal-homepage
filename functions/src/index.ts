import axios, { AxiosResponse } from 'axios';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { debug } from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
const { defineString } = require('firebase-functions/params');

const GITHUB_REPO = defineString('GITHUB_REPO');
const GITHUB_TOKEN = defineString('GITHUB_TOKEN');
const WORKFLOW_ID = defineString('WORKFLOW_ID');

initializeApp();
const db = admin.firestore();

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

  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO.value()}/actions/workflows/${WORKFLOW_ID.value()}/dispatches`;

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${GITHUB_TOKEN.value()}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };

  const body = {
    ref: 'main',
    inputs: {},
  };

  axios
    .post(apiUrl, body, { headers })
    .then((response: AxiosResponse) => debug('success', response.data))
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
