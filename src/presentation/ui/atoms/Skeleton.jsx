export function Skeleton({ className = "" }) {
  return (
    <div
      className={[
        "animate-pulse rounded-md bg-slate-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="presentation"
    />
  )
}
