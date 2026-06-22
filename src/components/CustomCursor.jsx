import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    
    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            
            // Check if hovering over a clickable element
            const target = e.target;
            const isClickable = 
                window.getComputedStyle(target).cursor === 'pointer' || 
                target.tagName.toLowerCase() === 'button' || 
                target.tagName.toLowerCase() === 'a';
                
            setIsPointer(isClickable);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Return null on touch devices where cursor is not needed
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: isPointer ? '40px' : '20px',
                height: isPointer ? '40px' : '20px',
                backgroundColor: isPointer ? 'rgba(99, 102, 241, 0.4)' : 'rgba(124, 58, 237, 0.6)',
                borderRadius: '50%',
                pointerEvents: 'none',
                transform: `translate(${position.x - (isPointer ? 20 : 10)}px, ${position.y - (isPointer ? 20 : 10)}px)`,
                transition: 'width 0.2s, height 0.2s, background-color 0.2s, transform 0.1s ease-out',
                zIndex: 9999,
                boxShadow: isPointer ? '0 0 20px rgba(99, 102, 241, 0.6)' : '0 0 10px rgba(124, 58, 237, 0.4)',
                backdropFilter: 'blur(2px)',
                mixBlendMode: 'screen'
            }}
        />
    );
};

export default CustomCursor;
