import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SimulationScene } from './components/SimulationScene';
import { InfoPanel } from './components/InfoPanel';
import { STAGES } from './constants';
import { Loader } from '@react-three/drei';

const App: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const handleNext = () => {
    if (currentStageIndex < STAGES.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(prev => prev - 1);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Transparent canvas to let CSS radial gradient show */}
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ 
          antialias: true, 
          toneMappingExposure: 1.5, 
          alpha: true 
        }}
      >
        <SimulationScene stageInfo={STAGES[currentStageIndex]} />
      </Canvas>
      
      <Loader 
        containerStyles={{ background: '#0a192f' }} 
        innerStyles={{ background: '#333', width: '200px' }} 
        barStyles={{ background: '#00ffff', height: '4px', boxShadow: '0 0 10px #00ffff' }}
        dataInterpolation={(p) => `Initializing Hologram ${p.toFixed(0)}%`}
      />

      <InfoPanel 
        currentStage={STAGES[currentStageIndex]} 
        onNext={handleNext} 
        onPrev={handlePrev}
        totalStages={STAGES.length}
      />
    </div>
  );
};

export default App;