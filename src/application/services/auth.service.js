import { SupabaseAuthGateway } from "../../infrastructure/SupabaseAuthGateway"

const gateway = new SupabaseAuthGateway()

export async function getSession() {
  return gateway.getSession()
}

export function onAuthStateChange(callback) {
  return gateway.onAuthStateChange(callback)
}

export async function signInWithGoogle() {
  return gateway.signInWithGoogle({ redirectTo: window.location.origin })
}

export async function signOut() {
  return gateway.signOut()
}
