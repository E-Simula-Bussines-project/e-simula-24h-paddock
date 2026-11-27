type Rol = 'alumno' | 'profesor' | 'admin';
interface Alumno { id: number; nombre: string; email: string; tel: string; ciclo: string; clase: number; grupo: number | null; alta: string; }
interface Grupo { id: number; n: string; t: number | null; coche: string; }
interface Tutor { id: number; n: string; e: string; c: string; }
interface Ronda { n: number; f: string; nombre: string; tramo: string; }
interface Partida { id: number; nombre: string; nr: number; inicio: string; cada: number; estado: string; rondas: Ronda[]; }
type FilaRonda = [number, number, string, string, string, string, number?, number?, number?];
interface Persona { id: number; nombre: string; grupo: number; salario: number; }
interface DecisionRRHH { salarios: Record<number, number>; despidos: Record<number, boolean>; ofertas: Record<number, number>; }
