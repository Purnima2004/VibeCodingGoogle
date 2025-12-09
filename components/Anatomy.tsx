import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere } from '@react-three/drei';

// --- Holographic Material ---
// High-tech medical hologram look: Glassy, emissive, with wireframe overlay option
const HologramMaterial = ({ active = false, wireframe = false, opacity = 0.3 }) => {
  const color = active ? "#ff3300" : "#00f3ff"; // Alert Red vs Cyan
  const emissive = active ? "#ff0000" : "#0044aa";

  return (
    <meshPhysicalMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={active ? 2.5 : 1.2}
      transmission={wireframe ? 0 : 0.9} // Wireframe is solid, base is glass
      roughness={0}
      metalness={0.8}
      clearcoat={1}
      thickness={2}
      transparent
      opacity={wireframe ? 0.1 : opacity}
      wireframe={wireframe}
      side={THREE.DoubleSide}
    />
  );
};

// --- Procedural Bone Component ---
interface BoneProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  height: number;
  radius?: number;
  active?: boolean;
}

export const Bone: React.FC<BoneProps> = ({ position, rotation = [0, 0, 0], height, radius = 0.08, active = false }) => {
  const group = useRef<THREE.Group>(null);

  // Memoize geometry creation to ensure it is created once and disposed automatically by R3F
  // Using LatheGeometry with explicit points array
  const geometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const segments = 20;
    const safeHeight = Math.max(height, 0.01); 
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments; 
      const y = (t - 0.5) * safeHeight; 
      const distFromCenter = Math.abs(t - 0.5) * 2; 
      const currentRadius = radius * (1.0 + 2.5 * Math.pow(distFromCenter, 5));
      points.push(new THREE.Vector2(currentRadius, y));
    }
    
    // Ensure points array is strictly valid
    if (points.length < 2) {
       points.length = 0;
       points.push(new THREE.Vector2(radius, -safeHeight/2));
       points.push(new THREE.Vector2(radius, safeHeight/2));
    }

    return new THREE.LatheGeometry(points, 16);
  }, [height, radius]);

  return (
    <group ref={group} position={position} rotation={rotation as [number, number, number]}>
      {/* Glassy Inner Bone */}
      <mesh geometry={geometry}>
        <HologramMaterial active={active} opacity={0.4} />
      </mesh>
      
      {/* Wireframe Overlay for Tech Look */}
      <mesh scale={[1.02, 1.0, 1.02]} geometry={geometry}>
        <meshBasicMaterial 
          color={active ? "#ff0000" : "#00ffff"} 
          wireframe 
          transparent 
          opacity={0.15} 
        />
      </mesh>
    </group>
  );
};

// --- Organ Component ---
interface OrganProps {
  type: 'brain' | 'stomach' | 'liver' | 'intestines' | 'heart' | 'lungs';
  active: boolean;
  position: [number, number, number];
  scale?: number;
}

export const Organ: React.FC<OrganProps> = ({ type, active, position, scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Subtle breathing animation for vital organs
  useFrame((state) => {
    if (meshRef.current && (type === 'heart' || type === 'lungs')) {
      const t = state.clock.getElapsedTime();
      const s = scale + Math.sin(t * (type === 'heart' ? 3 : 1)) * 0.05;
      meshRef.current.scale.set(s, s, s);
    }
  });

  const Geometry = useMemo(() => {
    switch (type) {
      case 'brain':
        return (
          <group scale={scale}>
            <Sphere args={[0.25, 32, 32]} position={[0, 0.1, 0]} scale={[1, 0.8, 1.2]}>
              <HologramMaterial active={active} opacity={0.6} />
            </Sphere>
            {/* Cerebellum */}
            <Sphere args={[0.15, 16, 16]} position={[0, -0.1, -0.1]}>
               <HologramMaterial active={active} opacity={0.6} />
            </Sphere>
             {/* Tech Grid Overlay */}
            <mesh position={[0, 0.1, 0]} scale={[1.05, 0.85, 1.25]}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshBasicMaterial color={active ? "#ff0000" : "#00ffff"} wireframe transparent opacity={0.1} />
            </mesh>
          </group>
        );
      case 'stomach':
        return (
           <group scale={scale}>
            <Sphere args={[0.2, 32, 32]} position={[0, 0, 0]} scale={[1, 1.5, 0.8]} rotation={[0, 0, 0.5]}>
              <HologramMaterial active={active} opacity={0.6} />
            </Sphere>
             <mesh position={[0, 0, 0]} scale={[1.05, 1.55, 0.85]} rotation={[0, 0, 0.5]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color={active ? "#ff0000" : "#00ffff"} wireframe transparent opacity={0.1} />
            </mesh>
          </group>
        );
      case 'liver':
        return (
          <mesh ref={meshRef} scale={scale} position={[0.1, 0, 0]}>
            <Sphere args={[0.25, 32, 32]} scale={[1.4, 0.8, 0.8]}>
               <HologramMaterial active={active} opacity={0.6} />
            </Sphere>
             <mesh scale={[1.45, 0.85, 0.85]}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshBasicMaterial color={active ? "#ff0000" : "#00ffff"} wireframe transparent opacity={0.1} />
            </mesh>
          </mesh>
        );
      case 'intestines':
        return (
           <group scale={scale}>
             <TorusKnotWrapper active={active} />
           </group>
        );
      case 'heart':
        return (
          <mesh ref={meshRef} scale={scale}>
             <Sphere args={[0.12, 16, 16]} scale={[1, 1.2, 1]}>
                <HologramMaterial active={active} opacity={0.7} />
             </Sphere>
             <mesh scale={[1.05, 1.25, 1.05]}>
                <sphereGeometry args={[0.12, 10, 10]} />
                <meshBasicMaterial color={active ? "#ff0000" : "#ff0088"} wireframe transparent opacity={0.2} />
            </mesh>
          </mesh>
        );
       default:
        return null;
    }
  }, [type, active, scale]);

  return <group position={position}>{Geometry}</group>;
};

// Helper for Intestines
const TorusKnotWrapper = ({active}: {active: boolean}) => {
    return (
        <group scale={[0.15, 0.15, 0.15]} rotation={[1.5,0,0]}>
            <mesh>
                <torusKnotGeometry args={[1, 0.3, 64, 8, 3, 5]} />
                <HologramMaterial active={active} opacity={0.5} />
            </mesh>
            <mesh scale={[1.05, 1.05, 1.05]}>
                <torusKnotGeometry args={[1, 0.3, 64, 8, 3, 5]} />
                <meshBasicMaterial color={active ? "#ff0000" : "#00ffff"} wireframe transparent opacity={0.1} />
            </mesh>
        </group>
    )
}