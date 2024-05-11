// QuantumSphereVisualization.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {ComplexNumber} from "@/utils/types";

interface QuantumStateVector {
  state: string;
  probability: number;
  amplitude?: ComplexNumber;
}

interface GateInfo {
  gateType: string;
  qubitIndex: number;
  gateIndex: number;
}

interface Props {
  qubits: number;
  gates: GateInfo[];
}

// 创造文字纹理和精灵的函数
function createTextTexture(text: string, fontsize: number = 256, fontface: string = "Consolas"): THREE.Texture {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 1024;
  canvas.height = 256;

  // 设置背景透明
  context.fillStyle = "rgba(255, 255, 255, 1)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  // 绘制文字
  context.font = `Bold ${fontsize}px ${fontface}`;
  context.textAlign = "center";
  context.fillStyle = "black";
  context.textBaseline = "middle"; // 确保文字垂直居中
  context.strokeStyle = "black";
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createTextSprite(text: string): THREE.Sprite {
  const texture = createTextTexture(text);
  const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true, // 确保材质支持透明度，以便调整背景透明等
      depthTest: false, // 禁用深度测试
      depthWrite: false // 为了避免在关闭深度测试的同时影响深度缓冲，通常也会禁用深度写入
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(1, 0.25, 1);
  return sprite;
}

// 产生给定数的组合数 C(n, k)
function generateCombinations(n: number, k: number): string[] {
  const result: string[] = [];
  
  for (let i = 0; i < (1 << n); i++) {
    const binaryStr = i.toString(2).padStart(n, '0');
    if (binaryStr.split('').filter(char => char === '1').length === k) {
      result.push(binaryStr);
    }
  }
  return result;
}

// 根据概率计算量子态的大小
function calculateSizeFromProbability(probability: number, minRadius: number, maxRadius: number): number {
  // 确保概率值在合理的范围内
  probability = Math.max(0, Math.min(1, probability));
  // 线性映射概率到[minRadius, maxRadius]范围
  return minRadius + (maxRadius - minRadius) * probability;
}

// 创建纬度圆环
function createLatitudeRing(bitNumber:number, scene: THREE.Scene) {
  for(let i = 1; i < bitNumber; i++){
    const lat = (Math.PI / bitNumber) * i;
    if (lat == Math.PI / 2) {
      continue; // 赤道不需要创建
    }
    // 圆环的参数
    const radius = Math.cos(lat); // 圆环的半径，基于纬度来计算
    const tubeRadius = 0.005; // 圆环的管道半径，相对较细
    const radialSegments = 36; // 圆环的分段数，可以根据需要调整以平滑圆环
    const tubularSegments = 100; // 圆环管道的分段数

    const ringGeometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xD3D3D3, transparent: true, opacity: 0.5 });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

    // 将圆环旋转到正确的纬度位置
    ringMesh.position.y = Math.cos(lat); // 设置圆环的高度
    ringMesh.rotation.x = Math.PI / 2; // 使圆环平行于XZ平面
    scene.add(ringMesh);
  }
}

// 计算量子态的位置和颜色
function calculatePositionAndColor(qState: QuantumStateVector) {
  // 计算相位差phi
  const phi = Math.atan2(qState.amplitude.imaginary, qState.amplitude.real);
  // state
  const state = qState.state;
  
  const numberOfOne = (state.split('1').length - 1)
  const combinations = generateCombinations(state.length, numberOfOne);
  const lat = (Math.PI / state.length) * numberOfOne
  const lon = (2 * Math.PI / combinations.length) * combinations.indexOf(state);
  // console.log("lat:" + lat + "lon:" + lon);

  const z = Math.sin(lat) * Math.cos(lon);
  const x = Math.sin(lat) * Math.sin(lon);
  const y = -Math.cos(lat);

  // console.log("x:" + x, "y:" + y, "z: " + z)
  // 根据phi计算颜色，假设phi范围[-π, π]映射到[0, 360]度颜色环
  const hue = ((phi + Math.PI) / (2 * Math.PI)) * 360; // 转换phi到0-360度
  const color = `hsl(${hue}, 100%, 50%)`; // 使用HSL色彩空间，饱和度和亮度固定，色相根据phi变化
  return {
    position: new THREE.Vector3(x, y, z),
    color: color
  };
}

const QuantumSphereVisualization: React.FC<Props> = ({ qubits, gates }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(mountRef.current){
      let current = mountRef.current;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      // 场景、相机、渲染器设置
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      // camera.position.z = 4;

      // const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

      // 设置相机位置以实现俯视效果
      camera.position.set(0, 1, 4); // X轴（左右），Y轴（上下），Z轴（前后）
      camera.lookAt(scene.position); // 确保相机朝向场景中心

      const renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(width, height);
      renderer.setClearColor(0xffffff); // 设置背景色为白色
      mountRef.current.appendChild(renderer.domElement);

      // 创建Q-Sphere（球体）
      const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xAFEEEE, wireframe: false, opacity: 0.5, transparent: true });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.name = 'sphere';
      sphere.renderOrder = 1;
      scene.add(sphere);

      
      // 创建高亮赤道面
      const CircleGeometry = new THREE.CircleGeometry(1, 32); // 调整内半径和外半径来匹配球体的大小
      const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xD3D3D3, side: THREE.DoubleSide, opacity: 0.2, transparent: true}); // 使用明亮的颜色
      const circle = new THREE.Mesh(CircleGeometry, circleMaterial);
      circle.rotation.x = Math.PI / 2; // 旋转使其垂直于Y轴

      circle.name = 'circle';
      circle.renderOrder = 0; // 确保它在球体上面
      scene.add(circle);

      createLatitudeRing(qubits, scene);

      // 确定每个量子比特上H门的数量
      const hGateCounts = new Array(qubits).fill(0);
      gates.forEach(gate => {
        if (gate.gateType === 'H') {
          hGateCounts[gate.qubitIndex] += 1;
        }
      });

      const d: QuantumStateVector[] = [];
      for (let i = 0; i < Math.pow(2, qubits); i++) {
        const state = i.toString(2).padStart(qubits, '0');
        let probability = 1.0; // 初始概率

        // 调整每个量子比特上H门数量为奇数的概率
        for (let qIndex = 0; qIndex < qubits; qIndex++) {
          if (hGateCounts[qIndex] % 2 === 0 && state[qubits-qIndex-1] === '1') {
            probability = 0;
            break;
          } else if (hGateCounts[qIndex] % 2 === 0 && state[qubits-qIndex-1] === '0') {

          } else if (hGateCounts[qIndex] % 2 === 1) {
            probability = probability / 2
          }
        }
        const s: QuantumStateVector = {
          state: state,
          probability: probability,
          amplitude: {
            real: 0,
            imaginary: 0,
          }
        }

        d.push(s);
      }

      const data: QuantumStateVector[] = []
          d.map( dd => {
          if (dd.probability !== 0) data.push(dd);
      } )


      // 绘制量子态
      data.forEach((quantumState, index) => {
        const {position, color} = calculatePositionAndColor(quantumState)
        const minRadius = 0.05; // 设置最小半径
        const maxRadius = 0.1; // 设置最大半径
        const radius = calculateSizeFromProbability(quantumState.probability, minRadius, maxRadius);
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const dot = new THREE.Mesh(geometry, material);
        dot.position.set(position.x, position.y, position.z);
        dot.name = `dot-${quantumState.state}`;
        dot.renderOrder = 2; // 确保它在球体和赤道面上面
        scene.add(dot);

        // 创建从球心到dot的线段
        const lineMaterial = new THREE.LineBasicMaterial({ color: color });
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0)); // 球心
        points.push(dot.position.clone()); // dot的位置
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.name = `line-${quantumState.state}`;
        line.renderOrder = 3; // 确保它在球体、赤道面和量子态上面
        scene.add(line);

        // 为量子态点创建文字标签
        const textSprite = createTextSprite('|' + quantumState.state + '〉');
        textSprite.position.copy(dot.position).add(new THREE.Vector3(0, 0.1, 0)); // 根据场景调整偏移量
        textSprite.scale.set(0.3, 0.09, 2); // 根据实际需要调整大小
        scene.add(textSprite);
      });

      const controls = new OrbitControls(camera, renderer.domElement);
      // controls.update();

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      
        controls.update();
      };
      
      animate();
      // 清理
      return () => {
        current && current.removeChild(renderer.domElement);
      };
    }
  }, [qubits, gates]);

  return (
    <>
      <div ref={mountRef} style={{height:"100%", width: "100%", maxHeight: "500px", maxWidth:"500px", aspectRatio: 1}}/>
    </>);
};

export default QuantumSphereVisualization;