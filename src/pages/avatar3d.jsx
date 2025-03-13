import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeDAvatar = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // 1️⃣ Initialize Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 2️⃣ Create a Sphere to Represent the Avatar's Head
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: false });
    const head = new THREE.Mesh(geometry, material);
    scene.add(head);

    // 3️⃣ Add Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // 4️⃣ Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      head.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // 5️⃣ Cleanup on Component Unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeDAvatar;
