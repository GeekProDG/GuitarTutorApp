import { Zap, Flame, Terminal, Music } from 'lucide-react';

export default function Legends() {
    const legends = [
        {
            name: 'Jimi Hendrix',
            desc: 'The Architect of Sonic Chaos. Hendrix redefined what a guitar could do, turning feedback into art.',
            tag: 'Sonic Pioneer',
            color: 'from-purple-600 to-indigo-700',
            icon: <Flame className="text-purple-400" />
        },
        {
            name: 'Jimmy Page',
            desc: 'The Riff Architect with a bow in hand. His dark, heavy arrangements defined the sound of hard rock.',
            tag: 'Riff Architect',
            color: 'from-amber-600 to-yellow-700',
            icon: <Music className="text-amber-400" />
        },
        {
            name: 'Eddie Van Halen',
            desc: 'The Technical Revolution. His tapping technique and customized gear changed the instrument forever.',
            tag: 'Technical Legend',
            color: 'from-red-600 to-orange-700',
            icon: <Zap className="text-orange-400" />
        },
        {
            name: 'David Gilmour',
            desc: 'The Voice of Style. His soaring, emotive solos proved that one perfect note beats a hundred fast ones.',
            tag: 'Soul of Pink Floyd',
            color: 'from-blue-600 to-cyan-700',
            icon: <Terminal className="text-blue-400" />
        },
    ];

    return (
        <section className="py-32 px-8 bg-neutral-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-amber-200 to-amber-600 bg-clip-text text-transparent">
                        Hall of Legends
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Meet the icons who pushed the boundaries of the guitar and inspired generations of players.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {legends.map((legend) => (
                        <div key={legend.name} className="group relative overflow-hidden rounded-[2rem] bg-black border border-white/5 hover:border-amber-500/50 transition-all duration-700 hover:-translate-y-2">
                            {/* Animated Background Pulse */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${legend.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
                            <div className="absolute -inset-24 bg-gradient-to-br from-amber-500/0 via-amber-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rotate-45"></div>

                            <div className="p-10 relative z-10 flex flex-col h-full">
                                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/10 mb-8 flex items-center justify-center text-2xl font-bold group-hover:scale-110 group-hover:bg-black transition-all duration-500">
                                    {legend.icon}
                                </div>

                                <span className="text-xs font-bold text-amber-500/60 uppercase tracking-widest mb-2 group-hover:text-amber-500 transition-colors">
                                    {legend.tag}
                                </span>

                                <h3 className="text-2xl font-black mb-4 text-white group-hover:text-amber-400 transition-colors">
                                    {legend.name}
                                </h3>

                                <p className="text-gray-500 text-sm leading-relaxed mb-6 group-hover:text-gray-400 transition-colors">
                                    {legend.desc}
                                </p>

                                <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold text-gray-600 group-hover:text-amber-500/80 transition-colors uppercase tracking-tight">
                                    View Legacy
                                    <span className="w-8 h-[2px] bg-gray-600 group-hover:bg-amber-500 group-hover:w-12 transition-all duration-500"></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
