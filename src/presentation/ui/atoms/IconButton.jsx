import { forwardRef } from "react"

const base =
  "inline-flex items-center justify-center rounded-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

const variants = {
  danger: "text-rose-600 hover:bg-rose-50",
  default: "text-slate-700 hover:bg-slate-100",
}

export const IconButton = forwardRef(function IconButton(
  { className = "", variant = "default", type = "button", ...props },
  ref
) {
  const variantClass = variants[variant] ?? variants.default
  return (
    <button
      ref={ref}
      type={type}
      className={[base, variantClass, className].filter(Boolean).join(" ")}
      {...props}
    />
  )
})
