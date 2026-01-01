import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HeartParticleProps } from '../types';

// Custom Shader for Twinkling Particles
const HeartShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
    uSize: { value: 250.0 },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uSize;
    
    attribute float aRandom;
    attribute float aScale;
    
    varying vec3 vColor;

    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Twinkle logic
      float pulse = sin(uTime * 4.0 + aRandom * 20.0) * 0.4 + 0.8;
      
      gl_PointSize = uSize * aScale * pulse * uPixelRatio / -mvPosition.z;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    
    void main() {
      float d = distance(gl_PointCoord, vec2(0.5));
      if (d > 0.5) discard;

      // Sharp gradient
      float strength = 1.0 - (d * 2.0);
      strength = pow(strength, 3.0); 

      gl_FragColor = vec4(vColor, strength); 
    }
  `
};

const HeartParticles: React.FC<HeartParticleProps> = ({ count = 15000, scale = 1 }) => {
  const mesh = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const randoms = [];
    const scales = [];
    
    // CRITICAL FIX: Reduce core density significantly.
    // Overlapping particles in the center cause whiteout due to additive blending.
    // 92% Shell, 8% Core (just faint dust)
    const shellCount = Math.floor(count * 0.92); 
    const coreCount = count - shellCount;

    const addParticle = (u: number, v: number, isShell: boolean) => {
      // Parametric Heart Formula
      const xBase = 16 * Math.pow(Math.sin(u), 3);
      const yBase = 13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
      
      const sinV = Math.sin(v);
      const cosV = Math.cos(v);

      let x = xBase * sinV;
      let y = yBase * sinV;
      let z = cosV * 8.0; 

      const normalizeFactor = 0.8;
      x *= normalizeFactor;
      y *= normalizeFactor;
      z *= normalizeFactor;

      if (!isShell) {
        // Push core particles deeper inside
        const r = Math.pow(Math.random(), 0.8); 
        x *= r;
        y *= r;
        z *= r;
      }

      positions.push(x, y, z);
      randoms.push(Math.random());

      // --- COLOR & SIZE LOGIC ---
      if (isShell) {
        scales.push(1.5); 
        
        // Shell: HDR Colors (Values > 1.0)
        const isHighlight = Math.random() > 0.4;
        if (isHighlight) {
          // Diamond White
          colors.push(5.0, 5.0, 6.0); 
        } else {
          // Neon Pink
          colors.push(4.0, 0.1, 2.0);
        }
      } else {
        // Core: TINY and VERY DARK
        scales.push(0.3); 
        
        // Intensity ~0.02. Even if 50 particles overlap, it reaches only ~1.0.
        // This prevents the white blob center.
        colors.push(0.05, 0.005, 0.01);
      }
    };

    // 1. GENERATE SHELL
    for (let i = 0; i < shellCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;
      addParticle(u, v, true);
    }

    // 2. GENERATE CORE
    for (let i = 0; i < coreCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;
      addParticle(u, v, false);
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      randoms: new Float32Array(randoms),
      scales: new Float32Array(scales)
    };
  }, [count]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }

    if (mesh.current) {
      const time = state.clock.getElapsedTime();
      const beat = Math.sin(time * 2.0) * 0.05 + Math.sin(time * 4.0) * 0.01; 
      
      const currentScale = scale + beat * 0.1;
      mesh.current.scale.setScalar(currentScale);
      mesh.current.rotation.y = 0;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={particles.randoms.length}
          array={particles.randoms}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={particles.scales.length}
          array={particles.scales}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent={true}
        vertexColors={true}
        uniforms={HeartShaderMaterial.uniforms}
        vertexShader={HeartShaderMaterial.vertexShader}
        fragmentShader={HeartShaderMaterial.fragmentShader}
      />
    </points>
  );
};

export default HeartParticles;