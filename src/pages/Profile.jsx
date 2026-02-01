import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
    const { currentUser, userRole } = useAuth();

    return (
        <div className="max-w-7xl mx-auto p-8 pt-20">
            <div className="flex items-center gap-6 mb-12">
                <img
                    src={currentUser?.photoURL}
                    alt="Profile"
                    className="w-24 h-24 rounded-full ring-4 ring-amber-500/50"
                />
                <div>
                    <h1 className="text-4xl font-bold">{currentUser?.displayName}</h1>
                    <p className="text-gray-400">{currentUser?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm font-mono uppercase tracking-wider">
                        {userRole}
                    </span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-bold mb-4">Class Progress</h2>
                    <div className="text-6xl font-bold text-amber-500 mb-2">0</div>
                    <p className="text-gray-400">Classes Completed</p>
                </div>
            </div>
        </div>
    );
}
