import { useEffect, useState } from "react";
import { getActiveTips } from "../services/healthTipService";
import { Lightbulb, ChevronRight } from "lucide-react";

function HealthTipsWidget() {
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetchTips();
    }, []);

    const fetchTips = async () => {
        try {
            const response = await getActiveTips(20);
            setTips(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // <-- Diperbaiki dari loading(false) menjadi setLoading(false)
        }
    };

    /* Menyesuaikan warna box prioritas agar support gelap dan terang */
    const getPriorityColor = (priority) => {
        switch(priority) {
            case 1: return "border-l-4 border-l-red-500 bg-red-50 text-gray-900 dark:bg-red-950/40 dark:text-red-200";
            case 2: return "border-l-4 border-l-amber-500 bg-amber-50 text-gray-900 dark:bg-amber-950/40 dark:text-amber-200";
            default: return "bg-main-bg text-main-text";
        }
    };

    const displayedTips = showAll ? tips : tips.slice(0, 4);

    if (loading) {
        return (
            <div className="bg-main-card rounded-xl shadow-sm border border-main-border overflow-hidden">
                <div className="p-5 border-b border-main-border">
                    <div className="animate-pulse flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-40"></div>
                        </div>
                    </div>
                </div>
                <div className="p-5 space-y-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gray-100 dark:bg-slate-700 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (tips.length === 0) return null;

    const featuredTip = tips.find(t => t.priority === 1) || tips[0];
    const otherTips = displayedTips.filter(t => t.id !== featuredTip.id);

    return (
        <div className="relative mb-8 bg-gradient-to-r from-[#1E4C4A] to-[#2E7D73] dark:from-[#17233D] dark:to-[#1E294B] text-white p-6 rounded-2xl border border-transparent dark:border-gray-800 shadow-sm">
            
            <div className="p-5 border-b border-white/10 bg-black/5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">
                            Tips Kesehatan
                        </h2>
                        <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                            {tips.length} tips
                        </span>
                    </div>
                    {tips.length > 4 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-sm text-white/90 hover:text-white font-medium transition-colors flex items-center gap-1"
                        >
                            {showAll ? "Tampilkan sedikit" : `Lihat semua (${tips.length})`}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-5 bg-black/10">
                {/* Featured Tip Box */}
                <div className={`rounded-xl p-4 mb-4 ${getPriorityColor(featuredTip.priority)} shadow-inner`}>
                    <div className="flex items-start gap-3">
                        <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm shrink-0">
                            <Lightbulb className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold">{featuredTip.title}</h3>
                                {featuredTip.priority === 1 && (
                                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                                        Penting
                                    </span>
                                )}
                            </div>
                            <p className="text-sm opacity-90 leading-relaxed">
                                {featuredTip.tip_content}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Other Tips List */}
                <div className="space-y-3">
                    {otherTips.map((tip) => (
                        <div 
                            key={tip.id} 
                            className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                            <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors shrink-0">
                                <Lightbulb className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-white group-hover:text-amber-200 transition-colors">{tip.title}</h4>
                                <p className="text-xs text-white/70 line-clamp-2 mt-0.5">{tip.tip_content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HealthTipsWidget;
