import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import HeartParticles from './HeartParticles';
import Background from './Background';

const Scene: React.FC = () => {
  return (
    <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-black via-[#0a0208] to-[#120412]">
      <Canvas dpr={[1, 2]} gl={{ antialias: false, toneMappingExposure: 1 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={50} />
        
        <color attach="background" args={['#050105']} />
        
        {/* Lights - Mostly for scene ambiance, particles use emissive shader */}
        <ambientLight intensity={0.2} color="#ffb6c1" />
        
        {/* Objects - High count for high definition */}
        <HeartParticles count={15000} scale={1} />
        <Background />

        {/* Controls - No AutoRotate */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={15} 
          maxDistance={60}
          autoRotate={false}
        />

        {/* Post Processing Effects */}
        <EffectComposer enableNormalPass={false}>
          {/* 
             Bloom Threshold: 1.1
             This is CRITICAL:
             - Core particles have color intensity ~0.4 -> NO GLOW
             - Shell particles have color intensity ~3.5 -> STRONG GLOW
          */}
          <Bloom 
            luminanceThreshold={1.1} 
            mipmapBlur 
            intensity={2.0} 
            radius={0.6}
            levels={8}
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Scene;