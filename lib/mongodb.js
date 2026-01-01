// /lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please define the MONGODB_URI environment variable in .env");

let cached = global._mongoClientPromise; // reuse between hot reloads in dev

if (!cached) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  cached = client.connect();
  global._mongoClientPromise = cached;
}

export default async function getDb() {
  const client = await cached;
  return client.db(); // default DB from connection string or set ?retryWrites
}
