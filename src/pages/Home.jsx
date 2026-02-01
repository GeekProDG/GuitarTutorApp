import HistorySection from '../components/HistorySection';
import Legends from '../components/Legends';
import AdminDebugPanel from '../components/AdminDebugPanel';

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="relative pt-40 pb-32 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/30 via-black to-black -z-10"></div>
                <h1 className="text-8xl font-black mb-8 tracking-tighter text-white">
                    MASTER THE <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">FRETBOARD</span>
                </h1>
                <p className="text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                    Join the elite community of guitarists. From beginner chords to technical mastery.
                </p>

                <div className="flex justify-center gap-4 animate-bounce hover:animate-none opacity-20">
                    <div className="w-1 h-12 rounded-full bg-gradient-to-b from-amber-500 to-transparent"></div>
                </div>
            </div>


            <HistorySection />
            <Legends />

            <AdminDebugPanel />
        </div>
    );
}
