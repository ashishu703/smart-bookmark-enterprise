export function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className = "", children }) {
  return (
    <div className={["p-5 border-b border-slate-100", className].join(" ")}>
      {children}
    </div>
  )
}

export function CardContent({ className = "", children }) {
  return <div className={["p-5", className].join(" ")}>{children}</div>
}
