
import { useState, useEffect } from "react";
import { WatchlistItem } from "@/types/movie";

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bingefast-watchlist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWatchlist(parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      } catch (error) {
        console.error("Error loading watchlist:", error);
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bingefast-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (movieId: string) => {
    setWatchlist(prev => [
      ...prev.filter(item => item.movieId !== movieId),
      { movieId, addedAt: new Date() }
    ]);
  };

  const removeFromWatchlist = (movieId: string) => {
    setWatchlist(prev => prev.filter(item => item.movieId !== movieId));
  };

  const isInWatchlist = (movieId: string) => {
    return watchlist.some(item => item.movieId === movieId);
  };

  const getWatchlist = () => watchlist;

  return {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    getWatchlist,
    watchlistCount: watchlist.length
  };
};
