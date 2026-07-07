/** True se l'errore è un duplicate key di MongoDB (violazione di un indice unico). */
export function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { code?: number }).code === 11000
  );
}
