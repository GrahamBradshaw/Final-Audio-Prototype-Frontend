# Kikuyu Voice Bridge - Frontend

React Router 7 frontend for Kikuyu Voice Bridge, optimized for Vercel deployment.

## Overview

- **Framework**: React Router 7 with Vite
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Deployment**: Vercel

## Setup

### Local Development

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Run development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

**Development** (`.env.local`):
```
VITE_API_BASE_URL=http://localhost:8000
```

**Production** (Set in Vercel Dashboard):
```
VITE_API_BASE_URL=https://your-backend-project.vercel.app
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Serve production build locally
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
frontend/
├── app/
│   ├── components/       # React components
│   ├── routes/          # React Router routes
│   ├── services/        # API service layer
│   ├── contexts/        # Context providers (Theme, etc)
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── root.tsx         # App root component
│   └── app.css          # Global styles
├── public/              # Static assets
├── package.json
├── vite.config.ts
├── react-router.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

## Key Components

- **TriggerPage**: Main recording interface with backend integration
- **ThemeContext**: Light/dark mode management
- **useRedirectOnRefresh**: Custom hook for navigation

## API Integration

All API calls go through the `apiService` in `app/services/api.ts`. The service automatically uses the configured `VITE_API_BASE_URL` environment variable.

### Available API Methods

- `healthCheck()` - Check backend health
- `startRecording()` - Start backend recording
- `stopRecording()` - Stop recording and get results

## Vercel Deployment

1. Connect repository to Vercel
2. Set root directory to `frontend/`
3. Configure environment variables:
   - `VITE_API_BASE_URL`: Your backend URL
4. Deploy

The `vercel.json` file handles build configuration automatically.

## Notes

- App uses dark mode by default on systems that prefer it
- Theme preference is persisted in localStorage
- All API communication is handled through environment variables for easy configuration across environments
