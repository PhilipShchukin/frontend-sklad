// import { useGetAgents, useRefreshAgents } from '@/hooks/use-shipment';

// export default function Settings() {
//   // return (
//   //   <div>
//   //     <h3 className="flex text-lg font-medium">Настройки</h3>
//   //   </div>
//   // );

//   const { data, isLoading, isSuccess } = useGetAgents();
//   const refreshMutation = useRefreshAgents();

//   if (isLoading) return <p>Загрузка...</p>;
//   if (!isSuccess) return <p>Ошибка загрузки данных</p>;

//   return (
//     <div>
//       <button
//         onClick={() => refreshMutation.mutate()}
//         className="rounded bg-blue-500 px-4 py-2 text-white"
//       >
//         Обновить список агентов
//       </button>

//       {data?.agents_list.map((agent) => (
//         <div key={agent.id} className="mb-2 rounded border p-4">
//           <h3 className="font-bold">{agent.name}</h3>
//           <p>UNP: {agent.unp}</p>
//           <p>Адрес: {agent.address || 'нет данных'}</p>
//           <p>Статус: {agent.status?.message || 'нет данных'}</p>
//         </div>
//       ))}
//     </div>
//   );
// }
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

        // Исправление: берем данные из поля agents_list
        const agentsData = res.data.agents_list || [];
        setAgents(agentsData);

        // Для отладки - посмотрите структуру ответа
        console.log('Полный ответ API:', res.data);
        console.log('Agents list:', agentsData);
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

      {/* Добавляем проверку на пустой массив */}
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
