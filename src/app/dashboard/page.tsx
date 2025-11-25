'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Trophy, Target, MessageCircle, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCouple } from '@/contexts/CoupleContext';

export default function Dashboard() {
  const { state } = useCouple();
  const router = useRouter();

  // Redirecionar para onboarding se não tiver dados do casal
  useEffect(() => {
    if (!state.couple) {
      router.replace('/');
    }
  }, [state.couple, router]);

  // Mostrar loading enquanto verifica
  if (!state.couple) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-pulse" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  const xpForNextLevel = (state.nivelDoCasal * 500) - state.xpTotal;
  const xpProgress = ((state.xpTotal % 500) / 500) * 100;

  const mockAISuggestions = [
    "Experimentem uma noite de massagens mútuas para reconectar fisicamente.",
    "Compartilhem 3 coisas positivas sobre o relacionamento hoje.",
    "Planejem uma surpresa romântica baseada em memórias do início.",
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Olá, {state.couple.nome1} e {state.couple.nome2}!
          </h1>
          <p className="text-gray-300">Bem-vindos ao seu painel de relacionamento</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Nível e XP */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Nível {state.nivelDoCasal}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-2">XP Total: {state.xpTotal}</p>
              <Progress value={xpProgress} className="mb-2" />
              <p className="text-sm text-gray-400">{xpForNextLevel} XP para o próximo nível</p>
            </CardContent>
          </Card>

          {/* Mapa Emocional */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Heart className="w-5 h-5 mr-2 text-pink-500" />
                Mapa Emocional
              </CardTitle>
            </CardHeader>
            <CardContent>
              {state.emotionalMap ? (
                <div className="space-y-2">
                  {Object.entries(state.emotionalMap).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-300 capitalize">{key}</span>
                      <span className="text-white">{value}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Complete o quiz do início</p>
              )}
            </CardContent>
          </Card>

          {/* Delta Emocional */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Delta Emocional</CardTitle>
            </CardHeader>
            <CardContent>
              {state.deltaEmocional ? (
                <div className="space-y-2">
                  {Object.entries(state.deltaEmocional).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-300 capitalize">{key}</span>
                      <span className={value >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {value > 0 ? '+' : ''}{value}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Complete ambos os quizzes</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Atalhos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/quiz-inicio">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-gray-600 text-white hover:bg-gray-700">
              <Target className="w-6 h-6 mb-1" />
              Quiz Início
            </Button>
          </Link>
          <Link href="/quiz-atual">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-gray-600 text-white hover:bg-gray-700">
              <Target className="w-6 h-6 mb-1" />
              Quiz Atual
            </Button>
          </Link>
          <Link href="/missoes">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-gray-600 text-white hover:bg-gray-700">
              <Trophy className="w-6 h-6 mb-1" />
              Missões
            </Button>
          </Link>
          <Link href="/ia">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-gray-600 text-white hover:bg-gray-700">
              <MessageCircle className="w-6 h-6 mb-1" />
              IA Relacionamento
            </Button>
          </Link>
        </div>

        {/* Sugestões da IA */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Sugestões da IA</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mockAISuggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <Heart className="w-4 h-4 mr-2 mt-0.5 text-pink-500 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Navegação inferior */}
        <div className="flex justify-center space-x-4">
          <Link href="/cofre">
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
              <BookOpen className="w-4 h-4 mr-2" />
              Cofre Emocional
            </Button>
          </Link>
          <Link href="/configuracoes">
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
