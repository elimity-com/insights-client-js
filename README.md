# Elimity Insights NodeJS client

This NodeJS package provides a client for connector interactions with an Elimity Insights server.

## Usage

### Minimal example

The following snippet shows how to authenticate as a custom source and create a connector log at an Elimity Insights
server. You can generate a source identifier and token by visiting the custom source's detail page in Elimity Insights
and clicking the 'GENERATE CREDENTIALS' button, which can be found under the 'SETTINGS' tab.

```js
import { logInfo } from "@elimity/insights-client";

const config = {
  baseUrl: "https://example.elimity.com/api",
  sourceId: 1,
  sourceToken: "my-token",
};
await logInfo(config, "Hello from NodeJS!");
```

### Extended example

Refer to
[the `example` directory in this package's GitHub repository](https://github.com/elimity-com/insights-client-js/tree/main/example)
for a sample script that imports some users, roles and relationships between them.

## Installation

```sh
$ npm i @elimity/insights-client
```

## Compatibility

| Client version | Insights version |
| -------------- | ---------------- |
| 1              | >=3.35           |
