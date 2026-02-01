export default function HistorySection() {
    const milestones = [
        {
            year: "1500 BC",
            title: "Ancient Roots",
            desc: "Hittite stone carvings show the first lute-like instruments, the direct ancestors of the modern guitar.",
        },
        {
            year: "1850",
            title: "The Birth of Modern Design",
            desc: "Antonio de Torres Jurado increases the size of the guitar body and creates the fan-bracing pattern still used in classical guitars today.",
        },
        {
            year: "1931",
            title: "The Frying Pan",
            desc: "George Beauchamp and Adolph Rickenbacker create the first functional electric guitar, forever changing the volume of music.",
        },
        {
            year: "1954",
            title: "The Stratocaster Era",
            desc: "Leo Fender introduces the Stratocaster, introducing the sleek double-cutaway design and the synchronized tremolo system.",
        },
        {
            year: "1959",
            title: "The Golden Age",
            desc: "The Gibson Les Paul Standard perfects the 'Burst' finish and the PAF humbucker, defining the sound of rock and blues.",
        }
    ];

    return (
        <section className="py-32 relative overflow-hidden bg-gradient-to-b from-black to-neutral-900">
            <div className="max-w-5xl mx-auto px-8">
                <div className="text-center mb-24">
                    <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-800 bg-clip-text text-transparent">
                        The Evolution of Sound
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        From ancient stone carvings to the electric revolution, track the milestones that shaped the most iconic instrument in history.
                    </p>
                </div>

                <div className="relative">
                    {/* Central Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/0 via-amber-500/50 to-amber-500/0 hidden md:block"></div>

                    <div className="space-y-24 md:space-y-32">
                        {milestones.map((item, idx) => (
                            <div key={item.year} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 group ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                {/* Content Side */}
                                <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'} w-full`}>
                                    <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 backdrop-blur-xl group-hover:border-amber-500/30 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                                        <h3 className="text-3xl font-black text-white mb-4 group-hover:text-amber-500 transition-colors">{item.title}</h3>
                                        <p className="text-gray-400 leading-relaxed text-lg">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Year Marker */}
                                <div className="relative z-10 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-neutral-900 border-2 border-amber-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:scale-110 group-hover:border-amber-500 group-hover:shadow-amber-500/40 transition-all duration-500 bg-gradient-to-br from-neutral-800 to-black">
                                        <span className="text-xl font-black text-amber-500">{item.year}</span>
                                    </div>
                                    {/* Connection to line (desktop) */}
                                    <div className={`absolute w-8 h-px bg-amber-500/30 hidden md:block ${idx % 2 === 0 ? '-left-8' : '-right-8'}`}></div>
                                </div>

                                {/* Placeholder for balance on desktop */}
                                <div className="flex-1 hidden md:block"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
