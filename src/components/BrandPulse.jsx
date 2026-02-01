import { useState, useEffect } from 'react';
import { Radio, Globe, TrendingUp } from 'lucide-react';

const NEWS_ITEMS = [
    { brand: 'FENDER', text: 'THE LEGENDARY STRATOCASTER RECEIVES A MASSIVE UPDATE WITH THE ALL-NEW 2026 "ULTRA-NOISELESS" PICKUP SYSTEM, MODERN MAHOGANY NECK PROFILE, AND A STUNNING "GALAXY GLOW" FINISH.', time: 'JUST NOW', type: 'NEW RELEASE' },
    { brand: 'GIBSON', text: 'EXCLUSIVE LOOK INSIDE THE NASHVILLE CUSTOM SHOP AS THEY ANNOUNCE A STRICTLY LIMITED 50-UNIT RUN OF THE 1959 LES PAUL STANDARD REISSUE, FEATURING HAND-SELECTED MAPLE TOPS.', time: '5M AGO', type: 'COLLECTOR' },
    { brand: 'IBANEZ', text: 'NEW "QUEST" HEADLESS SERIES EXPANDS WITH HIGH-OUTPUT HUMBUCKERS AND AN ULTRA-LIGHTWEIGHT ERGONOMIC DESIGN TAILORED FOR THE MODERN TECHNICAL VIRTUOSO.', time: '12M AGO', type: 'TECH' },
    { brand: 'LEGACY', text: 'JIMI HENDRIX\'S ICONIC "MONTEREY" STRATOCASTER RETURNS TO PUBLIC DISPLAY AT THE SOUND MUSEUM IN LONDON, ACCOMPANIED BY NEVER-BEFORE-SEEN STUDIO SESSION OUTTAKES.', time: '2H AGO', type: 'HISTORY' },
    { brand: 'PRS', text: 'JOHN MAYER\'S SIGNATURE SILVER SKY IS GETTING A BRAND NEW "SUPERNOVA" HOLOGRAPHIC FINISH THAT SHIFTS COLORS WITH YOUR STAGE LIGHTS, REDEFINING GUITAR AESTHETICS.', time: '1H AGO', type: 'SIGNATURE' },
];

export default function BrandPulse() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % NEWS_ITEMS.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const news = NEWS_ITEMS[index];

    return (
        <div className="flex-1 max-w-5xl hidden xl:flex items-center gap-6 px-6 py-2.5 bg-white/5 border border-white/5 rounded-full backdrop-blur-xl group mx-8">
            <div className="flex items-center gap-3 shrink-0">
                <div className="relative">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-ping absolute inset-0"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full relative"></div>
                </div>
                <span className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Live</span>
            </div>

            <div key={index} className="flex flex-1 items-center justify-between gap-6 animate-in slide-in-from-right-8 fade-in duration-1000 overflow-hidden">
                <div className="flex items-center gap-4 overflow-hidden">
                    <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] shrink-0">
                        {news.type}
                    </span>

                    <div className="flex items-baseline gap-3 truncate">
                        <span className="font-black text-sm text-white tracking-widest shrink-0">{news.brand}</span>
                        <span className="text-gray-400 font-bold truncate text-sm tracking-widest uppercase">
                            {news.text}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-gray-600 text-[10px] font-black tracking-widest">
                    <span className="flex items-center gap-1.5 uppercase">
                        <Radio size={12} className="text-amber-500" />
                        {news.time}
                    </span>
                    <TrendingUp size={14} className="text-amber-500/30" />
                </div>
            </div>
        </div>
    );
}
