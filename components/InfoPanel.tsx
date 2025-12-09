import React, { useEffect, useState } from 'react';
import { GeminiResponse, SimulationStage, StageInfo } from '../types';
import { fetchStageDetails } from '../services/geminiService';
import { ArrowLeft, ArrowRight, Activity, Brain, Heart, Zap } from 'lucide-react';

interface InfoPanelProps {
  currentStage: StageInfo;
  onNext: () => void;
  onPrev: () => void;
  totalStages: number;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ currentStage, onNext, onPrev, totalStages }) => {
  const [data, setData] = useState<GeminiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      // Add a small delay to prevent rapid-fire API calls if user clicks fast
      await new Promise(r => setTimeout(r, 500));
      if (!isMounted) return;
      
      const res = await fetchStageDetails(currentStage.id, currentStage.title);
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [currentStage]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6">
      
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
           <h1 className="text-3xl font-light tracking-tighter text-white/90">BioSim<span className="font-bold text-blue-400">.AI</span></h1>
           <p className="text-sm text-gray-400">Human Digestive Physiology Simulation</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs text-white/70">
           {currentStage.activeOrgans.join(' • ').toUpperCase().replace(/_/g, ' ')}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="self-end mt-auto w-full max-w-md pointer-events-auto">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-300">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-white">{currentStage.title}</h2>
            <div className="text-xs text-gray-400">{currentStage.id + 1} / {totalStages}</div>
          </div>

          <div className="min-h-[180px]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-blue-400 animate-pulse space-x-2">
                <Brain className="w-5 h-5 animate-spin" />
                <span>Simulating physiology...</span>
              </div>
            ) : data ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-gray-200">{data.explanation}</p>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <div className="flex items-center space-x-2 mb-2 text-xs text-blue-300 font-bold uppercase">
                            <Zap className="w-3 h-3" /> <span>Key Molecules</span>
                        </div>
                        <ul className="text-xs text-gray-400 list-disc list-inside">
                            {data.keyMolecules.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                    </div>
                     <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <div className="flex items-center space-x-2 mb-2 text-xs text-green-300 font-bold uppercase">
                            <Activity className="w-3 h-3" /> <span>System Crosstalk</span>
                        </div>
                        <ul className="text-xs text-gray-400 list-disc list-inside">
                            {data.systemInteractions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <button 
                onClick={onPrev}
                disabled={currentStage.id === 0}
                className="p-3 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-1">
                {Array.from({length: totalStages}).map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentStage.id ? 'w-6 bg-blue-500' : 'w-2 bg-gray-600'}`} />
                ))}
            </div>

            <button 
                onClick={onNext}
                disabled={currentStage.id === totalStages - 1}
                className="p-3 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
                <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
