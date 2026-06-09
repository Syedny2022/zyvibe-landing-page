import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Dashboard3DProps {
  className?: string;
}

const Dashboard3D: React.FC<Dashboard3DProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff7f50, 2); // Coral glow
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x00bfff, 2); // Blue glow
    blueLight.position.set(-2, -2, 2);
    scene.add(blueLight);

    // Dashboard Base
    const dashboardGeometry = new THREE.BoxGeometry(4, 0.1, 3);
    const dashboardMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a, 
      roughness: 0.1, 
      metalness: 0.8,
      transparent: true,
      opacity: 0.9
    });
    const dashboard = new THREE.Mesh(dashboardGeometry, dashboardMaterial);
    dashboard.rotation.x = 0.2;
    scene.add(dashboard);

    // Social Icons (Represented by spheres/cubes for simplicity in this demo)
    const icons: THREE.Mesh[] = [];
    const iconColors = [0xff0000, 0x1da1f2, 0xff00ff]; // YT, Twitter, Insta
    const iconNames = ['YouTube', 'Twitter', 'Instagram'];

    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.SphereGeometry(0.2, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color: iconColors[i], emissive: iconColors[i], emissiveIntensity: 0.5 });
      const icon = new THREE.Mesh(geometry, material);
      icon.position.set(-1.2 + i * 1.2, 0.4, 0.5);
      icon.userData = { type: 'icon', name: iconNames[i], originalColor: iconColors[i] };
      scene.add(icon);
      icons.push(icon);
    }

    // 3D Chart
    const bars: THREE.Mesh[] = [];
    const barData = [1.2, 1.8, 1.5, 2.2, 1.7];
    for (let i = 0; i < 5; i++) {
      const h = barData[i] * 0.5;
      const geometry = new THREE.BoxGeometry(0.3, h, 0.3);
      const material = new THREE.MeshStandardMaterial({ color: 0x00bfff, emissive: 0x00bfff, emissiveIntensity: 0.2 });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.set(-1 + i * 0.5, h / 2 + 0.1, -0.5);
      bar.userData = { type: 'chart', value: barData[i], index: i };
      scene.add(bar);
      bars.push(bar);
    }

    // Pen
    const penGroup = new THREE.Group();
    const penBodyGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
    const penBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const penBody = new THREE.Mesh(penBodyGeo, penBodyMat);
    penGroup.add(penBody);

    const penTipGeo = new THREE.ConeGeometry(0.05, 0.2, 16);
    const penTipMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const penTip = new THREE.Mesh(penTipGeo, penTipMat);
    penTip.position.y = -0.6;
    penGroup.add(penTip);

    penGroup.position.set(1.5, 1, 0);
    penGroup.rotation.z = -Math.PI / 4;
    scene.add(penGroup);

    // Interaction setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      // Reset all icons
      icons.forEach(icon => {
        (icon.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
        icon.scale.set(1, 1, 1);
      });

      if (intersects.length > 0) {
        const obj = intersects[0].object as THREE.Mesh;
        if (obj.userData.type === 'icon') {
          obj.scale.set(1.2, 1.2, 1.2);
          (obj.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5;
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object as THREE.Mesh;
        if (obj.userData.type === 'chart') {
          // Animate bar
          const originalScaleY = obj.scale.y;
          obj.scale.y = originalScaleY * 1.5;
          setTimeout(() => { obj.scale.y = originalScaleY; }, 200);

          // Show tooltip
          const rect = containerRef.current!.getBoundingClientRect();
          setTooltip({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top - 40,
            text: `Engagement: ${obj.userData.value}M`
          });
          setTimeout(() => setTooltip(null), 2000);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    // Animation loop
    let frameId: number;
    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);

      // Floating animations
      dashboard.position.y = Math.sin(time * 0.001) * 0.1;
      dashboard.rotation.y = Math.sin(time * 0.0005) * 0.05;

      icons.forEach((icon, i) => {
        icon.position.y = 0.4 + Math.sin(time * 0.002 + i) * 0.1;
      });

      penGroup.position.y = 1 + Math.sin(time * 0.0015) * 0.2;
      penGroup.rotation.y += 0.01;

      renderer.render(scene, camera);
    };
    animate(0);

    // Resize handler
    const handleResize = () => {
      const newWidth = containerRef.current!.clientWidth;
      const newHeight = containerRef.current!.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)}>
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-10 px-3 py-1 text-xs font-medium text-white bg-black/80 rounded-full pointer-events-none border border-white/20 backdrop-blur-sm"
            style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}
          >
            {tooltip.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard3D;
