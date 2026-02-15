import { forwardRef } from "react"

const base =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-slate-50 disabled:text-slate-400"

export const Input = forwardRef(function Input(
  { className = "", type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={[base, className].filter(Boolean).join(" ")}
      {...props}
    />
  )
})
