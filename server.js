import https from 'node:https';
import fs from 'node:fs';
import { handler } from './dist/server/entry.mjs';

// Adjust paths as necessary for your SSL certificate files
const options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
};

https.createServer(options, (req, res) => {
  handler(req, res);
}).listen(3000, () => {
  console.log('HTTPS server running on https://localhost:3000');
});
