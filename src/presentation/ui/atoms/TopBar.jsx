import { Button } from "./Button"

export function TopBar({ userEmail, onSignOut }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Smart Bookmarks</p>
          <p className="text-xs text-slate-500">{userEmail ?? ""}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  )
}
