# GoOut

Social discovery app for finding people and events in your city.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Deploy

### Vercel (one command)
```bash
npm i -g vercel
vercel
```
Or push to GitHub and import at vercel.com — zero config, `vercel.json` already included.

### Netlify
```bash
npm run build
npx netlify-cli deploy --prod --dir dist
```
Or drag the `dist/` folder to netlify.com/drop.

## Stack

- React 18 + TypeScript  
- Vite 6  
- Tailwind CSS v4  
- Motion (Framer Motion v12)  
- Leaflet / react-leaflet (map)  
- Radix UI primitives  
- Supabase (auth + backend)

## Supabase credentials

Located in `utils/supabase/info.tsx`.  
Replace `projectId` and `publicAnonKey` with your own project values for production.
