'use client';

import React, { useRef } from 'react';
import HG from '../img/Hadamard_Gate.svg';

interface ISvgImage {
    src: string;
    alt: string;
    style?: React.CSSProperties;
}

interface DraggableSVGProps {
    svgImage: ISvgImage;
    onDrop: (droppedGate: string) => void;
}

const DraggableSVG: React.FC<DraggableSVGProps> = ({ svgImage, onDrop }) => {
    const gateRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (event: React.DragEvent) => {
        event.dataTransfer.setData('text', svgImage.src); // 设置拖动数据
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault(); // 启用拖放
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        if (gateRef.current) {
            onDrop(event.dataTransfer.getData('text')); // 调用父组件的 drop 处理函数
        }
    };

    return (
        <div
            ref={gateRef}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                cursor: 'pointer',
                margin: '10px',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(svgImage.style || {}) // 允许外部传入的样式覆盖默认样式
            }}
        >
            <img src={svgImage.src} alt={svgImage.alt} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );
};

const ComponentPanel = () => {
    const handleDrop = (droppedGate: string) => {
        console.log('Dropped gate:', droppedGate);
        // 这里可以添加逻辑，比如更新量子电路的状态以添加门
    };

    const hadamardSvg: ISvgImage = {
        src: HG.src,
        alt: 'Hadamard Gate',
        // 可以在这里添加样式
    };

    return (
        <div>
            <DraggableSVG svgImage={hadamardSvg} onDrop={handleDrop} />
            {/* 其他元件 */}
        </div>
    );
};

export default ComponentPanel;