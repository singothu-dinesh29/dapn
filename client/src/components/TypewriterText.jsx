'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterText = ({ texts, speed = 40, delayAfterLine = 800 }) => {
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentLineIndex >= texts.length) {
            setIsComplete(true);
            return;
        }

        let currentText = texts[currentLineIndex];
        let charIndex = 0;
        let timer;

        const type = () => {
            if (charIndex <= currentText.length) {
                setDisplayedText(currentText.slice(0, charIndex));
                charIndex++;
                timer = setTimeout(type, speed);
            } else {
                setTimeout(() => {
                    if (currentLineIndex < texts.length - 1) {
                        setCurrentLineIndex(prev => prev + 1);
                        setDisplayedText('');
                    } else {
                        setIsComplete(true);
                    }
                }, delayAfterLine);
            }
        };

        type();
        return () => clearTimeout(timer);
    }, [currentLineIndex, texts, speed, delayAfterLine]);

    return (
        <div className="font-medium text-zinc-800 leading-relaxed space-y-6">
            <div className="min-h-[1.5em]">
                {texts.slice(0, currentLineIndex).map((text, i) => (
                    <p key={i} className="mb-6 last:mb-0 text-lg md:text-xl font-medium tracking-tight">
                        {text}
                    </p>
                ))}
                {!isComplete && (
                    <span className="text-lg md:text-xl font-medium tracking-tight border-r-2 border-blue-500 pr-1 animate-pulse italic">
                        {displayedText}
                    </span>
                )}
                {isComplete && texts.length > 0 && (
                     <p className="text-lg md:text-xl font-medium tracking-tight">
                        {texts[texts.length - 1]}
                        <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse align-middle" />
                    </p>
                )}
            </div>
        </div>
    );
};

export default TypewriterText;
