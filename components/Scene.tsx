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
        
        <ambientLight intensity={0.1} color="#ffb6c1" />
        
        <HeartParticles count={15000} scale={1} />
        <Background />

        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={15} 
          maxDistance={60}
          autoRotate={false}
        />

        <EffectComposer enableNormalPass={false}>
          {/* 
             Bloom Settings Tuning:
             - luminanceThreshold: 1.5 -> Very High. Only shell particles (intensity ~5.0) will glow.
             - radius: 0.3 -> Tight glow around the sparks.
             - intensity: 1.5 -> Make the shell pop.
          */}
          <Bloom 
            luminanceThreshold={1.5} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.3}
            levels={8}
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Scene;