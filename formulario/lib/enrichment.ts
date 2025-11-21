type Especialidad = 'Odontología' | 'Veterinaria' | 'Medicina General' | 'Estética';
type Segmento = 'HIGH_TICKET' | 'LOW_TICKET';

export interface EnrichmentResult {
  ticketPromedio: number;
  segmento: Segmento;
}

export function calcularTicketPromedio(especialidad: string): number {
  const especialidadNormalizada = especialidad.trim();
  
  if (especialidadNormalizada === 'Odontología' || especialidadNormalizada === 'Estética') {
    return 800000;
  }
  
  if (especialidadNormalizada === 'Veterinaria' || especialidadNormalizada === 'Medicina General') {
    return 200000;
  }
  
  return 200000;
}

export function asignarSegmento(ticketPromedio: number): Segmento {
  return ticketPromedio >= 500000 ? 'HIGH_TICKET' : 'LOW_TICKET';
}

export function enriquecerLead(especialidad: string): EnrichmentResult {
  const ticketPromedio = calcularTicketPromedio(especialidad);
  const segmento = asignarSegmento(ticketPromedio);
  
  return {
    ticketPromedio,
    segmento
  };
}
