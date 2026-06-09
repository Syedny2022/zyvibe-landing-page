import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Dashboard Group
    const dashboard = new THREE.Group();
    scene.add(dashboard);

    // Floating Panels
    const createPanel = (color: number, x: number, y: number, z: number) => {
      const geometry = new THREE.BoxGeometry(2, 1.5, 0.1);
      const material = new THREE.MeshStandardMaterial({ 
        color, 
        transparent: true, 
        opacity: 0.7,
        emissive: color,
        emissiveIntensity: 0.5
      });
      const panel = new THREE.Mesh(geometry, material);
      panel.position.set(x, y, z);
      dashboard.add(panel);
      return panel;
    };

    const panels = [
      createPanel(0xff7f50, -3, 1, -5), // Coral
      createPanel(0x00f2ff, 3, -1, -5),  // Blue
      createPanel(0xff7f50, 0, 2, -7),   // Coral
    ];

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.5
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      dashboard.rotation.y += 0.005;
      dashboard.rotation.x += 0.002;

      panels.forEach((panel, i) => {
        panel.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
      });

      particlesMesh.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none" />;
}
