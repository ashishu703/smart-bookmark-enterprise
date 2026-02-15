import { supabase } from "../shared/supabaseClient"

export class SupabaseAuthGateway {
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  }

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback?.(session)
    })
  }

  async signInWithGoogle({ redirectTo }) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    })
    if (error) throw error
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}
