import child_process, { ChildProcess } from 'child_process';
import fs from 'fs';
import os from 'os';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import openExplorer from './index';

const mockPlatform = (platform: NodeJS.Platform) => {
  vi.spyOn(os, 'platform').mockImplementation(() => {
    return platform;
  });
};

const mockExistsSync = (exists: boolean) => {
  vi.spyOn(fs, 'existsSync').mockImplementation(() => {
    return exists;
  });
};

const mockSpawn = () => {
  const process = new ChildProcess();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.kill = vi.fn().mockImplementation(() => null);

  const killSpy = vi.spyOn(process, 'kill');

  const spy = vi
    .spyOn(child_process, 'spawn')
    .mockImplementation(() => process);

  return {
    spy,
    process,
    killSpy,
  };
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('openExplorer', () => {
  describe('should spawn new process with correct command', () => {
    it('should spawn explorer on windows', () => {
      const path = 'C:\\Windows\\System32';
      mockPlatform('win32');
      mockExistsSync(true);
      const { spy: spawnSpy } = mockSpawn();

      openExplorer(path);

      expect(spawnSpy).toHaveBeenCalledTimes(1);
      expect(spawnSpy).toHaveBeenLastCalledWith('explorer', [path]);
    });

    it('should spawn xdg-open on linux', () => {
      const path = '/test';
      mockPlatform('linux');
      mockExistsSync(true);
      const { spy: spawnSpy } = mockSpawn();

      openExplorer(path);

      expect(spawnSpy).toHaveBeenCalledTimes(1);
      expect(spawnSpy).toHaveBeenLastCalledWith('xdg-open', [path]);
    });

    it('should spawn open on macos', () => {
      const path = '/test';
      mockPlatform('darwin');
      mockExistsSync(true);
      const { spy: spawnSpy } = mockSpawn();

      openExplorer(path);

      expect(spawnSpy).toHaveBeenCalledTimes(1);
      expect(spawnSpy).toHaveBeenLastCalledWith('open', [path]);
    });
  });

  describe('not-supported platform', () => {
    it('should reject if path does not exist', () => {
      const platform = 'android';
      mockExistsSync(true);
      mockPlatform(platform);

      openExplorer('/test').catch((error: Error) => {
        expect(error).toBe(`Can not detect "${platform}" os`);
      });
    });
  });

  describe('spawned process handling', () => {
    it('should reject if spawned process throws an error', () => {
      const platform = 'win32';
      mockExistsSync(true);
      mockPlatform(platform);
      const { process, killSpy } = mockSpawn();

      const resultPromise = openExplorer('/test');

      process.emit('error', 'Test Error');

      expect(resultPromise).rejects.toBe('Test Error');

      // kill the process
      expect(killSpy).toBeCalledTimes(1);
    });

    it('should resolve if spawned process emit an "exit" event', () => {
      const platform = 'win32';
      mockExistsSync(true);
      mockPlatform(platform);
      const { process } = mockSpawn();

      const resultPromise = openExplorer('/test');

      process.emit('exit');

      expect(resultPromise).resolves;
    });
  });

  describe('path argument', () => {
    it('should reject if path does not exist', () => {
      mockPlatform('win32');
      mockExistsSync(false);

      openExplorer('/test').catch((error: Error) => {
        expect(error).toBe('File or directory "/test" does not exist');
      });

      openExplorer('').catch((error: Error) => {
        expect(error).toBe('File or directory "" does not exist');
      });

      openExplorer(' ').catch((error: Error) => {
        expect(error).toBe('File or directory " " does not exist');
      });
    });

    it('should pass use default value if path is not provided', () => {
      mockExistsSync(true);
      const { spy } = mockSpawn();

      mockPlatform('win32');
      openExplorer();
      expect(spy).toHaveBeenLastCalledWith('explorer', ['=']);

      mockPlatform('linux');
      openExplorer();
      expect(spy).toHaveBeenLastCalledWith('xdg-open', ['/']);

      mockPlatform('darwin');
      openExplorer();
      expect(spy).toHaveBeenLastCalledWith('open', ['/']);
    });
  });
});
