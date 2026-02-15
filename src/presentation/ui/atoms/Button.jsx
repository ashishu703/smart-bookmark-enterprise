import { forwardRef } from "react"

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
}

const sizes = {
  sm: "h-9",
  md: "h-11",
  lg: "h-12 px-5 text-base",
}

export const Button = forwardRef(function Button(
  { className = "", variant = "primary", size = "md", type = "button", ...props },
  ref
) {
  const variantClass = variants[variant] ?? variants.primary
  const sizeClass = sizes[size] ?? sizes.md

  return (
    <button
      ref={ref}
      type={type}
      className={[base, variantClass, sizeClass, className].filter(Boolean).join(" ")}
      {...props}
    />
  )
})
