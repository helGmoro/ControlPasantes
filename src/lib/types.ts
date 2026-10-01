export type EstadoAsistencia = "presente" | "tarde" | "ausente" | "justificado";

export interface Pasante {
  id: string;
  tutor_id: string;
  nombre: string;
  apellido: string;
  legajo: string | null;
  area: string | null;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string | null;
  activo: boolean;
  created_at: string;
}

export interface Asistencia {
  id: string;
  pasante_id: string;
  fecha: string; // YYYY-MM-DD
  hora_entrada: string | null; // HH:MM
  hora_salida: string | null; // HH:MM
  estado: EstadoAsistencia;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
}

// Día calculado para historial/planilla: puede ser un registro real
// o un valor por defecto ("ausente") para un día sin carga.
export interface DiaAsistencia {
  id: string;
  pasante_id: string;
  fecha: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  estado: EstadoAsistencia;
  observaciones: string | null;
  esVirtual: boolean;
}
