
import { Movie } from "@/types/movie";

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Stranger Things",
    type: "series",
    poster: "https://images.unsplash.com/photo-1489599856918-4a2c5dd5a7c9?w=300&h=450&fit=crop",
    year: 2016,
    director: "The Duffer Brothers",
    genres: ["Sci-Fi", "Horror", "Drama"],
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"],
    languages: ["English"],
    platforms: [
      {
        name: "Netflix",
        url: "https://netflix.com/title/80057281",
        logo: "🎬"
      }
    ],
    regions: ["US", "UK", "Canada", "India"],
    imdbRating: 8.7,
    rottenTomatoesRating: 93,
    synopsis: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    seasons: 4,
    trending: true
  },
  {
    id: "2",
    title: "The Batman",
    type: "movie",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
    year: 2022,
    director: "Matt Reeves",
    genres: ["Action", "Crime", "Drama"],
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
    languages: ["English"],
    platforms: [
      {
        name: "Prime Video",
        url: "https://primevideo.com/detail/0TFCP1X0BLGQWN",
        logo: "📺"
      },
      {
        name: "Disney+ Hotstar",
        url: "https://hotstar.com/in/movies/the-batman",
        logo: "⭐"
      }
    ],
    regions: ["US", "UK", "India", "Australia"],
    imdbRating: 7.8,
    rottenTomatoesRating: 85,
    synopsis: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
    duration: "2h 56min",
    trending: true
  },
  {
    id: "3",
    title: "Scam 1992",
    type: "series",
    poster: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=450&fit=crop",
    year: 2020,
    director: "Hansal Mehta",
    genres: ["Biography", "Crime", "Drama"],
    cast: ["Pratik Gandhi", "Shreya Dhanwanthary", "Hemant Kher"],
    languages: ["Hindi", "English"],
    platforms: [
      {
        name: "SonyLIV",
        url: "https://sonyliv.com/shows/scam-1992",
        logo: "📱"
      }
    ],
    regions: ["India", "US", "UK"],
    imdbRating: 9.5,
    synopsis: "Set in 1980's & 90's Bombay, it follows the life of Harshad Mehta - a stockbroker who single-handedly took the stock market to dizzying heights.",
    seasons: 1
  },
  {
    id: "4",
    title: "Dune",
    type: "movie",
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop",
    year: 2021,
    director: "Denis Villeneuve",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac"],
    languages: ["English"],
    platforms: [
      {
        name: "Netflix",
        url: "https://netflix.com/title/81002370",
        logo: "🎬"
      },
      {
        name: "Prime Video",
        url: "https://primevideo.com/detail/dune",
        logo: "📺"
      }
    ],
    regions: ["US", "UK", "Canada", "India", "Australia"],
    imdbRating: 8.0,
    rottenTomatoesRating: 83,
    synopsis: "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset.",
    duration: "2h 35min"
  },
  {
    id: "5",
    title: "The Family Man",
    type: "series",
    poster: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=450&fit=crop",
    year: 2019,
    director: "Raj Nidimoru, Krishna D.K.",
    genres: ["Action", "Drama", "Thriller"],
    cast: ["Manoj Bajpayee", "Samantha Ruth Prabhu", "Priyamani"],
    languages: ["Hindi", "Tamil", "Telugu"],
    platforms: [
      {
        name: "Prime Video",
        url: "https://primevideo.com/detail/the-family-man",
        logo: "📺"
      }
    ],
    regions: ["India", "US", "UK"],
    imdbRating: 8.7,
    synopsis: "A working man from the National Investigation Agency tries to protect the nation from terrorism, but he also needs to protect his family from his secret job.",
    seasons: 2,
    trending: true
  }
];

export const trendingMovies = mockMovies.filter(movie => movie.trending);
