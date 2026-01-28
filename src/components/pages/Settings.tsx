import { useEffect, useState } from 'react';
import axios from 'axios';

type Agent = {
  id: number;
  name: string;
  address?: string;
  unp?: string;
  gln?: string;
};

type ApiResponse = {
  agents_list: Agent[];
};

export default function Settings() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await axios.post<ApiResponse>('http://localhost:4000/api/data/agents');

        const agentsData = res.data.agents_list || [];
        setAgents(agentsData);
      } catch (err: any) {
        setError(err.message || 'Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Список агентов</h1>

      {agents.length === 0 ? (
        <p>Нет данных об агентах</p>
      ) : (
        <ul>
          {agents.map((agent) => (
            <li
              key={agent.id}
              style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}
            >
              <strong>{agent.name}</strong>
              <div>Адрес: {agent.address || '—'}</div>
              <div>UNP: {agent.unp || '—'}</div>
              <div>GLN: {agent.gln || '—'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
