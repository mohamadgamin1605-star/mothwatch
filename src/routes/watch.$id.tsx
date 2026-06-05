import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getItem, ITEMS } from "@/lib/catalog";
import {
  fetchAnimeById,
  fetchAnimeEpisodes,
  fetchAnimeRelations,
  jikanTitle,
  type JikanAnime,
  type JikanRelation,
} from "@/lib/jikan";

type LoaderData =
  | { kind: "local"; item: ReturnType<typeof getItem> & object }
  | { kind: "anime"; malId: number };

export const Route = createFileRoute("/watch/$id")({
  loader: ({ params }): LoaderData => {
    if (params.id.startsWith("anime-")) {
      const malId = Number(params.id.slice("anime-".length));
      if (!Number.isFinite(malId)) throw notFound();
      return { kind: "anime", malId };
    }
    const item = getItem(params.id);
    if (!item) throw notFound();
    return { kind: "local", item };
  },
  head: ({ loaderData }) => {
    if (loaderData?.kind === "local" && loaderData.item) {
      const item = loaderData.item;
      return {
        meta: [
          { title: `${item.title} — MothWatch` },
          { name: "description", content: item.description },
        ],
      };
    }
    return { meta: [{ title: "Watch — MothWatch" }] };
  },
  notFoundComponent: NotFound,
  errorComponent: ErrorView,
  component: WatchPage,
});

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#111] p-6 text-center text-white">
      <h1 className="text-3xl font-bold">Title not found</h1>
      <Link to="/" className="mt-6 rounded-md bg-[#e50914] px-4 py-2 text-sm font-medium">
        Back to catalog
      </Link>
    </div>
  );
}

function ErrorView({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#111] p-6 text-center text-white">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-white/60">{error.message}</p>
      <Link to="/" className="mt-6 rounded-md bg-[#e50914] px-4 py-2 text-sm font-medium">
        Back to catalog
      </Link>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#111] text-white">
      <header className="bg-[#e50914] py-4 text-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          MothWatch Anime & Movies
        </Link>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link to="/" className="text-sm text-white/60 hover:text-white">
          ← Back to catalog
        </Link>
        {children}
      </div>
      <footer className="bg-[#1a1a1a] py-5 text-center text-sm text-white/60">
        <p>© 2026 MothWatch.</p>
      </footer>
    </div>
  );
}

function YouTubePlayer({ youtubeId, title }: { youtubeId: string; title: string }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl bg-black shadow-lg">
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}

function WatchPage() {
  const data = Route.useLoaderData();

  if (data.kind === "local") {
    const item = data.item!;
    const related = ITEMS.filter((i) => i.kind === item.kind && i.id !== item.id).slice(0, 4);
    return (
      <Shell>
        <YouTubePlayer youtubeId={item.videoId} title={item.title} />
        <div className="mt-6">
          <span className="rounded-full bg-[#e50914]/20 px-3 py-1 text-xs uppercase tracking-wider text-[#ff6b73]">
            {item.kind}
          </span>
          <h1 className="mt-3 text-3xl font-bold">{item.title}</h1>
          <p className="mt-1 text-white/60">{item.genre}</p>
          <p className="mt-4 max-w-3xl text-white/80">{item.description}</p>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold">More like this</h2>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))]">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/watch/$id"
                  params={{ id: r.id }}
                  className="overflow-hidden rounded-lg bg-[#1c1c1c] transition-transform hover:scale-105"
                >
                  <img src={r.image} alt={r.title} className="h-[220px] w-full object-cover" />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold">{r.title}</h3>
                    <p className="text-xs text-white/50">{r.genre}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Shell>
    );
  }

  return <AnimeWatchView malId={data.malId} />;
}

function AnimeWatchView({ malId }: { malId: number }) {
  const { data: anime, isLoading, isError, error } = useQuery({
    queryKey: ["anime", malId],
    queryFn: () => fetchAnimeById(malId),
    staleTime: 5 * 60_000,
  });

  if (isLoading) {
    return (
      <Shell>
        <div className="mt-4 aspect-video animate-pulse rounded-xl bg-[#1c1c1c]" />
        <div className="mt-6 h-8 w-2/3 animate-pulse rounded bg-[#1c1c1c]" />
      </Shell>
    );
  }
  if (isError || !anime) {
    return (
      <Shell>
        <p className="mt-8 text-red-400">
          Couldn't load this title: {(error as Error)?.message ?? "unknown error"}
        </p>
      </Shell>
    );
  }

  return <AnimeDetail anime={anime} />;
}

// All servers below accept a MAL id (which Jikan gives us directly), so no
// id conversion is needed. Each one is a different scraper aggregator, so if
// one is offline or missing a title the user can quickly switch.
type AudioMode = "sub" | "dub";

const SERVERS = [
  {
    id: "megaplay",
    label: "MegaPlay",
    build: (mal: number, ep: number, audio: AudioMode) =>
      `https://animeplay.cfd/stream/mal/${mal}/${ep}/${audio}`,
  },
  {
    id: "dropfile",
    label: "DropFile",
    build: (mal: number, ep: number, audio: AudioMode) =>
      `https://dropfile.cc/player/tv/mal-${mal}/1/${ep}?audio=${audio}&lang=en&color=%23e50914&autoplay=0`,
  },
  {
    id: "vidsrc",
    label: "VidSrc",
    build: (mal: number, ep: number, audio: AudioMode) =>
      `https://vidsrc.cc/v2/embed/anime/ani${mal}/${ep}/${audio}?autoPlay=false`,
  },
  {
    id: "2embed",
    label: "2Embed",
    build: (mal: number, ep: number, _audio: AudioMode) =>
      `https://2embed.cc/embedtv/${mal}&s=1&e=${ep}`,
  },
] as const;

function AnimeDetail({ anime }: { anime: JikanAnime }) {
  const title = jikanTitle(anime);
  const [ep, setEp] = useState(1);
  const [audio, setAudio] = useState<AudioMode>("sub");
  const [serverId, setServerId] = useState<(typeof SERVERS)[number]["id"]>(SERVERS[0].id);

  const epsQuery = useQuery({
    queryKey: ["anime-eps", anime.mal_id],
    queryFn: () => fetchAnimeEpisodes(anime.mal_id, 1),
    staleTime: 5 * 60_000,
  });
  const relsQuery = useQuery({
    queryKey: ["anime-rels", anime.mal_id],
    queryFn: () => fetchAnimeRelations(anime.mal_id),
    staleTime: 5 * 60_000,
  });

  // Episode count: prefer Jikan list length, else anime.episodes, else 12.
  const epList = epsQuery.data?.data ?? [];
  const epCount = epList.length || anime.episodes || 12;
  const episodeNumbers = Array.from({ length: epCount }, (_, i) => i + 1);

  const server = SERVERS.find((s) => s.id === serverId) ?? SERVERS[0];
  const src = server.build(anime.mal_id, ep, audio);

  // "Seasons" on MAL = related entries (Sequel / Prequel / Side story).
  const seasonRelations: JikanRelation[] = (relsQuery.data ?? []).filter((r) =>
    ["Sequel", "Prequel", "Side story", "Parent story", "Alternative version"].includes(
      r.relation,
    ),
  );

  return (
    <Shell>
      <div className="mt-4 overflow-hidden rounded-xl bg-black shadow-lg">
        <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
          <iframe
            key={src}
            src={src}
            title={`${title} — Episode ${ep}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>

      {/* Audio + Server pickers */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-white/50">Audio:</span>
          {(["sub", "dub"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setAudio(m)}
              className={`rounded-md px-3 py-1 text-xs font-semibold uppercase transition-colors ${
                m === audio
                  ? "bg-[#e50914] text-white"
                  : "bg-[#1c1c1c] text-white/70 hover:bg-[#2a2a2a]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-white/50">Server:</span>
          {SERVERS.map((s) => (
            <button
              key={s.id}
              onClick={() => setServerId(s.id)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                s.id === serverId
                  ? "bg-[#e50914] text-white"
                  : "bg-[#1c1c1c] text-white/70 hover:bg-[#2a2a2a]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-white/40">
          If one server doesn't load, try another.
        </span>
      </div>


      <div className="mt-6">
        <span className="rounded-full bg-[#e50914]/20 px-3 py-1 text-xs uppercase tracking-wider text-[#ff6b73]">
          Anime · Episode {ep}
        </span>
        <h1 className="mt-3 text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-white/60">
          {anime.genres.map((g) => g.name).join(" · ") || "Anime"}
          {anime.episodes ? ` · ${anime.episodes} eps` : ""}
          {anime.year ? ` · ${anime.year}` : ""}
          {anime.score ? ` · ★ ${anime.score}` : ""}
        </p>
      </div>

      {/* Seasons (related entries on MAL) */}
      {seasonRelations.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Seasons & related</h2>
          <div className="flex flex-wrap gap-2">
            {seasonRelations.flatMap((rel) =>
              rel.entry
                .filter((e) => e.type === "anime")
                .map((e) => (
                  <Link
                    key={`${rel.relation}-${e.mal_id}`}
                    to="/watch/$id"
                    params={{ id: `anime-${e.mal_id}` }}
                    className="rounded-md bg-[#1c1c1c] px-3 py-2 text-sm text-white/80 hover:bg-[#2a2a2a]"
                  >
                    <span className="mr-2 text-xs uppercase tracking-wider text-[#ff6b73]">
                      {rel.relation}
                    </span>
                    {e.name}
                  </Link>
                )),
            )}
          </div>
        </section>
      )}

      {/* Episode picker */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">
          Episodes {epsQuery.isLoading && <span className="text-xs text-white/40">loading…</span>}
        </h2>
        <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(70px,1fr))]">
          {episodeNumbers.map((n) => {
            const meta = epList.find((e) => e.mal_id === n);
            const active = n === ep;
            return (
              <button
                key={n}
                onClick={() => {
                  setEp(n);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                title={meta?.title ?? `Episode ${n}`}
                className={`rounded-md py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#e50914] text-white"
                    : "bg-[#1c1c1c] text-white/80 hover:bg-[#2a2a2a]"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </section>

      {anime.synopsis && (
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-semibold">Synopsis</h2>
          <p className="max-w-3xl whitespace-pre-line text-white/80">{anime.synopsis}</p>
        </section>
      )}
    </Shell>
  );
}
