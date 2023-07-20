# open-explorer

📁 Open file explorer with Node.js

![npm-version](https://img.shields.io/npm/v/open-explorer)
![build-status-badge](https://img.shields.io/github/actions/workflow/status/goveo/open-explorer/release.yml?branch=master)
![install-size-badge](https://badgen.net/packagephobia/install/open-explorer)
[![codecov](https://codecov.io/gh/goveo/open-explorer/branch/master/graph/badge.svg)](https://codecov.io/gh/goveo/open-explorer)

## Basic Usage

```ts
import { openExplorer } from 'open-explorer';

openExplorer('C:\\Windows\\System32')
  .then(() => {
    // handle successful open
  })
  .catch((error) => {
    // handle error
  });
```

## Supported platforms

- Windows - `win32`
- Linux - `linux`
- MacOS - `darwin`
