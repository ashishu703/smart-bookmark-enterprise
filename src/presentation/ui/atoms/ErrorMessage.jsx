export function ErrorMessage({ title = "Something went wrong", message }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800"
    >
      <p className="text-sm font-semibold">{title}</p>
      {message ? <p className="mt-1 text-sm">{message}</p> : null}
    </div>
  )
}
