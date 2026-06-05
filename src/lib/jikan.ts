// Jikan v4 (MyAnimeList) — public, no auth, CORS-enabled.
// Docs: https://docs.api.jikan.moe/

export type JikanAnime = {
  mal_id: number;
  title: string;
  title_english: string | null;
  synopsis: string | null;
  genres: { name: string }[];
  images: { jpg: { large_image_url: string; image_url: string } };
  trailer?: { youtube_id: string | null } | null;
  episodes: number | null;
  score: number | null;
  year: number | null;
};

export type JikanEpisode = {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  aired: string | null;
  filler: boolean;
  recap: boolean;
};

export type JikanRelation = {
  relation: string;
  entry: { mal_id: number; type: string; name: string; url: string }[];
};

type JikanListResponse = {
  data: JikanAnime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
  };
};

type JikanEpisodesResponse = {
  data: JikanEpisode[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
};

const BASE = "https://api.jikan.moe/v4";

export async function fetchAnimeList(params: {
  q?: string;
  page?: number;
  limit?: number;
}): Promise<JikanListResponse> {
  const { q, page = 1, limit = 24 } = params;
  const url = new URL(q ? `${BASE}/anime` : `${BASE}/top/anime`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (q) url.searchParams.set("q", q);
  url.searchParams.set("sfw", "true");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to load anime (${res.status})`);
  return res.json();
}

export async function fetchAnimeById(id: number): Promise<JikanAnime> {
  const res = await fetch(`${BASE}/anime/${id}`);
  if (!res.ok) throw new Error(`Failed to load anime ${id}`);
  const json = (await res.json()) as { data: JikanAnime };
  return json.data;
}

export async function fetchAnimeEpisodes(
  id: number,
  page = 1,
): Promise<JikanEpisodesResponse> {
  const res = await fetch(`${BASE}/anime/${id}/episodes?page=${page}`);
  if (!res.ok) throw new Error(`Failed to load episodes for ${id}`);
  return res.json();
}

export async function fetchAnimeRelations(id: number): Promise<JikanRelation[]> {
  const res = await fetch(`${BASE}/anime/${id}/relations`);
  if (!res.ok) throw new Error(`Failed to load relations for ${id}`);
  const json = (await res.json()) as { data: JikanRelation[] };
  return json.data;
}

export function jikanTitle(a: JikanAnime): string {
  return a.title_english || a.title;
}
