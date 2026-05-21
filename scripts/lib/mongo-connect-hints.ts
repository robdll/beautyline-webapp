/**
 * Extra context when MongoDB Atlas `mongodb+srv://` fails during DNS SRV lookup.
 */
export function explainMongoSrvDnsFailure(scriptId: string, error: unknown): void {
  const err = error as { code?: string; syscall?: string; message?: string };
  const isSrvDns =
    err?.syscall === 'querySrv' ||
    err?.code === 'EREFUSED' ||
    (typeof err?.message === 'string' && err.message.includes('querySrv'));
  if (!isSrvDns) return;

  console.error(
    `[${scriptId}] Atlas \`mongodb+srv://\` uses DNS SRV; this machine refused or could not resolve it.\n` +
      '  • In Atlas: Connect → Drivers → use the standard connection string (\`mongodb://host:27017,...\`) in MONGODB_URI_PROD / MONGODB_URI for scripts, or try another network/VPN/DNS.\n' +
      '  • Optional: `NODE_OPTIONS=--dns-result-order=ipv4first` if IPv6/DNS is flaky.\n'
  );
}
