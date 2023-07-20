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

⚠️ Rejected promise will be returned if provided path does not exist:

```ts
openExplorer('/test/folder').catch((error) => {
  // error -> `File or directory "/test/folder" does not exist`
});
```

## Default path values

Default values will be used if `path` is not specified:

- Windows: `"="`
- Linux: `"/"`
- MacOS: `"/"`

## Supported platforms

- Windows (`"win32"`)
- Linux (`"linux"`)
- MacOS (`"darwin"`)

⚠️ Rejected promise will be returned if it's called from not supported platform:

```ts
// os: android
openExplorer().catch((error) => {
  // error -> Can not detect "android" os
});
```
