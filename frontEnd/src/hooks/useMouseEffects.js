import { useState, useRef, useCallback, useEffect } from 'react';

export const use3DTilt = (maxRotation = 10) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const ref = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateX = (-mouseY / (rect.height / 2)) * maxRotation;
        const rotateY = (mouseX / (rect.width / 2)) * maxRotation;

        setRotation({ x: rotateX, y: rotateY });
    }, [maxRotation]);

    const handleMouseLeave = useCallback(() => {
        setRotation({ x: 0, y: 0 });
    }, []);

    return {
        ref,
        style: {
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: rotation.x === 0 && rotation.y === 0 ? 'transform 0.5s ease' : 'none'
        },
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave
    };
};

export const useMagnetic = (strength = 0.5) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const ref = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
            setOffset({ x: dx * strength, y: dy * strength });
        } else {
            setOffset({ x: 0, y: 0 });
        }
    }, [strength]);

    const handleMouseLeave = useCallback(() => {
        setOffset({ x: 0, y: 0 });
    }, []);

    // Use standard window event listener for smoother tracking
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    return {
        ref,
        style: {
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: offset.x === 0 && offset.y === 0 ? 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
        },
        onMouseLeave: handleMouseLeave
    };
};
