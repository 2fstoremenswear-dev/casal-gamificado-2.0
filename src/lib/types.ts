export interface Couple {
  nome1: string;
  nome2: string;
  tempoRelacao: number; // em meses
  modoSensual: boolean;
}

export interface QuizAnswers {
  tempoJuntos: number; // horas por semana
  intensidadeToque: number; // 1-10
  frequenciaProvocacao: number; // 1-10
  rotinaSexual: number; // 1-10
  resolucaoConflitos: number; // 1-10
  encantamento: string;
}

export interface EmotionalMap {
  toque: number;
  comunicacao: number;
  desejo: number;
  presenca: number;
  romance: number;
  estabilidade: number;
}

export interface DeltaEmocional {
  toque: number;
  comunicacao: number;
  desejo: number;
  presenca: number;
  romance: number;
  estabilidade: number;
}

export interface Mission {
  id: string;
  titulo: string;
  descricao: string;
  pilar: keyof EmotionalMap;
  dificuldade: 1 | 2 | 3;
  xp: number;
  categoria: string;
  sensual?: boolean;
}

export interface VaultEntry {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'promessa' | 'momento' | 'frase' | 'plano';
}

export interface CoupleState {
  couple: Couple | null;
  initialQuiz: QuizAnswers | null;
  currentQuiz: QuizAnswers | null;
  emotionalMap: EmotionalMap | null;
  deltaEmocional: DeltaEmocional | null;
  missions: Mission[];
  completedMissions: string[];
  vaultEntries: VaultEntry[];
  xpTotal: number;
  nivelDoCasal: number;
}