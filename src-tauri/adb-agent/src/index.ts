// import * as express from 'express';
// import * as cors from 'cors';
// import axios from 'axios';

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = 4545;
// const CORE_BACKEND_URL = 'http://localhost:4000/api/device-sync';
                        

// app.get('/health', (_req, res) => {
//   console.log('[ADB] /health pinged');
//   res.json({ ok: true, source: 'adb-agent' });
// });

// // Пинг Nest
// app.get('/ping-backend', async (_req, res) => {
//   try {
//     const data = (await axios.get(`${CORE_BACKEND_URL}/health`)).data;
//     console.log('[ADB] pinged backend', data);
//     res.json({ agent: true, backend: data });
//   } catch (e) {
//     console.error('[ADB] backend error', e);
//     res.status(500).json({ error: 'backend unreachable' });
//   }
// });

// app.post('/agent/test', (req, res) => {
//   res.json({
//     ok: true,
//     from: 'adb-agent',
//     body: req.body
//   });
// });

// app.listen(PORT, '127.0.0.1', () => {
//   console.log(`ADB Agent running on http://127.0.0.1:${PORT}`);
// });


// import * as express from 'express';
// import * as cors from 'cors';
// import axios from 'axios';

// import adbRoutes from './adb/adb.controller';

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = 4545;
// const CORE_BACKEND_URL = 'http://localhost:4000/api/device-sync';

// console.log('[ADB] registering /adb routes');

// app.get('/health', (_req, res) => {
//   console.log('[ADB] /health pinged');
//   res.json({ ok: true, source: 'adb-agent' });
// });

// app.get('/ping-backend', async (_req, res) => {
//   try {
//     const data = (await axios.get(`${CORE_BACKEND_URL}/health`)).data;
//     res.json({ agent: true, backend: data });
//   } catch {
//     res.status(500).json({ error: 'backend unreachable' });
//   }
// });

// app.post('/agent/test', (req, res) => {
//   res.json({ ok: true, body: req.body });
// });

// 🔥 ВАЖНО — подключаем adb
// app.use('/adb', adbRoutes);

// app.listen(PORT, '127.0.0.1', () => {
//   console.log(`ADB Agent running on http://127.0.0.1:${PORT}`);
// });

