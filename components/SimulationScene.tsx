import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Bone, Organ } from './Anatomy';
import { SimulationStage, StageInfo } from '../types';

interface SimulationSceneProps {
  stageInfo: StageInfo;
}

// Path for the food to travel
const FOOD_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 1.5, 0.2),   // Mouth
  new THREE.Vector3(0, 1.3, 0),     // Throat
  new THREE.Vector3(0, 1.0, 0),     // Stomach Entry
  new THREE.Vector3(-0.1, 0.9, 0),  // Stomach Churn
  new THREE.Vector3(0, 0.8, 0),     // Intestine Start
  new THREE.Vector3(0.1, 0.7, 0.1), // Intestine Loop 1
  new THREE.Vector3(-0.1, 0.6, -0.1),// Intestine Loop 2
  new THREE.Vector3(0, 0.5, 0),     // Excretion/Absorption point
]);

const FoodBolus = ({ stage }: { stage: SimulationStage }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    let targetProgress = 0;
    if (stage === SimulationStage.SENSORY_BRAIN) targetProgress = 0;
    else if (stage === SimulationStage.MOUTH_CHEWING) targetProgress = 0.05;
    else if (stage === SimulationStage.ESOPHAGUS_SWALLOWING) targetProgress = 0.2;
    else if (stage === SimulationStage.STOMACH_DIGESTION) targetProgress = 0.4;
    else if (stage === SimulationStage.INTESTINE_ABSORPTION) targetProgress = 0.8;
    else targetProgress = 1;

    const t = (Math.sin(state.clock.elapsedTime) + 1) / 2;
    const point = FOOD_PATH.getPointAt(targetProgress);
    
    if (stage === SimulationStage.STOMACH_DIGESTION) {
        point.x += Math.sin(state.clock.elapsedTime * 5) * 0.02;
        point.y += Math.cos(state.clock.elapsedTime * 4) * 0.02;
    }

    meshRef.current.position.lerp(point, 0.05);
    
    const s = 0.08 + Math.sin(state.clock.elapsedTime * 3) * 0.01;
    meshRef.current.scale.set(s, s, s);
  });

  if (stage === SimulationStage.SENSORY_BRAIN || stage > SimulationStage.CIRCULATORY_RESPONSE) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 16, 16]} />
      {/* Intense Green Energy Ball */}
      <meshBasicMaterial color="#33ff66" />
      <pointLight distance={0.8} intensity={3} color="#33ff66" decay={2} />
    </mesh>
  );
};

const NervousSystem = ({ active }: { active: boolean }) => {
    // Synchronously create geometry to guarantee validity before render
    const geometry = useMemo(() => {
        const segmentCount = 40;
        const posArray = new Float32Array(segmentCount * 2 * 3); // 40 segments, 2 vertices each, 3 coords (xyz)

        for(let i = 0; i < segmentCount; i++) {
             const startY = Math.random() * 1.5;
             const width = 0.3 * (1 - startY/2); 
             
             // Start Point
             posArray[i * 6 + 0] = 0;
             posArray[i * 6 + 1] = startY;
             posArray[i * 6 + 2] = 0;

             // End Point
             posArray[i * 6 + 3] = (Math.random()-0.5)*width + (Math.random()-0.5);
             posArray[i * 6 + 4] = startY - Math.random();
             posArray[i * 6 + 5] = (Math.random()-0.5)*0.5;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        return geo;
    }, []);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial 
                color={active ? "#ffcc00" : "#0055ff"} 
                transparent 
                opacity={active ? 0.8 : 0.2} 
                linewidth={1} 
            />
        </lineSegments>
    )
}

const BodyModel = ({ stageInfo }: { stageInfo: StageInfo }) => {
  const activeSet = new Set(stageInfo.activeOrgans);

  return (
    <group position={[0, -1, 0]}>
      {/* SKELETON */}
      {/* Spine */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Bone key={`spine-${i}`} position={[0, i * 0.15, -0.1]} height={0.12} radius={0.03} />
      ))}
      {/* Ribs (simplified) */}
      {Array.from({ length: 6 }).map((_, i) => (
         <group key={`rib-${i}`} position={[0, 0.8 + (i*0.15), -0.1]}>
            <Bone position={[0.2, 0, 0.1]} rotation={[0, 0, -1]} height={0.35} radius={0.015} />
            <Bone position={[-0.2, 0, 0.1]} rotation={[0, 0, 1]} height={0.35} radius={0.015} />
         </group>
      ))}
      {/* Skull */}
      <Bone position={[0, 2.6, 0]} height={0.4} radius={0.12} active={activeSet.has('brain')} /> 
      {/* Pelvis */}
      <Bone position={[0, 0, 0]} height={0.25} radius={0.08} rotation={[0,0,1.57]} />


      {/* ORGANS */}
      <Organ type="brain" position={[0, 2.7, 0]} active={activeSet.has('brain') || activeSet.has('hypothalamus')} scale={0.7} />
      <Organ type="heart" position={[0.05, 1.5, 0.1]} active={activeSet.has('heart')} scale={1} />
      
      {/* Digestive Tract */}
      <Organ type="stomach" position={[0, 1.0, 0.1]} active={activeSet.has('stomach')} scale={0.6} />
      <Organ type="liver" position={[-0.2, 1.1, 0.1]} active={activeSet.has('liver')} scale={0.6} />
      <Organ type="intestines" position={[0, 0.5, 0.1]} active={activeSet.has('small_intestine') || activeSet.has('large_intestine')} scale={1.2} />

      {/* Nervous System Visualization */}
      <NervousSystem active={activeSet.has('vagus_nerve') || activeSet.has('brain')} />

      {/* Dynamic Food */}
      <FoodBolus stage={stageInfo.id} />
    </group>
  );
};

export const SimulationScene: React.FC<SimulationSceneProps> = ({ stageInfo }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state) => {
    if (cameraRef.current) {
      const targetPos = new THREE.Vector3(...stageInfo.cameraPosition);
      const lookAtPos = new THREE.Vector3(...stageInfo.cameraTarget);
      
      cameraRef.current.position.lerp(targetPos, 0.05);
      cameraRef.current.lookAt(lookAtPos);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef as any} makeDefault position={[0, 1.5, 3]} fov={50} />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} enableZoom={true} />

      {/* Hologram Lighting Setup */}
      {/* Rim Light (Cool Blue) */}
      <spotLight position={[5, 5, -5]} intensity={10} color="#00ffff" angle={0.5} penumbra={1} />
      
      {/* Fill Light (Deep Blue) */}
      <pointLight position={[-5, 2, 5]} intensity={5} color="#0033aa" distance={10} />
      
      {/* Key Light (White/Cyan for clarity) */}
      <pointLight position={[2, 3, 5]} intensity={2} color="#ccffff" distance={10} />

      <BodyModel stageInfo={stageInfo} />

      {/* Post Processing for Glow Effect */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            intensity={1.5} 
        />
      </EffectComposer>
    </>
  );
};