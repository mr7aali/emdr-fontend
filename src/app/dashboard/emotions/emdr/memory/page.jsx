"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatternMemory() {
    const COLORS = ['#c1475b', '#4a7c9e', '#6b8e23', '#d4a017', '#9b59b6', '#e67e22'];

    const [gameState, setGameState] = useState('setup'); // 'setup', 'instructions', 'playing', 'finished'
    const [difficulty, setDifficulty] = useState(null);
    const [currentRound, setCurrentRound] = useState(1);
    const [longestSequence, setLongestSequence] = useState(0);
    const [currentPattern, setCurrentPattern] = useState([]);
    const [userPattern, setUserPattern] = useState([]);
    const [isShowingPattern, setIsShowingPattern] = useState(false);
    const [sequenceLength, setSequenceLength] = useState(3);
    const [statusMessage, setStatusMessage] = useState('Watch the pattern...');
    const [displayPattern, setDisplayPattern] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const selectDifficulty = (level) => {
        setDifficulty(level);
    };

    const handleBeginClick = () => {
        setShowModal(true);
    };

    const startGame = () => {
        setShowModal(false);
        setGameState('playing');

        let startLength = 3;
        if (difficulty === 'medium') startLength = 4;
        if (difficulty === 'hard') startLength = 5;

        setSequenceLength(startLength);
        setCurrentRound(1);
        setLongestSequence(0);
        startRound(startLength);
    };

    const startRound = (len) => {
        const length = len || sequenceLength;
        const newPattern = [];
        for (let i = 0; i < length; i++) {
            newPattern.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
        }

        setCurrentPattern(newPattern);
        setUserPattern([]);
        setDisplayPattern([]);
        setIsShowingPattern(true);
        setStatusMessage('Watch the pattern...');

        // Show pattern sequence
        let index = 0;
        const interval = setInterval(() => {
            if (index < newPattern.length) {
                setDisplayPattern(prev => [...prev, newPattern[index]]);
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setIsShowingPattern(false);
                    setStatusMessage('Now repeat the pattern!');
                    setDisplayPattern([]);
                }, 1000);
            }
        }, 800);
    };

    const selectColor = (color) => {
        if (isShowingPattern || gameState !== 'playing') return;

        const newUserPattern = [...userPattern, color];
        setUserPattern(newUserPattern);
        setDisplayPattern(newUserPattern);

        if (newUserPattern.length === currentPattern.length) {
            checkPattern(newUserPattern);
        }
    };

    const checkPattern = (pattern) => {
        const correct = JSON.stringify(pattern) === JSON.stringify(currentPattern);

        if (correct) {
            setStatusMessage('Correct! Well done.');

            if (sequenceLength > longestSequence) {
                setLongestSequence(sequenceLength);
            }

            const nextLength = sequenceLength + 1;
            setSequenceLength(nextLength);

            let maxLength = 5;
            if (difficulty === 'medium') maxLength = 7;
            if (difficulty === 'hard') maxLength = 9;

            if (nextLength > maxLength) {
                setTimeout(() => setGameState('finished'), 1500);
            } else {
                setTimeout(() => {
                    setCurrentRound(prev => prev + 1);
                    startRound(nextLength);
                }, 1500);
            }
        } else {
            setStatusMessage("That wasn't quite right. Good effort!");
            setTimeout(() => setGameState('finished'), 1500);
        }
    };

    return (
        <div className="p-4 ">
            {/* Custom Font Styling */}

            <div className="p-5 rounded-[20px] border border-white shadow-[0_20px_80px_rgba(0,0,0,0.1)] overflow-hidden bg-gradient-to-b from-white/95 to-[#faf5eb]/98 transition-all duration-500">


                {/* Watercolor Blobs */}
                <div className="absolute w-[300px] h-[300px] bg-[#6b8e23]/10 rounded-full blur-[60px] -top-[100px] -right-[100px] pointer-events-none z-0" />
                <div className="absolute w-[250px] h-[250px] bg-[#4a7c9e]/10 rounded-full blur-[60px] -bottom-[80px] -left-[80px] pointer-events-none z-0" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <Link href="/dashboard/emotions/emdr" className="w-10 h-10 rounded-full bg-white/60 border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                            <ArrowLeft size={18} />
                        </Link>

                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl text-[#292524] tracking-tight mb-2">
                            Pattern Memory
                        </h1>
                        <p className="text-lg text-[#78716c] font-['Playfair_Display'] italic tracking-[2px] opacity-70">
                            A Working Memory Exercise
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {gameState === 'setup' && (
                            <motion.div
                                key="setup"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-[30px] border border-stone-100 shadow-sm font-['Playfair_Display']">
                                    <h3 className="text-[#6b8e23] text-2xl mb-4 font-bold">How This Exercise Works</h3>
                                    <p className="text-lg text-stone-700 leading-relaxed">
                                        This working memory task occupies part of your brain whilst you hold difficult emotions in mind, helping reduce your overwhelming feelings.
                                    </p>
                                </div>

                                <div className="bg-[#4a7c9e]/5 p-8 rounded-[30px] border border-stone-100 text-center">
                                    <h3 className="text-[#4a7c9e] text-xl mb-6 font-['Playfair_Display'] font-bold">Choose Your Challenge Level</h3>
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        {[
                                            { id: 'easy', label: 'Gentle (3-5 colors)' },
                                            { id: 'medium', label: 'Moderate (4-7 colors)' },
                                            { id: 'hard', label: 'Challenging (5-9 colors)' }
                                        ].map((level) => (
                                            <button
                                                key={level.id}
                                                onClick={() => selectDifficulty(level.id)}
                                                className={`px-6 py-3 rounded-full border-2 font-['Playfair_Display'] transition-all ${difficulty === level.id
                                                    ? 'bg-[#4a7c9e] text-white border-[#4a7c9e] shadow-lg scale-105'
                                                    : 'bg-white text-[#4a7c9e] border-[#4a7c9e] hover:bg-[#4a7c9e]/5'
                                                    }`}
                                            >
                                                {level.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center pt-4">
                                    <button
                                        disabled={!difficulty}
                                        onClick={handleBeginClick}
                                        className="px-12 py-4 bg-[#292524] text-white rounded-full font-['Playfair_Display'] text-xl hover:bg-black transition-all hover:scale-105 shadow-xl disabled:opacity-50 disabled:hover:scale-100"
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
                                        { label: 'Longest', value: longestSequence, color: 'text-[#6b8e23]' }
                                    ].map((stat, i) => (
                                        <div key={i} className="text-center px-8 border-r last:border-0 border-stone-100 flex-1">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[#a8a29e] mb-1 font-['Playfair_Display']">{stat.label}</div>
                                            <div className={`text-4xl font-bold font-['Playfair_Display'] ${stat.color}`}>{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <h3 className={`text-2xl font-['Playfair_Display'] font-bold ${isShowingPattern ? 'text-[#4a7c9e]' : 'text-[#6b8e23]'}`}>
                                        {statusMessage}
                                    </h3>

                                    {/* Pattern Display */}
                                    <div className="min-h-[140px] flex flex-wrap justify-center gap-4 py-8 bg-white/40 rounded-[30px] border border-stone-100">
                                        <AnimatePresence>
                                            {displayPattern.map((color, idx) => (
                                                <motion.div
                                                    key={`circle-${idx}-${color}`}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-md shadow-black/5"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Color Options */}
                                    {!isShowingPattern && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-4"
                                        >
                                            {COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => selectColor(color)}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-sm hover:shadow-lg hover:scale-110 active:scale-95 transition-all mx-auto"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </motion.div>
                                    )}

                                    <div className="pt-10">
                                        <button
                                            onClick={() => setGameState('setup')}
                                            className="text-stone-400 hover:text-stone-800 font-['Playfair_Display'] italic text-sm transition-colors border-b border-stone-200 hover:border-stone-800"
                                        >
                                            Start Over
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {gameState === 'finished' && (
                            <motion.div
                                key="finished"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <h2 className="text-4xl font-['Playfair_Display'] text-[#6b8e23] mb-8 font-bold">
                                    Exercise Complete!
                                </h2>

                                <div className="bg-white/80 p-10 rounded-[40px] border-2 border-[#6b8e23]/10 shadow-xl mb-8 space-y-6">
                                    <div className="space-y-2">
                                        <p className="text-xl text-[#5a4a42] font-['Playfair_Display']">
                                            You completed <strong>{currentRound} rounds</strong>
                                        </p>
                                        <p className="text-xl text-[#5a4a42] font-['Playfair_Display']">
                                            Longest sequence: <strong>{longestSequence} colors</strong>
                                        </p>
                                    </div>
                                    <p className="max-w-md mx-auto italic text-stone-500 font-['Playfair_Display'] leading-relaxed pt-4 border-t border-stone-100">
                                        Well done for challenging your working memory. Holding that pattern in mind whilst managing difficult emotions is exactly what helps create mental space for processing.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4 items-center">
                                    <button
                                        onClick={() => setGameState('setup')}
                                        className="px-12 py-4 bg-[#292524] text-white rounded-full font-['Playfair_Display'] text-xl hover:bg-black transition-all hover:scale-105 shadow-xl"
                                    >
                                        Try Another Level
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Emotion Challenge Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[32px] p-8 md:p-12 max-w-xl w-full border-4 border-[#6b8e23]/20 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6b8e23]/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                            <h3 className="text-3xl font-['Playfair_Display'] text-[#6b8e23] mb-6 font-bold text-center">The Challenge</h3>
                            <div className="space-y-6 text-xl text-stone-700 leading-relaxed font-['Playfair_Display']">
                                <p>
                                    <strong>Whilst doing this task, try as hard as you can to force the emotion you&apos;re struggling with to the forefront - as if it&apos;s a competition!</strong>
                                </p>
                            </div>

                            <button
                                className="w-full mt-10 py-5 bg-gradient-to-r from-[#6b8e23] to-[#7a9d2a] text-white rounded-full font-['Playfair_Display'] text-xl shadow-xl hover:shadow-[#6b8e23]/30 hover:-translate-y-1 transition-all active:translate-y-0"
                                onClick={startGame}
                            >
                                I&apos;m Ready - Let&apos;s Begin
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
