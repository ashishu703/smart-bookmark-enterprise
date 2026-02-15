export function AuthLayout({ title, subtitle, children, side }) {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5 md:grid-cols-2">
        <section className="p-8 sm:p-10">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
          </header>
          <div className="mt-8">{children}</div>
        </section>

        <aside className="relative hidden md:block">
          {side}
        </aside>
      </div>
    </div>
  )
}
