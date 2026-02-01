export default function Blog() {
    return (
        <div className="max-w-7xl mx-auto p-8 pt-24">
            <h1 className="text-4xl font-bold mb-8">Guitar Insights</h1>
            <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-amber-500/50 transition cursor-pointer">
                        <div className="h-40 bg-neutral-800 rounded-lg mb-4"></div>
                        <h3 className="text-xl font-bold mb-2">5 Tips for Speed</h3>
                        <p className="text-gray-400 text-sm">Boost your shredding skills with these simple exercises...</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
