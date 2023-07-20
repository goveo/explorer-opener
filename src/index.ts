import child_process from 'child_process';
import fs from 'fs';
import os from 'os';

const supportedPlatforms = [
  'win32',
  'linux',
  'darwin',
] satisfies NodeJS.Platform[];
type SupportedPlatform = (typeof supportedPlatforms)[number];

const defaultPathDict: Record<SupportedPlatform, string> = {
  win32: '=',
  linux: '/',
  darwin: '/',
};

const explorerCommandDict: Record<SupportedPlatform, string> = {
  win32: 'explorer',
  linux: 'xdg-open',
  darwin: 'open',
};

const isSupportedPlatform = (
  platform: string,
): platform is SupportedPlatform => {
  return supportedPlatforms.includes(platform as SupportedPlatform);
};

export const openExplorer = async (path?: string) => {
  return new Promise((resolve, reject) => {
    const currentPlatform = os.platform();

    if (!isSupportedPlatform(currentPlatform)) {
      return reject(`Can not detect "${currentPlatform}" os`);
    }

    if (path !== undefined && !fs.existsSync(path)) {
      return reject(`File or directory "${path}" does not exist`);
    }

    const pathToOpen = path || defaultPathDict[currentPlatform];
    const cmd = explorerCommandDict[currentPlatform];

    const p = child_process.spawn(cmd, [pathToOpen]);

    p.on('error', (error: Error) => {
      p.kill();
      reject(error);
    });

    // success exit
    p.on('exit', () => {
      resolve(undefined);
    });
  });
};

export default openExplorer;
