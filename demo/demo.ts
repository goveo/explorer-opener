import { createInterface as createReadlineInterface } from 'node:readline';

import chalk from 'chalk';

import { openExplorer } from '../src/index';

const rl = createReadlineInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Path (leave blank to use default value): ', (path) => {
  openExplorer(path || undefined)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log(chalk.green('Success'));
    })
    .catch((error) => {
      console.error(chalk.red(`Error: ${error}`));
    });

  rl.close();
});
