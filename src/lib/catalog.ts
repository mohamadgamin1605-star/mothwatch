export type Item = {
  id: string;
  title: string;
  genre: string;
  image: string;
  kind: "movie" | "anime";
  description: string;
  // YouTube video id used for the embedded player demo
  videoId: string;
};

export const ITEMS: Item[] = [
  {
    id: "night-runner",
    title: "Night Runner",
    genre: "Action / Adventure",
    kind: "movie",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=900&fit=crop",
    description:
      "A retired courier is pulled back into the neon-soaked streets for one last delivery that could topple a city.",
    videoId: "aqz-KE-bpKQ",
  },
  {
    id: "sky-sentinels",
    title: "Sky Sentinels",
    genre: "Fantasy / Anime",
    kind: "anime",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=900&fit=crop",
    description:
      "Above the clouds, a guild of young pilots defends floating islands from ancient mechanical leviathans.",
    videoId: "eRsGyueVLvQ",
  },
  {
    id: "lost-horizon",
    title: "Lost Horizon",
    genre: "Drama / Mystery",
    kind: "movie",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=900&fit=crop",
    description:
      "A grieving cartographer chases a map that may lead to a place that erases memory — for better or worse.",
    videoId: "ScMzIvxBSi4",
  },
  {
    id: "neon-samurai",
    title: "Neon Samurai",
    genre: "Sci-Fi / Anime",
    kind: "anime",
    image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=600&h=900&fit=crop",
    description:
      "In a rain-slick megacity, a masterless swordsman trades his blade for a current-charged katana.",
    videoId: "LXb3EKWsInQ",
  },
  {
    id: "crimson-tide",
    title: "Crimson Tide",
    genre: "Thriller",
    kind: "movie",
    image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&h=900&fit=crop",
    description:
      "A coastal town's lighthouse keeper notices the tide bringing in something it shouldn't.",
    videoId: "EngW7tLk6R8",
  },
  {
    id: "spirit-garden",
    title: "Spirit Garden",
    genre: "Slice of Life / Anime",
    kind: "anime",
    image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=600&h=900&fit=crop",
    description:
      "A quiet florist inherits a greenhouse where every plant holds a forgotten memory of its previous owner.",
    videoId: "hFZFjoX2cGg",
  },
];

export function getItem(id: string): Item | undefined {
  return ITEMS.find((i) => i.id === id);
}
