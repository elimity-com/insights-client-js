import fixture from "./fixture.json";
import { performImport } from "@elimity/insights-client";

const config = {
  baseUrl: "https://example.elimity.com/api",
  sourceId: 1,
  sourceToken: "my-token",
};
await performImport(
  config,
  fixture.entities,
  fixture.relationships,
  fixture.streamItems,
);
