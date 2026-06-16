import { useEffect, useState, useRef } from "react"; // 1. Tambahkan useRef di sini
import { getPublishedArticles } from "../services/articleService";
import { Newspaper, ExternalLink, ChevronRight, Clock, ChevronLeft, Grid3x3, LayoutList } from "lucide-react";

function ArticleWidget() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("scroll"); 
    const [displayCount, setDisplayCount] = useState(4); 
    const [scrollPosition, setScrollPosition] = useState(0);
    const [totalArticles, setTotalArticles] = useState(0);

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await getPublishedArticles(50);
            setArticles(response.data);
            setTotalArticles(response.data.length);
        } catch (error) {
            console.error("Gagal memuat artikel:", error);
        } finally {
            setLoading(false); 
        }
    };

    const handleScroll = (direction) => {
        const container = scrollContainerRef.current; 
        if (container) {
            const scrollAmount = 320;
            const newPosition = direction === 'left' 
                ? container.scrollLeft - scrollAmount 
                : container.scrollLeft + scrollAmount;
            
            container.scrollTo({ left: newPosition, behavior: 'smooth' });
            setScrollPosition(newPosition);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (

<div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-100 dark:border-[#334155] overflow-hidden hover:shadow-md transition-all duration-300">
<div className="p-5 border-b border-main-border">
                    <div className="animate-pulse flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-40"></div>
                        </div>
                        <div className="w-32 h-8 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                    </div>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl mb-3"></div>
                                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (articles.length === 0) return null;

    const displayedArticles = viewMode === "grid" ? articles : articles.slice(0, displayCount);

    return (
        <div className="relative mb-8 bg-gradient-to-r from-[#1E4C4A] to-[#2E7D73] dark:from-[#17233D] dark:to-[#1E294B] text-white p-6 rounded-2xl border border-transparent dark:border-gray-800 shadow-sm">
            <div className="p-5 border-b border-white/10 bg-black/5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Newspaper className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">
                            Artikel Rekomendasi
                        </h2>
                        <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                            {totalArticles} artikel
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1 bg-white/10 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("scroll")}
                                className={`p-1.5 rounded-md transition-all ${viewMode === "scroll" ? "bg-white text-[#7A9D82] dark:text-slate-900 shadow-sm" : "text-white/60"}`}
                                title="Tampilan scroll horizontal"
                            >
                                <LayoutList className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white text-[#7A9D82] dark:text-slate-900 shadow-sm" : "text-white/60"}`}
                                title="Tampilan grid"
                            >
                                <Grid3x3 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-5">
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {displayedArticles.map((article) => (
                            <div 
                                key={article.id} 
                                className="
group
bg-white
dark:bg-[#17233D]
text-[#2F3E36]
dark:text-white
rounded-xl
border
border-gray-200
dark:border-[#334155]
overflow-hidden
hover:shadow-md
transition-all
duration-300
"
                                onClick={() => window.open(article.external_link, "_blank")}
                            >
                                {article.image_url && (
                                    <div className="h-36 overflow-hidden">
                                        <img 
                                            src={article.image_url} 
                                            alt={article.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#7A9D82]/10 text-[#7A9D82] dark:text-emerald-400 dark:bg-emerald-500/10">
                                            {article.category || "Artikel"}
                                        </span>
                                        {article.published_at && (
                                            <span className="text-xs opacity-60 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(article.published_at)}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold line-clamp-2 group-hover:text-[#7A9D82] dark:group-hover:text-emerald-400 transition-colors">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-3 text-sm text-[#7A9D82] dark:text-emerald-400">
                                        <span>Baca selengkapnya</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative">
                        <button
                            onClick={() => handleScroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-main-card text-main-text rounded-full p-2 shadow-md border border-main-border hover:opacity-90 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div 
                            ref={scrollContainerRef}
                            className="flex gap-5 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {displayedArticles.map((article) => (
                                <div 
                                    key={article.id} 
                                    className="w-72 shrink-0 group bg-main-card text-main-text rounded-xl border border-main-border overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                                    onClick={() => window.open(article.external_link, "_blank")}
                                >
                                    {article.image_url && (
                                        <div className="h-32 overflow-hidden">
                                            <img 
                                                src={article.image_url} 
                                                alt={article.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-[#7A9D82]/10 text-[#7A9D82] dark:text-emerald-400 dark:bg-emerald-500/10">
                                                {article.category || "Artikel"}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-[#7A9D82] dark:group-hover:text-emerald-400 transition-colors">
                                            {article.title}
                                        </h3>
                                        <div className="flex items-center gap-1 mt-2 text-xs text-[#7A9D82] dark:text-emerald-400">
                                            <span>Baca</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => handleScroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-main-card text-main-text rounded-full p-2 shadow-md border border-main-border hover:opacity-90 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .group:hover .opacity-0 {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}

export default ArticleWidget;
