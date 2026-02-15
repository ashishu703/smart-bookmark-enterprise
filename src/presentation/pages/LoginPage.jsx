import { useMemo, useState } from "react"
import { signInWithGoogle as signInWithGoogleService } from "../../application/services/auth.service"
import { AuthLayout } from "../ui/layouts/AuthLayout"
import { Button } from "../ui/atoms/Button"
import { Input } from "../ui/atoms/Input"
import { Spinner } from "../ui/atoms/Spinner"
import { FormField } from "../ui/molecules/FormField"

function GoogleIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.657 32.091 29.135 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.807 0 5.36 1.057 7.31 2.784l5.657-5.657C33.541 6.053 28.954 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917Z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691 12.88 19.51C14.656 15.108 18.961 12 24 12c2.807 0 5.36 1.057 7.31 2.784l5.657-5.657C33.541 6.053 28.954 4 24 4 16.318 4 9.656 8.329 6.306 14.691Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c4.858 0 9.357-1.86 12.732-4.894l-6.202-5.249C28.668 35.26 26.43 36 24 36c-5.114 0-9.622-2.893-11.287-7.056l-6.523 5.025C9.505 39.556 16.227 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a11.98 11.98 0 0 1-4.773 5.857l.003-.002 6.202 5.249C36.28 39.5 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"
      />
    </svg>
  )
}

function SideArtwork() {
  const gradient = useMemo(
    () =>
      "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_45%),linear-gradient(135deg,#f7b267,#f79d65,#c084fc,#60a5fa)]",
    []
  )

  return (
    <div className={"h-full w-full " + gradient}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <p className="text-lg font-semibold">Save your work in one place</p>
        <p className="mt-1 text-sm text-white/90">
          Private bookmarks with real-time sync.
        </p>
      </div>
    </div>
  )
}

export function LoginPage({ onError }) {
  const [loading, setLoading] = useState(false)

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      await signInWithGoogleService()
    } catch (e) {
      onError?.("Google login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Hello Again!"
      subtitle="Sign in to start saving your bookmarks"
      side={<SideArtwork />}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <FormField label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              disabled
              aria-describedby="email-help"
            />
          </FormField>

          <FormField label="Password" htmlFor="password">
            <Input id="password" type="password" placeholder="••••••••" disabled />
          </FormField>

          <Button className="w-full" disabled>
            Sign In
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={signInWithGoogle}
          disabled={loading}
          aria-label="Sign in with Google"
        >
          {loading ? <Spinner className="border-slate-300/80 border-t-slate-800" /> : <GoogleIcon className="h-5 w-5" />}
          Sign in with Google
        </Button>

        <p className="text-xs text-slate-500">
          By continuing, you agree to use Google OAuth. Email/password sign-in is
          disabled.
        </p>
      </div>
    </AuthLayout>
  )
}
