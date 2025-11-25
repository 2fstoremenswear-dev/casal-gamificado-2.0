'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useCouple } from '@/contexts/CoupleContext';

const questions = [
  {
    key: 'tempoJuntos',
    label: 'Quanto tempo vocês passavam juntos por semana no início?',
    type: 'slider',
    min: 0,
    max: 168, // horas por semana
    step: 1,
    unit: 'horas',
  },
  {
    key: 'intensidadeToque',
    label: 'Como você descreveria a intensidade do toque físico no início?',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    unit: '/10',
  },
  {
    key: 'frequenciaProvocacao',
    label: 'Vocês se provocavam / flertavam com que frequência?',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    unit: '/10',
  },
  {
    key: 'rotinaSexual',
    label: 'Como era a rotina sexual de vocês?',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    unit: '/10',
  },
  {
    key: 'resolucaoConflitos',
    label: 'Como vocês resolviam conflitos?',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    unit: '/10',
  },
  {
    key: 'encantamento',
    label: 'O que mais te encantava no início?',
    type: 'textarea',
  },
];

export default function QuizInicio() {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const { dispatch } = useCouple();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_INITIAL_QUIZ', payload: answers });
    router.push('/dashboard');
  };

  const updateAnswer = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Quiz do Início do Relacionamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {questions.map((question) => (
                <div key={question.key}>
                  <Label className="text-white block mb-2">{question.label}</Label>
                  {question.type === 'slider' && (
                    <div className="space-y-2">
                      <Slider
                        value={[answers[question.key] || question.min]}
                        onValueChange={(value) => updateAnswer(question.key, value[0])}
                        max={question.max}
                        min={question.min}
                        step={question.step}
                        className="w-full"
                      />
                      <div className="text-center text-gray-300">
                        {answers[question.key] || question.min} {question.unit}
                      </div>
                    </div>
                  )}
                  {question.type === 'textarea' && (
                    <Textarea
                      value={answers[question.key] || ''}
                      onChange={(e) => updateAnswer(question.key, e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Digite sua resposta..."
                    />
                  )}
                </div>
              ))}
              <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
                Salvar e Voltar ao Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}