import { MongoClient } from 'mongodb';
import dns from 'dns';

// Fix DNS SRV/TXT resolution issue in Node.js on Windows by patching dns.promises.resolve
const dnsPromises = dns.promises;
if (dnsPromises && typeof dnsPromises.resolve === 'function') {
  const originalResolve = dnsPromises.resolve;
  const resolver = new dnsPromises.Resolver();
  try {
    resolver.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {
    console.warn("Could not set DNS servers for custom resolver:", e);
  }

  (dnsPromises as any).resolve = async function (hostname: string, rrtype?: string) {
    if (rrtype === 'SRV') {
      return resolver.resolveSrv(hostname);
    }
    if (rrtype === 'TXT') {
      return resolver.resolveTxt(hostname);
    }
    return (originalResolve as any).call(dnsPromises, hostname, rrtype);
  };

}

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
