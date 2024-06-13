import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix({
      ssr: false,
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      ignoredRouteFiles: ['**/*.css'],
      routes(defineRoutes) {
        return defineRoutes(route => {
          route('/auth', 'routes/auth.tsx');
          route('/', 'routes/root.tsx', { id: 'index' }, () => {
            route('note/:noteId', 'routes/note.tsx');
            route('new-note', 'routes/new-note.tsx');
          });
          route('*', 'routes/root.tsx', { id: 'splat' });
        });
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    host: 'localhost',
    port: 3000,
  },
});
