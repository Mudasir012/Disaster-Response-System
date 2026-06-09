export function Skeleton({ className }) {
  return (
    <div
      className={`rounded-md bg-white/[0.04] animate-pulse ${className || ''}`}
      aria-hidden="true"
    />
  )
}
