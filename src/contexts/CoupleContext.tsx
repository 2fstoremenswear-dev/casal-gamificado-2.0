'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CoupleState, Couple, QuizAnswers, Mission, VaultEntry } from '@/lib/types';

type Action =
  | { type: 'SET_COUPLE'; payload: Couple }
  | { type: 'SET_INITIAL_QUIZ'; payload: QuizAnswers }
  | { type: 'SET_CURRENT_QUIZ'; payload: QuizAnswers }
  | { type: 'CALCULATE_EMOTIONAL_MAP' }
  | { type: 'CALCULATE_DELTA' }
  | { type: 'COMPLETE_MISSION'; payload: string }
  | { type: 'ADD_VAULT_ENTRY'; payload: VaultEntry }
  | { type: 'RESET_DATA' }
  | { type: 'LOAD_FROM_STORAGE'; payload: CoupleState };

const initialState: CoupleState = {
  couple: null,
  initialQuiz: null,
  currentQuiz: null,
  emotionalMap: null,
  deltaEmocional: null,
  missions: [
    {
      id: '1',
      titulo: 'Toque Surpresa do Dia',
      descricao: 'Toque seu parceiro(a) de forma carinhosa e inesperada 3 vezes durante o dia.',
      pilar: 'toque',
      dificuldade: 1,
      xp: 50,
      categoria: 'Conexão física',
    },
    {
      id: '2',
      titulo: 'Provocação Secreta',
      descricao: 'Mande 3 mensagens provocantes ao longo do dia sem explicar o contexto.',
      pilar: 'desejo',
      dificuldade: 2,
      xp: 75,
      categoria: 'Romance',
    },
    {
      id: '3',
      titulo: 'Recriar uma memória do início',
      descricao: 'Planeje algo que vocês faziam no começo do relacionamento.',
      pilar: 'romance',
      dificuldade: 2,
      xp: 100,
      categoria: 'Romance',
    },
    {
      id: '4',
      titulo: 'Missão do Silêncio Seguro',
      descricao: '10 minutos abraçados, sem celular, sem falar de problemas.',
      pilar: 'presenca',
      dificuldade: 1,
      xp: 60,
      categoria: 'Presença',
    },
    {
      id: '5',
      titulo: 'Diálogo Aberto',
      descricao: 'Conversem sobre um sentimento que estava guardado.',
      pilar: 'comunicacao',
      dificuldade: 3,
      xp: 120,
      categoria: 'Comunicação',
    },
    {
      id: '6',
      titulo: 'Noite Sensual Planejada',
      descricao: 'Prepare uma noite especial com elementos sensuais.',
      pilar: 'desejo',
      dificuldade: 3,
      xp: 150,
      categoria: 'Modo sensual',
      sensual: true,
    },
  ],
  completedMissions: [],
  vaultEntries: [],
  xpTotal: 0,
  nivelDoCasal: 1,
};

function calculateEmotionalMap(quiz: QuizAnswers): { toque: number; comunicacao: number; desejo: number; presenca: number; romance: number; estabilidade: number } {
  // Simples cálculo baseado nas respostas
  return {
    toque: quiz.intensidadeToque * 10,
    comunicacao: quiz.resolucaoConflitos * 10,
    desejo: quiz.rotinaSexual * 10,
    presenca: quiz.tempoJuntos * 2, // assumindo horas por semana
    romance: (quiz.frequenciaProvocacao + quiz.intensidadeToque) * 5,
    estabilidade: quiz.resolucaoConflitos * 10,
  };
}

function calculateDelta(initial: any, current: any): any {
  return {
    toque: current.toque - initial.toque,
    comunicacao: current.comunicacao - initial.comunicacao,
    desejo: current.desejo - initial.desejo,
    presenca: current.presenca - initial.presenca,
    romance: current.romance - initial.romance,
    estabilidade: current.estabilidade - initial.estabilidade,
  };
}

function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

function coupleReducer(state: CoupleState, action: Action): CoupleState {
  switch (action.type) {
    case 'SET_COUPLE':
      return { ...state, couple: action.payload };
    case 'SET_INITIAL_QUIZ':
      const newStateInitial = { ...state, initialQuiz: action.payload };
      const emotionalMap = calculateEmotionalMap(action.payload);
      return { ...newStateInitial, emotionalMap };
    case 'SET_CURRENT_QUIZ':
      const newStateCurrent = { ...state, currentQuiz: action.payload };
      if (state.emotionalMap) {
        const currentMap = calculateEmotionalMap(action.payload);
        const delta = calculateDelta(state.emotionalMap, currentMap);
        return { ...newStateCurrent, deltaEmocional: delta };
      }
      return newStateCurrent;
    case 'CALCULATE_EMOTIONAL_MAP':
      if (state.initialQuiz) {
        return { ...state, emotionalMap: calculateEmotionalMap(state.initialQuiz) };
      }
      return state;
    case 'CALCULATE_DELTA':
      if (state.initialQuiz && state.currentQuiz) {
        const initialMap = calculateEmotionalMap(state.initialQuiz);
        const currentMap = calculateEmotionalMap(state.currentQuiz);
        const delta = calculateDelta(initialMap, currentMap);
        return { ...state, emotionalMap: initialMap, deltaEmocional: delta };
      }
      return state;
    case 'COMPLETE_MISSION':
      if (!state.completedMissions.includes(action.payload)) {
        const mission = state.missions.find(m => m.id === action.payload);
        const newXp = state.xpTotal + (mission?.xp || 0);
        return {
          ...state,
          completedMissions: [...state.completedMissions, action.payload],
          xpTotal: newXp,
          nivelDoCasal: calculateLevel(newXp),
        };
      }
      return state;
    case 'ADD_VAULT_ENTRY':
      return { ...state, vaultEntries: [...state.vaultEntries, action.payload] };
    case 'RESET_DATA':
      return initialState;
    case 'LOAD_FROM_STORAGE':
      return action.payload;
    default:
      return state;
  }
}

const CoupleContext = createContext<{
  state: CoupleState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function CoupleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(coupleReducer, initialState);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    // Carregar dados do localStorage apenas no cliente
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('casalGamificado');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed });
        } catch (e) {
          console.error('Erro ao carregar dados:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Salvar dados no localStorage apenas após carregar
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('casalGamificado', JSON.stringify(state));
    }
  }, [state, isLoaded]);

  return (
    <CoupleContext.Provider value={{ state, dispatch }}>
      {children}
    </CoupleContext.Provider>
  );
}

export function useCouple() {
  const context = useContext(CoupleContext);
  if (!context) {
    throw new Error('useCouple must be used within CoupleProvider');
  }
  return context;
}
