'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Float } from '@react-three/drei'

function InvoiceMesh(props: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1
      meshRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh {...props} ref={meshRef}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshStandardMaterial color="#34d399" opacity={0.8} transparent roughness={0.1} metalness={0.8} />
      </mesh>
    </Float>
  )
}

function DataNodeMesh(props: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x -= delta * 0.5
      meshRef.current.rotation.y -= delta * 0.5
    }
  })

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={2}>
      <mesh {...props} ref={meshRef}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="#0ea5e9" wireframe />
      </mesh>
    </Float>
  )
}

export default function Hero3D() {
  return (
    <div className="h-[400px] w-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} color="#0ea5e9" intensity={2} />
        
        <InvoiceMesh position={[-1.5, 0, 0]} />
        <DataNodeMesh position={[2, 1, -1]} />
        <DataNodeMesh position={[1.5, -1.5, 1]} />
        <DataNodeMesh position={[3, 0, 0]} />
      </Canvas>
    </div>
  )
}
