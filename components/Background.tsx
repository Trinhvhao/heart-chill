import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Cloud, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const Background: React.FC = () => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group>
      {/* Distant Stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
      
      {/* Floating Sparkles around the heart area */}
      <Sparkles 
        count={200} 
        scale={20} 
        size={3} 
        speed={0.4} 
        opacity={0.5} 
        color="#ffccdd"
      />

      {/* Subtle Atmospheric Clouds */}
      <group position={[0, -10, -20]}>
         <Cloud opacity={0.3} speed={0.4} bounds={[30, 2, 5]} segments={10} color="#300520" />
      </group>
      <group position={[10, 10, -20]}>
         <Cloud opacity={0.2} speed={0.3} bounds={[20, 2, 5]} segments={10} color="#1a0b2e" />
      </group>

      <group ref={group}>
         {/* Moving starfield layer for depth */}
         <Stars radius={50} depth={10} count={1000} factor={6} fade speed={2} />
      </group>
    </group>
  );
};

export default Background;