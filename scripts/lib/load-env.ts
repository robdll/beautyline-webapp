import path from 'node:path';
import dotenv from 'dotenv';

/**
 * Matches other scripts: `.env` first, then `.env.local` (dotenv default: no override).
 */
export function loadWorkspaceEnv(): void {
  const workspaceRoot = process.cwd();
  dotenv.config({ path: path.join(workspaceRoot, '.env'), override: false });
  dotenv.config({ path: path.join(workspaceRoot, '.env.local'), override: false });
}
