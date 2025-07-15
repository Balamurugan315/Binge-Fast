
import { useState } from "react";
import { FilterState } from "@/types/movie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Crime", "Biography", "Adventure"];
const languages = ["English", "Hindi", "Tamil", "Telugu", "Malayalam", "Bengali", "Marathi"];
const platforms = ["Netflix", "Prime Video", "Disney+ Hotstar", "SonyLIV", "Zee5", "Voot", "MX Player"];

export const FilterSidebar = ({ filters, onFiltersChange, className }: FilterSidebarProps) => {
  const handleGenreChange = (genre: string, checked: boolean) => {
    const newGenres = checked
      ? [...filters.genres, genre]
      : filters.genres.filter((g) => g !== genre);
    onFiltersChange({ ...filters, genres: newGenres });
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    const newLanguages = checked
      ? [...filters.languages, language]
      : filters.languages.filter((l) => l !== language);
    onFiltersChange({ ...filters, languages: newLanguages });
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const newPlatforms = checked
      ? [...filters.platforms, platform]
      : filters.platforms.filter((p) => p !== platform);
    onFiltersChange({ ...filters, platforms: newPlatforms });
  };

  const handleRatingChange = (rating: string) => {
    onFiltersChange({ ...filters, minRating: parseFloat(rating) });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      genres: [],
      languages: [],
      platforms: [],
      minRating: 0,
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Genres */}
        <div>
          <h3 className="font-medium mb-3">Genres</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {genres.map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox
                  id={`genre-${genre}`}
                  checked={filters.genres.includes(genre)}
                  onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                />
                <Label htmlFor={`genre-${genre}`} className="text-sm">
                  {genre}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Languages */}
        <div>
          <h3 className="font-medium mb-3">Languages</h3>
          <div className="space-y-2">
            {languages.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${language}`}
                  checked={filters.languages.includes(language)}
                  onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                />
                <Label htmlFor={`lang-${language}`} className="text-sm">
                  {language}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Platforms */}
        <div>
          <h3 className="font-medium mb-3">OTT Platforms</h3>
          <div className="space-y-2">
            {platforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={`platform-${platform}`}
                  checked={filters.platforms.includes(platform)}
                  onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                />
                <Label htmlFor={`platform-${platform}`} className="text-sm">
                  {platform}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div>
          <h3 className="font-medium mb-3">Minimum Rating</h3>
          <RadioGroup value={filters.minRating.toString()} onValueChange={handleRatingChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="rating-all" />
              <Label htmlFor="rating-all">All Ratings</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7" id="rating-7" />
              <Label htmlFor="rating-7">7.0+ ⭐</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="8" id="rating-8" />
              <Label htmlFor="rating-8">8.0+ ⭐⭐</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="9" id="rating-9" />
              <Label htmlFor="rating-9">9.0+ ⭐⭐⭐</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
