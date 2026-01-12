import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function AdbPanel() {
  const [ping, setPing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await invoke('fetch_reports');
        setPing(res);
      } catch (err: any) {
        console.error(err);
        setError(err?.toString() || 'Unknown error');
      }
    };

    fetchReports();
  }, []);

  console.log('ping', ping);
  console.log('error', error);
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Ping ADB → Nest:</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {ping ? <pre>{JSON.stringify(ping, null, 2)}</pre> : <div>Loading...</div>}
    </div>
  );
}
