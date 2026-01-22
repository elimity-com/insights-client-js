import { ConnectorLogLevel, Sdk } from "./openapi";
import { Deflate } from "pako";
import { JsonStreamStringify } from "json-stream-stringify";
import { Readable } from "node:stream";
import { createClient } from "./openapi/client";

/** Represents the assignment of a value for a specific attribute type to a specific entity or relationship. */
export interface AttributeAssignment {
  readonly attributeTypeId: string;
  readonly value: Value;
}

/** Represents a boolean attribute assignment value. */
export interface BooleanValue {
  readonly type: ValueType.Boolean;
  readonly value: boolean;
}

/** Indicates how to connect and authenticate to a specific Elimity Insights server. */
export interface Config {
  readonly baseUrl: string;
  readonly sourceId: number;
  readonly sourceToken: string;
}

/** Represents a simple date value (in UTC).  */
export interface Date {
  readonly day: number;
  readonly month: number;
  readonly year: number;
}

/** Represents a timestamp value (in UTC). */
export interface DateTime {
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly month: number;
  readonly second: number;
  readonly year: number;
}

/** Represents a date-time attribute assignment value. */
export interface DateTimeValue {
  readonly type: ValueType.DateTime;
  readonly value: DateTime;
}

/** Represents a date attribute assignment value. */
export interface DateValue {
  readonly type: ValueType.Date;
  readonly value: Date;
}

/** Represents a single entity in an import. */
export interface Entity {
  readonly attributeAssignments: readonly AttributeAssignment[];
  readonly id: string;
  readonly name: string;
  readonly type: string;
}

export interface EntityStreamItem {
  readonly entity: Entity;
  readonly type: StreamItemType.Entity;
}

/** Represents a number attribute assignment value. */
export interface NumberValue {
  readonly type: ValueType.Number;
  readonly value: number;
}

/** Represents a single relationship between two entities in an import. */
export interface Relationship {
  readonly attributeAssignments: readonly AttributeAssignment[];
  readonly fromEntityId: string;
  readonly fromEntityType: string;
  readonly toEntityId: string;
  readonly toEntityType: string;
}

export interface RelationshipStreamItem {
  readonly relationship: Relationship;
  readonly type: StreamItemType.Relationship;
}

export type StreamItem = EntityStreamItem | RelationshipStreamItem;

export enum StreamItemType {
  Entity = "entity",
  Relationship = "relationship",
}

/** Represents a string attribute assignment value. */
export interface StringValue {
  readonly type: ValueType.String;
  readonly value: string;
}

/** Represents a time-of-day value. */
export interface Time {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
}

/** Represents a time attribute assignment value. */
export interface TimeValue {
  readonly type: ValueType.Time;
  readonly value: Time;
}

/** Represents a generic attribute assignment value. */
export type Value =
  | BooleanValue
  | DateValue
  | DateTimeValue
  | NumberValue
  | StringValue
  | TimeValue;

/** Lists all supported attribute assignment value types. */
export enum ValueType {
  Boolean = "boolean",
  Date = "date",
  DateTime = "dateTime",
  Number = "number",
  String = "string",
  Time = "time",
}

/** Sends the given warning log to the configured Elimity Insights server. */
export function logAlert(config: Config, message: string): Promise<void> {
  return log(config, "alert", message);
}

/** Sends the given informational log to the configured Elimity Insights server. */
export function logInfo(config: Config, message: string): Promise<void> {
  return log(config, "info", message);
}

/** Sends the given entities and relationships to the configured Elimity Insights server. */
export async function performImport(
  config: Config,
  entities: AsyncIterable<Entity> | Iterable<Entity>,
  relationships: AsyncIterable<Relationship> | Iterable<Relationship>,
  streamItems: AsyncIterable<StreamItem> | Iterable<StreamItem>,
): Promise<void> {
  const sdk = makeSdk(config);
  const entityStream = Readable.from(entities);
  const relationshipStream = Readable.from(relationships);
  const itemStream = Readable.from(streamItems);
  const graph = {
    entities: entityStream,
    relationships: relationshipStream,
    streamItems: itemStream,
  };
  const stringify = new JsonStreamStringify(graph);
  const deflate = new Deflate();
  for await (const chunk of stringify) deflate.push(chunk as string);
  deflate.push("", true);
  const parts = [deflate.result];
  const blob = new Blob(parts);
  const path = { id: config.sourceId };
  const options = {
    body: blob,
    path,
  };
  await sdk.reloadSourceSnapshot(options);
}

function makeSdk(config: Config): Sdk {
  const auth = `${config.sourceId}:${config.sourceToken}`;
  const con = {
    auth,
    baseUrl: config.baseUrl,
    throwOnError: true,
  };
  const client = createClient(con);
  const args = { client };
  return new Sdk(args);
}

async function log(
  config: Config,
  level: ConnectorLogLevel,
  message: string,
): Promise<void> {
  const sdk = makeSdk(config);
  const timestamp = new globalThis.Date();
  const log = {
    level,
    message,
    timestamp,
  };
  const logs = [log];
  const path = { id: config.sourceId };
  const options = {
    body: logs,
    path,
  };
  await sdk.createSourceConnectorLogs(options);
}
