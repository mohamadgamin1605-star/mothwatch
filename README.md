# MothWatch — Free Anime & Movies Streaming

A modern streaming application built with TanStack Start, React 19, and TypeScript. Browse a curated selection of movies and access the full MyAnimeList catalog with multiple streaming servers.

## Features

- 🎬 **Curated Movies** - Handpicked selection of free, licensed movies
- 📺 **MyAnimeList Integration** - Browse the full anime catalog via Jikan API
- 🎚️ **Multiple Servers** - Switch between different streaming providers (MegaPlay, DropFile, VidSrc, 2Embed)
- 🔊 **Audio Options** - Choose between Sub and Dub for anime
- 📱 **Responsive Design** - Optimized for all screen sizes
- ⚡ **Fast Performance** - Server-side rendering with TanStack Start
- 🎨 **Modern UI** - Netflix-inspired dark theme

## Tech Stack

- **Framework**: TanStack Start + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom design system
- **API**: Jikan v4 (MyAnimeList)
- **State Management**: TanStack React Query
- **Routing**: TanStack Router (file-based)
- **Build**: Vite
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
git clone https://github.com/mohamadgamin1605-star/mothwatch.git
cd mothwatch
pnpm install
```

### Development

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

### Linting & Formatting

```bash
pnpm lint       # Run ESLint
pnpm format     # Format with Prettier
```

## Project Structure

```
src/
├── routes/           # TanStack Router file-based routes
│  ├── __root.tsx    # App shell & root layout
│  ├── index.tsx     # Home page (browse movies & anime)
│  └── watch.$id.tsx # Watch page (single title)
├── lib/             # Utility functions
│  ├── catalog.ts          # Curated movies data
│  ├── jikan.ts            # MyAnimeList API client
│  ├── lovable-error-reporting.ts
│  ├── error-page.ts
│  └── error-capture.ts
├── router.tsx       # Router configuration
├── server.ts        # SSR error handling
├── start.ts         # TanStack Start configuration
└── styles.css       # Global styles & design system
```

## API Integration

### Jikan (MyAnimeList)

This project uses the free, public Jikan API to fetch anime data:

- **Search**: `GET /v4/anime?q={query}&page={page}`
- **Top Anime**: `GET /v4/top/anime`
- **Details**: `GET /v4/anime/{id}`
- **Episodes**: `GET /v4/anime/{id}/episodes`
- **Relations**: `GET /v4/anime/{id}/relations`

[Jikan Documentation](https://docs.api.jikan.moe/)

## Streaming Servers

The app supports multiple streaming providers:

1. **MegaPlay** - `animeplay.cfd`
2. **DropFile** - `dropfile.cc`
3. **VidSrc** - `vidsrc.cc`
4. **2Embed** - `2embed.cc`

> ⚠️ **Legal Notice**: Only use this app to stream content you have rights to distribute. Verify all content compliance before deploying.

## Configuration

### Vite Config

The project uses `@lovable.dev/vite-tanstack-config` which includes:

- TanStack Start
- Vite React
- Tailwind CSS
- TypeScript path aliases
- Component tagging (dev-only)
- Error logging

### Environment Variables

No sensitive environment variables required. All APIs used are public.

## Deployment

### Vercel (Recommended)

```bash
vercel
```

### Other Platforms

The build output is in `.output/` after running `pnpm build`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Disclaimer

This project is for educational purposes. Users are responsible for ensuring they only stream content they have rights to access. The creator is not liable for any copyright or legal issues arising from the use of this application.

## Credits

- Anime data provided by [MyAnimeList](https://myanimelist.net) via [Jikan API](https://jikan.moe)
- UI built with [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Lovable](https://lovable.dev)
