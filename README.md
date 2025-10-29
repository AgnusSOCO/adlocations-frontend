# Ad Locations Management Platform - Frontend

This is the frontend application for the Ad Locations Management Platform, built with React, Vite, and modern UI libraries.

## Features

- **React 19** - Latest React with concurrent features
- **Vite** - Lightning-fast development and build
- **tRPC** - Type-safe API client
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Mapbox GL** - Interactive maps
- **i18next** - Internationalization (English/Spanish)
- **PWA** - Progressive Web App with offline support
- **Multi-Currency** - Support for USD, MXN, EUR, GBP, CAD

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **API Client**: tRPC
- **Routing**: Wouter
- **Forms**: React Hook Form
- **Maps**: Mapbox GL + react-map-gl
- **Charts**: Recharts
- **i18n**: i18next + react-i18next
- **Offline**: Workbox (Service Worker)

## Prerequisites

- Node.js 18 or higher
- pnpm (or npm/yarn)
- Backend API running (see backend README)

## Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables (see below)
cp .env.example .env

# Start development server
pnpm dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# API
VITE_API_URL=http://localhost:3000
# or for production:
# VITE_API_URL=https://your-railway-backend.railway.app

# Mapbox
VITE_MAPBOX_ACCESS_TOKEN=pk.your-mapbox-token
VITE_MAPBOX_STYLE_URL=mapbox://styles/your-style

# App Config
VITE_APP_ID=ad-locations-platform
VITE_APP_TITLE=Ad Locations Management
VITE_APP_LOGO=https://your-logo-url.com/logo.png

# OAuth (if using Manus OAuth)
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.your-domain.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## Project Structure

```
ad-locations-frontend/
├── client/
│   ├── public/              # Static assets
│   │   ├── manifest.json    # PWA manifest
│   │   └── sw.js           # Service Worker
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── AIAssistant.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── MapView.tsx
│   │   │   ├── PhotoUpload.tsx
│   │   │   └── ...
│   │   ├── contexts/        # React contexts
│   │   │   ├── CurrencyContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/           # Custom hooks
│   │   │   └── useOffline.ts
│   │   ├── lib/             # Utilities
│   │   │   ├── trpc.ts     # tRPC client
│   │   │   ├── utils.ts    # Helper functions
│   │   │   └── exportUtils.ts
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AdLocations.tsx
│   │   │   ├── Landlords.tsx
│   │   │   ├── Clients.tsx
│   │   │   └── ...
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   ├── index.css        # Global styles
│   │   ├── i18n.ts          # i18n configuration
│   │   └── const.ts         # Constants
│   └── index.html           # HTML template
├── shared/                   # Shared types/constants
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── postcss.config.js        # PostCSS configuration
├── package.json
└── README.md
```

## Features

### Dashboard
- Overview metrics (locations, occupancy, revenue)
- Revenue trends chart
- Occupancy distribution
- Payment and maintenance status
- Upcoming expirations widget

### Ad Locations Management
- List all locations with search/filter
- Create/edit/delete locations
- Interactive map picker for coordinates
- Photo upload with S3 storage
- QR code generation
- Export to CSV/PDF

### Landlords Management
- List all landlords
- Create/edit/delete landlords
- Contract tracking
- Payment status monitoring

### Clients Management
- List all clients
- Create/edit/delete clients
- Rental tracking
- Account status management

### Structures Management
- List all structures
- Create/edit/delete structures
- Maintenance scheduling
- Photo documentation (before/after)
- License tracking

### AI Features
- AI Assistant chat widget (DeepSeek)
- Location analysis from photos
- Price estimation
- Quote generation
- Contract review
- Maintenance predictions

### Map Features
- Interactive map overview of all locations
- Color-coded markers by status
- Click markers for location details
- Map picker for coordinate selection

### Internationalization
- English and Spanish (Mexico) support
- Language switcher in header
- Localized dates and numbers
- Persistent language preference

### Multi-Currency
- Support for USD, MXN, EUR, GBP, CAD
- Currency switcher in header
- Automatic price conversion
- Exchange rate integration

### Offline Support
- Service Worker for offline functionality
- Offline indicator banner
- Background sync when online
- PWA installable

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy!

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

### Netlify

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Docker

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Configuration

### Vite Configuration

The `vite.config.ts` includes:
- React plugin
- Tailwind CSS plugin
- Path aliases (@, @shared, @assets)
- HMR configuration for proxied environments
- Build optimization

### Tailwind Configuration

Custom theme with:
- Inter and Space Grotesk fonts
- Custom color palette
- Dark/light mode support
- Custom animations
- Extended utilities

### i18n Configuration

Translations in `client/src/i18n.ts`:
- English (en)
- Spanish - Mexico (es-MX)
- Add more languages by extending the resources object

## Customization

### Adding a New Page

1. Create page component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Add navigation link in `DashboardLayout.tsx` (if needed)

### Adding a New Language

1. Add translations in `client/src/i18n.ts`
2. Update language switcher in `LanguageSwitcher.tsx`

### Adding a New Currency

1. Add currency to `CurrencyContext.tsx`
2. Update currency switcher in `CurrencySwitcher.tsx`
3. Add exchange rate logic

### Customizing Theme

Edit `client/src/index.css`:
- Update CSS variables for colors
- Change font families
- Adjust spacing, shadows, etc.

## Troubleshooting

### API Connection Issues

```typescript
// Check API URL in browser console
console.log(import.meta.env.VITE_API_URL);

// Verify CORS is configured on backend
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules .vite dist
pnpm install
pnpm build
```

### Map Not Loading

```bash
# Verify Mapbox token
echo $VITE_MAPBOX_ACCESS_TOKEN

# Check browser console for Mapbox errors
```

### Service Worker Issues

```bash
# Unregister service worker in browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

## Performance Optimization

- Code splitting with dynamic imports
- Image optimization with lazy loading
- Bundle size analysis: `pnpm build --analyze`
- Lighthouse audit for performance metrics

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Support

For deployment issues, see `DEPLOYMENT_GUIDE.md`
For application issues, contact your development team
