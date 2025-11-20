export interface AddressData {
  direccion: string;
  ciudad: string;
  departamento: string;
  lat?: number;
  lng?: number;
}

export interface FormData {
  nombre: string;
  whatsapp: string;
  nombreNegocio: string;
  especialidad: string;
  address: AddressData;
}

export const especialidades = [
  'Odontología',
  'Veterinaria',
  'Medicina General',
  'Estética'
] as const;

export type Especialidad = typeof especialidades[number];
