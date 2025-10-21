import { Environment, Float, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';

// Om Symbol Model Component
function OmModel({ scale = 1 }) {
  const { scene } = useGLTF('/om_symbol.glb');
  const modelRef = useRef();

  useFrame((state) => {
    if (modelRef.current) {
      // Subtle floating motion
    //   modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <primitive 
        ref={modelRef}
        object={scene} 
        scale={scale}
        position={[0, 0, 0]}
      />
    </Float>
  );
}


// Loading Fallback
function Loader() {
  return (
    <mesh>
      <torusGeometry args={[1, 0.4, 16, 100]} />
      <meshStandardMaterial color="#fbbf24" />
    </mesh>
  );
}

/**
 * Unified 3D Om Model Component
 * @param {boolean} simple - If true, shows only the Om model. If false, includes decorative elements
 * @param {number} scale - Scale of the Om model (default: 3.5)
 * @param {string} height - CSS height (default: '100%')
 * @param {string} background - Background style (default: 'transparent' for simple, gradient for complex)
 */
export default function OmModel3D({ 
  simple = true, 
  scale = 3.5, 
  height = '100%',
  minHeight = '450px',
  showInstructions = false 
}) {
  const containerStyle = {
    width: '100%',
    height: height,
    minHeight: minHeight,
    position: 'relative',
    borderRadius: simple ? '0' : '24px',
    overflow: 'hidden',
    boxShadow: simple ? 'none' : '0 20px 60px rgba(251, 191, 36, 0.4)',
    background: simple ? 'transparent' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
  };

  return (
    <div style={containerStyle}>
      
      
      <Canvas 
        camera={{ position: [0, 0, simple ? 6 : 8], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true 
        }}
        style={{ background: 'transparent' }}
      >
        {/* Background color (only for complex mode) */}
        {!simple && <color attach="background" args={['#0f172a']} />}
        
        {/* Lighting Setup */}
        <ambientLight intensity={simple ? 0.5 : 0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -5, -5]} intensity={0.6} color="#fbbf24" />
        <spotLight
          position={[5, 10, 5]}
          angle={0.5}
          penumbra={1}
          intensity={1}
          color="#f59e0b"
        />
        {!simple && <pointLight position={[0, 0, 5]} intensity={0.5} color="#14b8a6" />}
        
        {/* Environment for better reflections */}
        <Environment preset="sunset" />
        
        
        
        {/* 3D Om Model */}
        <Suspense fallback={<Loader />}>
          <OmModel scale={scale} />
        </Suspense>
        
        
        
        {/* Interactive Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minDistance={4}
          maxDistance={simple ? 10 : 12}
          autoRotate={true}
          autoRotateSpeed={simple ? 1 : 0.5}
          dampingFactor={0.05}
          rotateSpeed={simple ? 0.8 : 0.5}
          enableDamping={false}
        />
      </Canvas>
    </div>
  );
}

// Preload the 3D model
useGLTF.preload('/om_symbol.glb');
