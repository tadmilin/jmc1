/**
 * Returns true only when DATABASE_URI points to a real remote MongoDB instance.
 *
 * During Docker/Nixpacks builds the DATABASE_URI build-arg is often absent or
 * defaults to an empty string, which makes Payload fall back to
 * mongodb://localhost:27017.  Mongoose then emits an 'error' event that
 * bypasses try/catch and crashes the Next.js build worker (exit code 1).
 *
 * Call this guard at the top of every generateStaticParams() that touches the
 * database.  When it returns false, return [] immediately — Next.js will
 * render those routes on first request thanks to dynamicParams = true.
 */
export function hasDatabaseUri(): boolean {
  const uri = process.env.DATABASE_URI
  if (!uri || uri.trim() === '') return false
  if (uri.includes('localhost') || uri.includes('127.0.0.1')) return false
  return uri.startsWith('mongodb')
}
