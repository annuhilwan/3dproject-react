import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import '../styles/ThreeScene.css';

interface ThreeSceneProps {
  onSceneReady?: (scene: THREE.Scene) => void;
}

export const ThreeScene = ({ onSceneReady }: ThreeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsRef = useRef<THREE.Object3D[]>([]);
  const [stats, setStats] = useState({ fps: 0, objects: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 100, 1000);
    sceneRef.current = scene;

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    cameraRef.current = camera;

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ffff, 0.5);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    // Create interactive objects
    const createObjects = () => {
      // Rotating Cube
      const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
      const cubeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        emissive: 0x330000,
        shininess: 100
      });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(-4, 0, 0);
      cube.castShadow = true;
      cube.receiveShadow = true;
      scene.add(cube);
      objectsRef.current.push(cube);

      // Rotating Sphere
      const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
      const sphereMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4ecdc4,
        emissive: 0x003333,
        shininess: 100
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(0, 0, 0);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      scene.add(sphere);
      objectsRef.current.push(sphere);

      // Rotating Pyramid
      const pyramidGeometry = new THREE.TetrahedronGeometry(1.5, 0);
      const pyramidMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffd93d,
        emissive: 0x332200,
        shininess: 100
      });
      const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
      pyramid.position.set(4, 0, 0);
      pyramid.castShadow = true;
      pyramid.receiveShadow = true;
      scene.add(pyramid);
      objectsRef.current.push(pyramid);

      // Torus (ring)
      const torusGeometry = new THREE.TorusGeometry(2, 0.4, 16, 100);
      const torusMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xa8edea,
        emissive: 0x001a1a,
        shininess: 100
      });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torus.position.set(-2, 3, 0);
      torus.castShadow = true;
      torus.receiveShadow = true;
      scene.add(torus);
      objectsRef.current.push(torus);

      // Icosahedron
      const icoGeometry = new THREE.IcosahedronGeometry(1.2, 4);
      const icoMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff006e,
        emissive: 0x330011,
        shininess: 100
      });
      const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
      icosahedron.position.set(2, 3, 0);
      icosahedron.castShadow = true;
      icosahedron.receiveShadow = true;
      scene.add(icosahedron);
      objectsRef.current.push(icosahedron);

      // Ground plane
      const groundGeometry = new THREE.PlaneGeometry(50, 50);
      const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2d3561,
        roughness: 0.8,
        metalness: 0.2
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -6;
      ground.receiveShadow = true;
      scene.add(ground);
    };

    createObjects();

    if (onSceneReady) {
      onSceneReady(scene);
    }

    // Animation Loop
    let frameCount = 0;
    let lastTime = performance.now();

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate objects with different speeds
      objectsRef.current.forEach((obj, index) => {
        obj.rotation.x += (0.01 + index * 0.002);
        obj.rotation.y += (0.01 + index * 0.003);
        
        // Add bobbing motion
        obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
      });

      // Update camera position for dynamic view
      const time = Date.now() * 0.0003;
      camera.position.x = Math.sin(time) * 15;
      camera.position.z = Math.cos(time) * 15 + 10;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);

      // Calculate FPS
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        setStats({ fps: frameCount, objects: objectsRef.current.length });
        frameCount = 0;
        lastTime = currentTime;
      }
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [onSceneReady]);

  return (
    <div className="three-scene-container">
      <div ref={containerRef} className="three-canvas" />
      <div className="stats">
        <div className="stat-item">FPS: {stats.fps}</div>
        <div className="stat-item">Objects: {stats.objects}</div>
      </div>
    </div>
  );
};
