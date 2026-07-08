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

### API token example

The following snippet shows how to authenticate with an API token and list the sources accessible with that token. 
You can generate an API token by visiting the advanced settings, selecting the API tokens tab and clicking on 
'CREATE API TOKEN' in Elimity Insights.

```js
import { getAgentSources } from "@elimity/insights-client";

const config = {
  baseUrl: "https://example.elimity.com/api",
  tokenId: "my-token-id",
  tokenSecret: "my-token-secret",
};
const sources = await getAgentSources(config);
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
| 2              | >=3.38           |
