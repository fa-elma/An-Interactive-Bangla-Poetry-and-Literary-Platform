import http from 'node:http';
import { handleApiRequest, readDatabase } from './apiPlugin.js';

const PORT = 5000;

// Ensure database is initialized on disk
readDatabase();

const server = http.createServer((req, res) => {
  handleApiRequest(req, res, () => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        name: 'SahityaKanon REST API & Database Server',
        status: 'running',
        endpoints: [
          'GET  /api/db',
          'POST /api/db/sync',
          'POST /api/db/reset',
          'POST /api/auth/login',
          'POST /api/auth/register',
        ],
      })
    );
  });
});

server.listen(PORT, () => {
  console.log(`📚 SahityaKanon Database Server running at http://localhost:${PORT}`);
});

