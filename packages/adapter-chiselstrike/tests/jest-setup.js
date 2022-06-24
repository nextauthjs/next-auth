import fetch from "node-fetch"
globalThis.fetch = fetch;
globalThis.Headers = fetch.Headers;
