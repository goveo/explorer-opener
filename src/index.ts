import child_process from 'child_process';
import fs from 'fs';
import os from 'os';

const supportedPlatforms = ['win', 'linux', 'macos'] as const;
type SupportedPlatform = (typeof supportedPlatforms)[number];

const defaultPathDict: Record<SupportedPlatform, string> = {
  win: '=',
  linux: '/',
  macos: '/',
};

const explorerCommandDict: Record<SupportedPlatform, string> = {
  win: 'explorer',
  linux: 'xdg-open',
  macos: 'open',
};

const currentPlatform = os
  .platform()
  .toLowerCase()
  .replace(/[0-9]/g, '')
  .replace('darwin', 'macos');

const isSupportedPlatform = (
  platform: string,
): platform is SupportedPlatform => {
  return supportedPlatforms.includes(platform as SupportedPlatform);
};

export const openExplorer = async (path: string) => {
  return new Promise((resolve, reject) => {
    if (!isSupportedPlatform(currentPlatform)) {
      return reject(`Can not detect ${currentPlatform} os`);
    }

    if (!fs.existsSync(path)) {
      return reject(`File or directory ${path} does not exist`);
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
