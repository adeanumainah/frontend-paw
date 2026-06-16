// components/FoodRecommendationsWidget.js
import { useEffect, useState } from "react";
import { getActiveFoods } from "../services/foodService";
import { 
  UtensilsCrossed, 
  Star, 
  ShoppingBag, 
  Filter, 
  PawPrint,
  Cat,
  Dog,
  Bird,
  Rabbit,
  Fish,
} from "lucide-react";

function FoodRecommendationsWidget() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [speciesFilter, setSpeciesFilter] = useState("all");
    const [displayCount, setDisplayCount] = useState(6);

    const speciesOptions = [
        { value: "all", label: "Semua", icon: PawPrint },
        { value: "cat", label: "Kucing", icon: Cat },
        { value: "dog", label: "Anjing", icon: Dog },
        { value: "bird", label: "Burung", icon: Bird },
        { value: "hamster", label: "Hamster", icon: Rabbit },
        { value: "rabbit", label: "Kelinci", icon: Rabbit },
        { value: "fish", label: "Ikan", icon: Fish },
    ];

    useEffect(() => {
        fetchFoods();
    }, [speciesFilter]);

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const response = await getActiveFoods(50, speciesFilter);
            setFoods(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (priceRange) => {
        if (!priceRange) return null;
        let cleaned = priceRange.replace(/[^0-9\s\-]/g, '').trim();
        if (cleaned.match(/^\d+$/)) {
            return `Rp ${Number(cleaned).toLocaleString('id-ID')}`;
        }
        if (cleaned.includes('-')) {
            const parts = cleaned.split('-');
            if (parts.length === 2) {
                const min = parts[0].trim();
                const max = parts[1].trim();
                if (min.match(/^\d+$/) && max.match(/^\d+$/)) {
                    return `Rp ${Number(min).toLocaleString('id-ID')} - ${Number(max).toLocaleString('id-ID')}`;
                }
            }
        }
        return priceRange;
    };

    const getRatingStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
                {hasHalfStar && <Star className="w-3 h-3 fill-amber-400 text-amber-400" style={{ clipPath: "inset(0 50% 0 0)" }} />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="w-3 h-3 text-white/40" />
                ))}
            </div>
        );
    };

    const getSpeciesIcon = (species) => {
        const found = speciesOptions.find(s => s.value === species);
        if (found && found.icon) {
            const IconComponent = found.icon;
            return <IconComponent className="w-4 h-4 text-[#7A9D82] dark:text-emerald-400" />;
        }
        return <UtensilsCrossed className="w-4 h-4 text-[#7A9D82] dark:text-emerald-400" />;
    };

    const getSpeciesLabel = (species) => {
        const found = speciesOptions.find(s => s.value === species);
        return found ? found.label : species;
    };

    const displayedFoods = foods.slice(0, displayCount);
    const hasMore = foods.length > displayCount;
    const hasNoData = !loading && foods.length === 0 && speciesFilter !== "all";

    if (loading) {
        return (
            <div className="bg-linear-to-br from-(--welcome-from)] to-(--welcome-to)] text-white rounded-xl shadow-sm border border-main-border overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-5 border-b border-white/10 bg-black/5">
                    <div className="animate-pulse flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                            <div className="h-6 bg-white/20 rounded w-40"></div>
                        </div>
                        <div className="w-32 h-9 bg-white/20 rounded-lg"></div>
                    </div>
                </div>
                <div className="p-5 bg-black/10">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-32 bg-white/10 rounded-xl mb-2"></div>
                                <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (hasNoData) {
        return (
            <div className="bg-linear-to-br from-(--welcome-from)] to-(--welcome-to)] text-white rounded-xl shadow-sm border border-main-border overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-5 border-b border-white/10 bg-black/5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <UtensilsCrossed className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">
                                Rekomendasi Makanan
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-white/60" />
                            <div className="flex gap-1 bg-white/10 rounded-lg p-1">
                                {speciesOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => setSpeciesFilter(option.value)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                                speciesFilter === option.value
                                                    ? "bg-white text-[#7A9D82] dark:text-slate-900 shadow-sm"
                                                    : "text-white/60 hover:text-white"
                                            }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">{option.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 text-center bg-black/10">
                    <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UtensilsCrossed className="w-8 h-8 text-white/80" />
                    </div>
                    <h3 className="text-md font-semibold text-white mb-1">
                        Belum ada rekomendasi untuk {getSpeciesLabel(speciesFilter)}
                    </h3>
                    <p className="text-sm text-white/60">
                        Silakan pilih filter lain atau cek kembali nanti
                    </p>
                    <button
                        onClick={() => setSpeciesFilter("all")}
                        className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-[#7A9D82] dark:text-slate-900 bg-white hover:bg-white/90 transition-all"
                    >
                        Tampilkan Semua
                    </button>
                </div>
            </div>
        );
    }

    if (foods.length === 0) return null;

    return (
        /* SEKARANG SUDAH MENGGUNAKAN GRADASI WELCOME CARD DAN TEXT PUTIH */
        <div className="relative mb-8 bg-gradient-to-r from-[#1E4C4A] to-[#2E7D73] dark:from-[#17233D] dark:to-[#1E294B] text-white p-6 rounded-2xl border border-transparent dark:border-gray-800 shadow-sm">
            <div className="p-5 border-b border-white/10 bg-black/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <UtensilsCrossed className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">
                            Rekomendasi Makanan
                        </h2>
                        <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                            {foods.length} produk
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-white/60" />
                        <div className="flex gap-1 bg-white/10 rounded-lg p-1">
                            {speciesOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setSpeciesFilter(option.value)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            speciesFilter === option.value
                                                ? "bg-white text-[#7A9D82] dark:text-slate-900 shadow-sm"
                                                : "text-white/60 hover:text-white"
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5 bg-black/10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {displayedFoods.map((food) => (
                        <div 
                            key={food.id} 
                            className="group bg-main-card text-main-text rounded-xl border border-main-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative h-28 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 flex items-center justify-center">
                                {food.image_url ? (
                                    <img 
                                        src={food.image_url} 
                                        alt={food.brand_name} 
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <UtensilsCrossed className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-1 shadow-xs">
                                    {getSpeciesIcon(food.species)}
                                </div>
                            </div>
                            
                            <div className="p-3 text-center">
                                <h3 className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                                    {food.brand_name}
                                </h3>
                                {food.product_name && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                                        {food.product_name}
                                    </p>
                                )}
                                
                                <div className="flex justify-center mt-1.5">
                                    {getRatingStars(food.rating)}
                                </div>
                                
                                {formatPrice(food.price_range) && (
                                    <p className="text-xs font-medium text-[#7A9D82] dark:text-emerald-400 mt-1.5 truncate">
                                        {formatPrice(food.price_range)}
                                    </p>
                                )}
                                
                                {food.affiliate_link && (
                                    <button
                                        onClick={() => window.open(food.affiliate_link, "_blank")}
                                        className="mt-2 w-full py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 bg-[#7A9D82]/10 dark:bg-[#7A9D82]/20 text-[#7A9D82] dark:text-emerald-400 hover:bg-[#7A9D82] hover:text-white dark:hover:bg-[#7A9D82] dark:hover:text-white"
                                    >
                                        <ShoppingBag className="w-3 h-3" />
                                        <span>Beli</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <div className="text-center mt-5">
                        <button
                            onClick={() => setDisplayCount(prev => prev + 6)}
                            className="px-5 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all"
                        >
                            Lihat lebih banyak +
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FoodRecommendationsWidget;

