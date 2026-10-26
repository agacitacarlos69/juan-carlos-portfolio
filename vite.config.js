import { defineConfig } from 'vite';

// The deployment workflow supplies the repository path automatically.
// Locally, / keeps development and preview simple.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  // Allow the workspace preview host without disabling Vite's host checks.
  server: { allowedHosts: ['terminal.local'] },
});
