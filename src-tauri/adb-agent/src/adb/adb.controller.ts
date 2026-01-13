import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { execAdb } from './adb.service';

const router = Router();

const BASE_PATH = '/storage/emulated/0/Documents';
const WAREHOUSE_PATH = `${BASE_PATH}/warehouse`;

console.log('[ADB] adb.routes.ts LOADED');

router.post('/push-task', async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'task is required' });
    }

    const fileName = `task-${Date.now()}.json`;
    const tempDir = path.join(process.cwd(), 'tmp');

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const localFile = path.join(tempDir, fileName);

    fs.writeFileSync(localFile, JSON.stringify(task, null, 2), 'utf-8');

    await execAdb(`adb shell mkdir -p "${BASE_PATH}"`);
    await execAdb(`adb shell mkdir -p "${WAREHOUSE_PATH}"`);

    await execAdb(
      `adb push "${localFile}" "${WAREHOUSE_PATH}/${fileName}"`,
    );

    fs.unlinkSync(localFile);

    res.json({
      ok: true,
      filename: fileName,
    });
  } catch (e: any) {
    console.error('[ADB] push-task error', e);
    res.status(500).json({
      error: 'push-task failed',
      details: String(e),
    });
  }
});

export default router;
