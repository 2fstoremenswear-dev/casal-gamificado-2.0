'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCouple } from '@/contexts/CoupleContext';

const steps = [
  {
    title: 'Resgate o que vocês tinham no início.',
    description: 'Vamos analisar o que mudou no relacionamento e como recuperar aquela conexão especial.',
  },
  {
    title: 'Entenda o que mudou ao longo do tempo.',
    description: 'Compararemos o início com o momento atual para identificar pontos de melhoria.',
  },
  {
    title: 'Receba missões, desafios e rituais personalizados.',
    description: 'Missões gamificadas para reacender a chama e fortalecer o vínculo.',
  },
  {
    title: 'Ative o modo sensual se quiser levar pro próximo nível.',
    description: 'Desbloqueie desafios mais intensos para uma experiência completa.',
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nome1: '',
    nome2: '',
    tempoRelacao: '',
    modoSensual: false,
  });
  const { state, dispatch } = useCouple();
  const router = useRouter();

  // Redirecionar se já tiver dados do casal
  useEffect(() => {
    if (state.couple) {
      router.replace('/dashboard');
    }
  }, [state.couple, router]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempo = parseInt(formData.tempoRelacao) || 0;
    dispatch({
      type: 'SET_COUPLE',
      payload: {
        nome1: formData.nome1,
        nome2: formData.nome2,
        tempoRelacao: tempo,
        modoSensual: formData.modoSensual,
      },
    });
    // Usar replace em vez de push para evitar problemas de navegação
    setTimeout(() => {
      router.replace('/dashboard');
    }, 100);
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" fill="currentColor" />
            <h1 className="text-2xl font-bold text-white mb-2">Casal Gamificado</h1>
            <p className="text-gray-300">Resgate a conexão do início</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-center mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index <= currentStep ? 'bg-pink-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-300">{steps[currentStep].description}</p>
            </div>
          </div>

          {isLastStep && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome1" className="text-white">Nome do parceiro 1</Label>
                <Input
                  id="nome1"
                  value={formData.nome1}
                  onChange={(e) => setFormData({ ...formData, nome1: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nome2" className="text-white">Nome do parceiro 2</Label>
                <Input
                  id="nome2"
                  value={formData.nome2}
                  onChange={(e) => setFormData({ ...formData, nome2: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tempo" className="text-white">Tempo de relacionamento (em meses)</Label>
                <Input
                  id="tempo"
                  type="number"
                  value={formData.tempoRelacao}
                  onChange={(e) => setFormData({ ...formData, tempoRelacao: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="modoSensual"
                  checked={formData.modoSensual}
                  onCheckedChange={(checked) => setFormData({ ...formData, modoSensual: checked })}
                />
                <Label htmlFor="modoSensual" className="text-white">Ativar Modo Sensual</Label>
              </div>
              <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
                Começar Jornada
              </Button>
            </form>
          )}

          {!isLastStep && (
            <div className="flex justify-between">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Anterior
              </Button>
              <Button onClick={nextStep} className="bg-pink-600 hover:bg-pink-700">
                Próximo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
