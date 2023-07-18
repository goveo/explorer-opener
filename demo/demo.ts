/* eslint-disable no-console */
import { openExplorer } from '../src/index';

const path = 'C:\\Windows\\System32';

openExplorer(path)
  .then(() => {
    console.log('success');
  })
  .catch((error) => {
    console.error(`Error: ${error}`);
  });
