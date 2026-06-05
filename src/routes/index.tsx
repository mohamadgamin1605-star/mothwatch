import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ITEMS } from "@/lib/catalog";
import { fetchAnimeList, jikanTitle } from "@/lib/jikan";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MothWatch — Free Anime & Movies" },
      { name: "description", content: "Browse a huge catalog of anime plus curated movies on MothWatch." },
      { property: "og:title", content: "MothWatch — Free Anime & Movies" },
      { property: "og:description", content: "Browse a huge catalog of anime plus curated movies on MothWatch." },
    ],
  }),
  component: Index,
});

type Tab = "all" | "movie" | "anime";

function Index() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);

  // Local movies (curated)
  const movies = ITEMS.filter(
    (i) => i.kind === "movie" && i.title.toLowerCase().includes(query.toLowerCase()),
  );

  // Anime from Jikan
  const showAnime = tab === "all" || tab === "anime";
  const animeQuery = useQuery({
    queryKey: ["anime-list", { q: query, page }],
    queryFn: () => fetchAnimeList({ q: query || undefined, page, limit: 24 }),
    enabled: showAnime,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  function changeTab(t: Tab) {
    setTab(t);
    setPage(1);
  }

  function changeQuery(v: string) {
    setQuery(v);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <header className="bg-[#e50914] py-4 text-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          MothWatch Anime & Movies
        </Link>
      </header>

      <nav className="flex justify-center gap-6 bg-[#1a1a1a] py-3 text-sm">
        {(["all", "movie", "anime"] as const).map((t) => (
          <button
            key={t}
            onClick={() => changeTab(t)}
            className={`uppercase tracking-wider transition-colors ${
              tab === t ? "text-[#e50914]" : "text-white/80 hover:text-white"
            }`}
          >
            {t === "all" ? "Trending" : t === "movie" ? "Movies" : "Anime"}
          </button>
        ))}
      </nav>

      <section className="px-5 py-10 text-center">
        <h2 className="text-3xl font-semibold">Watch Free Licensed Content</h2>
        <p className="mt-2 text-white/70">
          Browse the full MyAnimeList catalog plus a curated selection of movies.
        </p>
        <div className="mt-6">
          <input
            type="text"
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
            placeholder="Search anime or movies..."
            className="w-[320px] max-w-full rounded-md px-4 py-2 text-black outline-none"
          />
        </div>
      </section>

      {(tab === "all" || tab === "movie") && movies.length > 0 && (
        <section className="px-6 pb-6">
          <h3 className="mb-3 text-lg font-semibold text-white/80">Movies</h3>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
            {movies.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl bg-[#1c1c1c] transition-transform hover:scale-105"
              >
                <Link to="/watch/$id" params={{ id: item.id }}>
                  <img src={item.image} alt={item.title} className="h-[300px] w-full object-cover" />
                </Link>
                <div className="p-4">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-white/60">{item.genre}</p>
                  <Link
                    to="/watch/$id"
                    params={{ id: item.id }}
                    className="mt-3 inline-block rounded-md bg-[#e50914] px-4 py-2 text-sm font-medium"
                  >
                    Watch
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {showAnime && (
        <section className="px-6 pb-12">
          <h3 className="mb-3 text-lg font-semibold text-white/80">
            {query ? `Anime results for "${query}"` : "Top Anime"}
          </h3>

          {animeQuery.isLoading && (
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-[380px] animate-pulse rounded-xl bg-[#1c1c1c]" />
              ))}
            </div>
          )}

          {animeQuery.isError && (
            <p className="text-red-400">
              Couldn't load anime catalog. Please try again in a moment.
            </p>
          )}

          {animeQuery.data && (
            <>
              <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
                {animeQuery.data.data.map((a) => {
                  const title = jikanTitle(a);
                  const id = `anime-${a.mal_id}`;
                  return (
                    <article
                      key={a.mal_id}
                      className="overflow-hidden rounded-xl bg-[#1c1c1c] transition-transform hover:scale-105"
                    >
                      <Link to="/watch/$id" params={{ id }}>
                        <img
                          src={a.images.jpg.large_image_url}
                          alt={title}
                          loading="lazy"
                          className="h-[300px] w-full object-cover"
                        />
                      </Link>
                      <div className="p-4">
                        <h4 className="line-clamp-1 font-semibold" title={title}>
                          {title}
                        </h4>
                        <p className="text-sm text-white/60">
                          {a.genres.slice(0, 2).map((g) => g.name).join(" / ") || "Anime"}
                          {a.score ? ` · ★ ${a.score}` : ""}
                        </p>
                        <Link
                          to="/watch/$id"
                          params={{ id }}
                          className="mt-3 inline-block rounded-md bg-[#e50914] px-4 py-2 text-sm font-medium"
                        >
                          Watch
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {animeQuery.data.data.length === 0 && (
                <p className="text-center text-white/50">No anime matched your search.</p>
              )}

              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || animeQuery.isFetching}
                  className="rounded-md bg-[#1c1c1c] px-4 py-2 text-sm disabled:opacity-40"
                >
                  ← Previous
                </button>
                <span className="text-sm text-white/60">
                  Page {animeQuery.data.pagination.current_page} of{" "}
                  {animeQuery.data.pagination.last_visible_page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!animeQuery.data.pagination.has_next_page || animeQuery.isFetching}
                  className="rounded-md bg-[#e50914] px-4 py-2 text-sm font-medium disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </section>
      )}

      <footer className="bg-[#1a1a1a] py-5 text-center text-sm text-white/60">
        <p>
          © 2026 MothWatch. Anime catalog powered by{" "}
          <a
            href="https://jikan.moe"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white"
          >
            Jikan / MyAnimeList
          </a>
          . Only host content you have rights to distribute.
        </p>
      </footer>
    </div>
  );
}
