"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";

export default function EMDRGames() {
    const games = [
        { id: "battleship", title: "Backwards Challenge", link: "/dashboard/emotions/emdr/backwards" },
        { id: "stroop", title: "Stroop test", link: "/dashboard/emotions/emdr/stroop" },
        { id: "memory", title: "Pattern Memory", link: "/dashboard/emotions/emdr/memory" },
        { id: "tetris", title: "tetris" },
    ];

    return (
        <div className="p-4">
            {/* Container Frame */}
            <div className="bg-white/20 backdrop-blur-md rounded-[40px] border border-white/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] p-2">

                {/* Header with Back Button */}
                <div className="py-10 text-center relative font-serif">

                    <h1 className="text-[28px] text-[#000000]">EMDR 2.0</h1>
                </div>

                {/* Games List Content */}
                <div className="bg-white/20 rounded-[32px] border border-stone-100/30 p-5 md:p-8 space-y-4">
                    {games.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <Link href={game.link || "#"}>
                                <div className="group bg-white/60 hover:bg-white rounded-[20px] border border-white/40 p-5 flex items-center justify-between transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
                                    <div className="flex items-center gap-6">
                                        {/* Avatar Container */}
                                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                                            <img
                                                src="/homeImage/gril.jpg"
                                                alt="avatar"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        {/* Title */}
                                        <h2 className="text-xl md:text-2xl font-serif text-[#383838] font-normal group-hover:translate-x-1 transition-transform">
                                            {game.title}
                                        </h2>
                                    </div>

                                    {/* Action Icon */}
                                    {/* <div className="flex items-center justify-center w-8 h-8 text-stone-300 group-hover:text-stone-900 group-hover:scale-110 transition-all opacity-40 group-hover:opacity-100">
                                        <Play size={16} />
                                    </div> */}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Spacer */}
                <div className="py-6"></div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                
                .font-serif {
                    font-family: 'Playfair Display', serif;
                }

                h1, h2 {
                    font-family: 'Playfair Display', serif;
                }
            `}</style>
        </div>
    );
}
