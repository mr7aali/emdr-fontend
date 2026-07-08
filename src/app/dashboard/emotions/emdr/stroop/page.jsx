"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StroopTest() {
    const words = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
    const colors = {
        'RED': '#c1475b',
        'BLUE': '#4a7c9e',
        'GREEN': '#6b8e23',
        'YELLOW': '#d4a017'
    };

    const [gameState, setGameState] = useState('instructions');
    const [currentRound, setCurrentRound] = useState(0);
    const [correctScore, setCorrectScore] = useState(0);
    const [totalRounds] = useState(10);
    const [timer, setTimer] = useState(0);
    const [displayWord, setDisplayWord] = useState('');
    const [displayColor, setDisplayColor] = useState('');
    const [feedback, setFeedback] = useState({ text: '', type: '' });
    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    const startTimeRef = useRef(0);
    const timerIntervalRef = useRef(null);

    useEffect(() => {
        if (gameState === 'playing') {
            startTimeRef.current = Date.now();
            timerIntervalRef.current = setInterval(() => {
                setTimer((Date.now() - startTimeRef.current) / 1000);
            }, 100);
            nextRound(1);
        } else {
            clearInterval(timerIntervalRef.current);
        }
        return () => clearInterval(timerIntervalRef.current);
    }, [gameState]);

    const startGame = () => {
        setGameState('playing');
        setCurrentRound(0);
        setCorrectScore(0);
        setTimer(0);
    };

    const nextRound = (roundNumber) => {
        const nextR = roundNumber !== undefined ? roundNumber : currentRound + 1;

        if (nextR > totalRounds) {
            setGameState('completed');
            return;
        }

        setCurrentRound(nextR);
        const wordIndex = Math.floor(Math.random() * words.length);
        let colorIndex;
        do {
            colorIndex = Math.floor(Math.random() * words.length);
        } while (colorIndex === wordIndex && Math.random() > 0.3);

        const word = words[wordIndex];
        const colorName = words[colorIndex];

        setDisplayWord(word);
        setDisplayColor(colors[colorName]);
        setFeedback({ text: '', type: '' });
    };

    const checkAnswer = (selectedColor) => {
        if (buttonsDisabled) return;

        const actualColorName = Object.keys(colors).find(key => colors[key] === displayColor).toLowerCase();

        if (selectedColor === actualColorName) {
            setCorrectScore(prev => prev + 1);
            setFeedback({ text: '✓ Correct!', type: 'correct' });
        } else {
            setFeedback({ text: `✗ Not quite - it was ${actualColorName.toUpperCase()}`, type: 'incorrect' });
        }

        setButtonsDisabled(true);
        setTimeout(() => {
            setButtonsDisabled(false);
            nextRound();
        }, 1200);
    };

    const accuracy = ((correctScore / totalRounds) * 100).toFixed(0);

    return (
        <div className=" ">
            {/* Custom Font Styling */}

            <div className="p-5 rounded-[20px] border border-white shadow-[0_20px_80px_rgba(0,0,0,0.1)] overflow-hidden bg-gradient-to-b from-white/95 to-[#faf5eb]/98 transition-all duration-500">

                {/* Notebook Paper Lines - Integrated with Tailwind and Inline Styles for gradients */}


                {/* Watercolor Blobs */}
                <div className="absolute w-[300px] h-[300px] bg-[#6b8e23]/15 rounded-full blur-[60px] -top-[100px] -right-[100px] pointer-events-none z-0" />
                <div className="absolute w-[250px] h-[250px] bg-[#4a7c9e]/15 rounded-full blur-[60px] -bottom-[80px] -left-[80px] pointer-events-none z-0" />

                <div className="relative z-10">
                    {/* Header Top Navigation */}
                    <div className="mb-6 flex items-center justify-between">
                        <Link href="/dashboard/emotions/emdr" className="w-10 h-10 rounded-full bg-white/60 border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                            <ArrowLeft size={18} />
                        </Link>

                    </div>

                    {/* Titles */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl  text-[#292524]  mb-2">
                            The Stroop Test
                        </h1>
                        <p className="text-[1.1em] text-[#78716c] font-['Playfair_Display'] italic tracking-[3px] opacity-70">
                            A Focus & Attention Exercise
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {gameState === 'instructions' && (
                            <motion.div
                                key="instructions"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="bg-white/70 backdrop-blur-sm p-8 md:p-12 rounded-[30px] border border-stone-100 shadow-sm leading-relaxed text-stone-700 font-['Playfair_Display']"
                            >
                                <h3 className="text-[#6b8e23] text-2xl mb-5 font-bold">How This Works</h3>
                                <div className="space-y-4 text-lg">
                                    <p>This exercise helps strengthen your focus and attention by creating a gentle challenge for your brain.</p>
                                    <p><strong>Your task:</strong> Look at the color the word is displayed in (not the word itself), then select the matching color button below.</p>
                                    <p>For example, if you see the word "RED" displayed in blue text, you would click the blue button.</p>
                                    <p>This creates a bit of mental friction - and that&apos;s exactly the point! It&apos;s a workout for your brain&apos;s ability to focus.</p>
                                    <p><strong>Ready?</strong> Click the button below to begin. You&apos;ll complete 10 rounds.</p>
                                </div>
                                <div className="text-center mt-12">
                                    <button
                                        className="inline-flex items-center px-12 py-5 bg-[#292524] text-white rounded-full font-['Playfair_Display'] text-xl hover:bg-black transition-all hover:scale-105 shadow-xl hover:shadow-[#292524]/20"
                                        onClick={startGame}
                                    >
                                        Begin Exercise
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {gameState === 'playing' && (
                            <motion.div
                                key="playing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center"
                            >
                                {/* Scoreboard */}
                                <div className="flex justify-around items-center mb-8 p-6 bg-white rounded-[25px] border border-stone-100 shadow-sm">
                                    {[
                                        { label: 'Round', value: currentRound, color: 'text-stone-800' },
                                        { label: 'Correct', value: correctScore, color: 'text-[#6b8e23]' },
                                        { label: 'Timer', value: `${timer.toFixed(1)}s`, color: 'text-stone-800' }
                                    ].map((stat, i) => (
                                        <div key={i} className="text-center px-4 border-r last:border-0 border-stone-100 flex-1">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[#a8a29e] mb-1 font-['Playfair_Display']">{stat.label}</div>
                                            <div className={`text-4xl font-bold font-['Playfair_Display'] ${stat.color}`}>{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Word Display Card */}
                                <div className="bg-white p-16 rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-[#f5f5f4] mb-12 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-stone-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <motion.div
                                        key={displayWord + displayColor}
                                        initial={{ y: 20, opacity: 0, scale: 0.8 }}
                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                        className="text-7xl md:text-9xl font-black font-['Playfair_Display'] tracking-[8px] relative z-10"
                                        style={{ color: displayColor }}
                                    >
                                        {displayWord}
                                    </motion.div>
                                </div>

                                {/* Color Selection Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[600px] mx-auto mb-10">
                                    {['red', 'blue', 'green', 'yellow'].map((color) => (
                                        <button
                                            key={color}
                                            disabled={buttonsDisabled}
                                            onClick={() => checkAnswer(color)}
                                            className={`
                                                py-4 font-bold rounded-2xl border-2 bg-white transition-all shadow-sm
                                                disabled:opacity-40 disabled:scale-95 disabled:translate-y-0
                                                font-['Playfair_Display'] text-lg tracking-wider uppercase
                                                hover:shadow-lg hover:-translate-y-1.5 active:translate-y-0
                                                ${color === 'red' ? 'text-[#c1475b] border-[#c1475b] hover:bg-[#c1475b]/5' : ''}
                                                ${color === 'blue' ? 'text-[#4a7c9e] border-[#4a7c9e] hover:bg-[#4a7c9e]/5' : ''}
                                                ${color === 'green' ? 'text-[#6b8e23] border-[#6b8e23] hover:bg-[#6b8e23]/5' : ''}
                                                ${color === 'yellow' ? 'text-[#d4a017] border-[#d4a017] hover:bg-[#d4a017]/5' : ''}
                                            `}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>

                                {/* Live Feedback */}
                                <div className="h-12 overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={feedback.text}
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -10, opacity: 0 }}
                                            className={`text-2xl font-['Playfair_Display'] italic font-bold ${feedback.type === 'correct' ? 'text-[#6b8e23]' : 'text-[#c1475b]'
                                                }`}
                                        >
                                            {feedback.text}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}

                        {gameState === 'completed' && (
                            <motion.div
                                key="completed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center p-8"
                            >
                                <h3 className="text-5xl font-['Playfair_Display'] text-[#292524] mb-4">Well Done! 🌟</h3>
                                <p className="text-xl text-[#78716c] font-['Playfair_Display'] italic mb-10">You&apos;ve completed the Stroop Test.</p>

                                <div className="bg-white/80 p-10 rounded-[40px] border-2 border-[#6b8e23]/10 shadow-xl mb-12 inline-block">
                                    <div className="flex gap-12 items-center">
                                        <div className="text-center">
                                            <div className="text-sm font-black uppercase text-[#a8a29e] mb-2 tracking-widest">Score</div>
                                            <div className="text-6xl font-bold font-['Playfair_Display'] text-[#6b8e23]">{correctScore}/{totalRounds}</div>
                                        </div>
                                        <div className="w-[1px] h-16 bg-stone-100" />
                                        <div className="text-center">
                                            <div className="text-sm font-black uppercase text-[#a8a29e] mb-2 tracking-widest">Accuracy</div>
                                            <div className="text-6xl font-bold font-['Playfair_Display'] text-stone-800">{accuracy}%</div>
                                        </div>
                                        <div className="w-[1px] h-16 bg-stone-100" />
                                        <div className="text-center">
                                            <div className="text-sm font-black uppercase text-[#a8a29e] mb-2 tracking-widest">Time</div>
                                            <div className="text-6xl font-bold font-['Playfair_Display'] text-stone-800">{timer.toFixed(1)}s</div>
                                        </div>
                                    </div>
                                </div>

                                <p className="max-w-xl mx-auto italic text-stone-400 font-['Playfair_Display'] text-lg leading-relaxed mb-12">
                                    &quot;Training your brain to focus on the present moment and filter out distractions is a vital skill for emotional resilience.&quot;
                                </p>

                                <button
                                    className="px-12 py-5 bg-black text-white rounded-full font-['Playfair_Display'] text-xl hover:scale-105 transition-all shadow-xl active:scale-95"
                                    onClick={() => setGameState('instructions')}
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
