export function Container({ className = "", children }) {
  return (
    <div className={["mx-auto w-full max-w-4xl px-4", className].join(" ")}>
      {children}
    </div>
  )
}
