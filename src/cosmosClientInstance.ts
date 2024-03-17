import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_DB_ENDPOINT!;
const key = process.env.COSMOS_DB_KEY!;
const databaseName = process.env.DATABASE_NAME!;
const containerName = process.env.CONTAINER_NAME!;

export const client = new CosmosClient({ endpoint, key });
export const database = client.database(databaseName);
export const container = database.container(containerName);
