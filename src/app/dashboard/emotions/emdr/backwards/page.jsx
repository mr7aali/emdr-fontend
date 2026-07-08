"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";

export default function BackwardsChallenge() {
    const [gameState, setGameState] = useState("selection"); // selection, playing
    const [mode, setMode] = useState("counting"); // counting, spelling
    const [level, setLevel] = useState("Moderate");

    // Game Logic States
    const [round, setRound] = useState(1);
    const [correctCount, setCorrectCount] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [answers, setAnswers] = useState(["", "", "", "", ""]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [challengeText, setChallengeText] = useState("");

    // Generate a new challenge
    const startNewRound = () => {
        let startNum = Math.floor(Math.random() * 50) + 20;
        let step = level === "Gentle" ? 1 : level === "Moderate" ? 2 : 7;
        setChallengeText(`Count backwards from ${startNum} by ${step}s (5 numbers)`);
        setAnswers(["", "", "", "", ""]);
        setCurrentIndex(0);
        setUserInput("");
    };

    useEffect(() => {
        if (gameState === "playing") {
            startNewRound();
        }
    }, [gameState]);

    const handleEnter = () => {
        if (userInput.trim() === "") return;

        const newAnswers = [...answers];
        newAnswers[currentIndex] = userInput;
        setAnswers(newAnswers);

        if (currentIndex < 4) {
            setCurrentIndex(currentIndex + 1);
            setUserInput("");
        } else {
            // End of round
            setRound(prev => prev + 1);
            setCorrectCount(prev => prev + 1); // Simple logic for demo
            startNewRound();
        }
    };

    return (
        <div className="">
            {/* Notebook / Parchment Container */}
            <div className=" bg-[#fdfaf5] min-h-[800px] p-10 md:p-14 rounded-lg shadow-xl overflow-hidden border border-stone-200">

                {/* Notebook paper lines overlay */}


                <div className="relative z-20 h-full flex flex-col">
                    {/* Header */}
                    <header className="text-center mb-8">
                        <h1 className="font-serif text-[42px] leading-tight text-[#4a4a4a] mb-1 font-medium">
                            Backwards Challenge
                        </h1>
                        <p className="font-serif text-[18px] text-[#8c7355] italic">
                            A Working Memory Exercise
                        </p>
                    </header>

                    <AnimatePresence mode="wait">
                        {gameState === "selection" ? (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* How This Exercise Works Box */}
                                <section className="bg-white/40 border border-[#dcdcdc] rounded-xl p-8 mb-10 shadow-sm relative z-30">
                                    <h2 className="font-serif text-[22px] text-[#6b8e23] mb-4 font-bold">
                                        How This Exercise Works
                                    </h2>
                                    <p className="text-[#555] leading-relaxed text-[15px] font-mono">
                                        This working memory task occupies part of your brain whilst you hold difficult
                                        emotions in mind, helping reduce your overwhelming feelings.
                                    </p>
                                </section>

                                {/* Exercise Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div
                                        onClick={() => setMode("counting")}
                                        className={`relative rounded-2xl overflow-hidden border-2 group cursor-pointer transition-all h-[280px] ${mode === 'counting' ? 'border-[#6b8e23]' : 'border-stone-200'}`}
                                    >
                                        <img src="/images/I want a beautiful, whimsical, illustrated watercolour painting of a person looking and holding their brain in their hands, watching all different thoughts with situations in, pop out..jpg" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="counting" />
                                        <div className="absolute inset-x-0 bottom-0 bg-white/40 backdrop-blur-sm p-6 text-center">
                                            <h3 className="font-serif text-[22px] text-[#4a4a4a] mb-1 font-bold">Counting Backwards</h3>
                                            <p className="text-[13px] text-[#5a5a5a] italic">Count down from a number, subtracting as you go</p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setMode("spelling")}
                                        className={`relative rounded-2xl overflow-hidden border-2 group cursor-pointer transition-all h-[280px] ${mode === 'spelling' ? 'border-[#6b8e23]' : 'border-stone-200'}`}
                                    >
                                        <img src="/images/I want a beautiful, whimsical, illustrated watercolour painting of a woman holding their brain, with all different thoughts with situations in, pop out..jpg" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="spelling" />
                                        <div className="absolute inset-x-0 bottom-0 bg-white/40 backdrop-blur-sm p-6 text-center">
                                            <h3 className="font-serif text-[22px] text-[#4a4a4a] mb-1 font-bold">Spelling Backwards</h3>
                                            <p className="text-[13px] text-[#5a5a5a] italic">Spell funny sentences backwards, letter by letter</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Challenge Level Selection */}
                                <div className="bg-[#e8ecec] rounded-2xl p-8 mb-10 border border-[#d1d9d9]">
                                    <h3 className="text-center font-serif text-[20px] text-[#4a728a] mb-5 font-bold">
                                        Choose Your Challenge Level
                                    </h3>
                                    <div className="flex justify-center gap-4">
                                        {['Gentle', 'Moderate', 'Challenging'].map((lvl) => (
                                            <button
                                                key={lvl}
                                                onClick={() => setLevel(lvl)}
                                                className={`px-8 py-2.5 rounded-full border-2 text-[15px] font-bold transition-all ${level === lvl ? 'bg-[#4a728a] text-white border-[#4a728a]' : 'bg-white text-[#4a728a] border-[#4a728a]'}`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setGameState("playing")}
                                        className="bg-[#78a42c] hover:bg-[#6b8e23] text-white px-16 py-4 rounded-full text-[20px] font-bold shadow-lg transition-colors border-b-4 border-[#5a7d20]"
                                    >
                                        Begin Exercise
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="playing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center"
                            >
                                {/* Game Stats Header */}
                                <div className="w-full bg-[#f0f4e8] border border-[#d1d9d1] rounded-2xl p-4 mb-20 flex justify-around items-center shadow-sm">
                                    <div className="text-center">
                                        <span className="block text-[12px] uppercase text-[#8b8b8b] font-bold tracking-widest mb-1">Round</span>
                                        <span className="text-[32px] text-[#4a4a4a]">{round}</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-[12px] uppercase text-[#8b8b8b] font-bold tracking-widest mb-1">Correct</span>
                                        <span className="text-[32px] text-[#4a4a4a]">{correctCount}</span>
                                    </div>
                                </div>

                                {/* Instruction Text */}
                                <h2 className="font-serif text-[42px] text-[#71604a] text-center mb-12 leading-tight max-w-[600px]">
                                    {challengeText}
                                </h2>

                                {/* Answer Boxes */}
                                <div className="flex gap-3 mb-12">
                                    {answers.map((ans, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-[60px] h-[75px] rounded-lg border-2 flex items-center justify-center text-[24px] font-serif transition-colors
                                                ${idx === currentIndex ? 'bg-[#e8ecec] border-[#4a728a] text-[#4a728a]' : 'bg-[#f5f5f5]/50 border-stone-200 text-[#a0a0a0]'}`}
                                        >
                                            {ans || "?"}
                                        </div>
                                    ))}
                                </div>

                                {/* Input Field */}
                                <div className="relative mb-6">
                                    <input
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
                                        className="w-[100px] h-[75px] bg-white border-2 border-[#6b8e23] rounded-lg text-center text-[32px] font-serif focus:outline-none focus:ring-2 ring-[#6b8e23]/30"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-[12px] text-[#8b7355] italic mb-12">Press Enter with empty box for spaces</p>

                                {/* Action Buttons */}
                                <div className="flex flex-col items-center gap-20">
                                    <button
                                        onClick={handleEnter}
                                        className="bg-[#5c8daf] hover:bg-[#4a728a] text-white px-12 py-3 rounded-full text-[18px] font-bold shadow-lg transition-colors"
                                    >
                                        Enter
                                    </button>

                                    <button
                                        onClick={() => setGameState("selection")}
                                        className="bg-[#e8e4db] hover:bg-[#dcd8ce] text-[#8b7355] px-8 py-2 rounded-full text-[14px] border border-stone-300 transition-colors flex items-center gap-2"
                                    >
                                        ← Start Over
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
            `}</style>
        </div>
    );
}
