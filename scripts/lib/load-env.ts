import path from 'node:path';
import dotenv from 'dotenv';

/**
 * Loads workspace env for tsx scripts: `.env`, then `.env.local` overriding same keys (Next-style).
 */
export function loadWorkspaceEnv(): void {
  const workspaceRoot = process.cwd();
  dotenv.config({ path: path.join(workspaceRoot, '.env'), override: false });
  dotenv.config({ path: path.join(workspaceRoot, '.env.local'), override: true });
}
