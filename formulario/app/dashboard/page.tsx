'use client';

import { useState, useEffect } from 'react';

interface Stats {
  resumen: {
    total_leads: number;
    high_ticket_count: number;
    low_ticket_count: number;
    variant_a_count: number;
    variant_b_count: number;
    ticket_promedio_avg: number;
  };
  porSegmento: Array<{
    segmento: string;
    count: number;
    porcentaje: number;
  }>;
  porEspecialidad: Array<{
    especialidad: string;
    segmento: string;
    ticket_promedio: number;
    count: number;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/leads?action=stats');
      if (!response.ok) throw new Error('Error al cargar estadísticas');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error || 'Error al cargar datos'}</div>
      </div>
    );
  }

  const { resumen, porSegmento, porEspecialidad } = stats;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard de Leads</h1>
          <p className="text-gray-600">Análisis de enriquecimiento y segmentación automática</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Leads</div>
            <div className="text-3xl font-bold text-gray-800">{resumen.total_leads}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">High Ticket</div>
            <div className="text-3xl font-bold text-green-600">{resumen.high_ticket_count}</div>
            <div className="text-xs text-gray-500 mt-1">
              {resumen.total_leads > 0 
                ? `${((resumen.high_ticket_count / resumen.total_leads) * 100).toFixed(1)}%`
                : '0%'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Low Ticket</div>
            <div className="text-3xl font-bold text-blue-600">{resumen.low_ticket_count}</div>
            <div className="text-xs text-gray-500 mt-1">
              {resumen.total_leads > 0 
                ? `${((resumen.low_ticket_count / resumen.total_leads) * 100).toFixed(1)}%`
                : '0%'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Ticket Promedio</div>
            <div className="text-2xl font-bold text-gray-800">
              ${resumen.ticket_promedio_avg?.toLocaleString('es-CO') || 0}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Prueba A/B</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Variante A (Manual)</span>
                  <span className="text-sm font-medium text-gray-700">{resumen.variant_a_count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ 
                      width: `${resumen.total_leads > 0 ? (resumen.variant_a_count / resumen.total_leads) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Variante B (Mapbox)</span>
                  <span className="text-sm font-medium text-gray-700">{resumen.variant_b_count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ 
                      width: `${resumen.total_leads > 0 ? (resumen.variant_b_count / resumen.total_leads) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Segmentación</h2>
            <div className="space-y-4">
              {porSegmento.map((segmento) => (
                <div key={segmento.segmento}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{segmento.segmento}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {segmento.count} ({segmento.porcentaje}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        segmento.segmento === 'HIGH_TICKET' ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${segmento.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Por Especialidad</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Segmento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {porEspecialidad.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.especialidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.segmento === 'HIGH_TICKET' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.segmento}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.ticket_promedio?.toLocaleString('es-CO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <a
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver al Formulario
          </a>
          <button
            onClick={fetchStats}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Actualizar Datos
          </button>
        </div>
      </div>
    </div>
  );
}
