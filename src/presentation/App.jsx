import { useState, useEffect } from "react"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { useToast } from "./components/Toast"
import { getSession, onAuthStateChange } from "../application/services/auth.service"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"

export default function App(){
  const[session,setSession]=useState(null)
  const{setMessage,Toast}=useToast()

  useEffect(()=>{
    let mounted = true

    getSession()
      .then((nextSession) => {
        if (mounted) setSession(nextSession)
      })
      .catch(() => {
        if (mounted) setSession(null)
      })

    const { data: sub } = onAuthStateChange((nextSession) => {
      if(mounted) setSession(nextSession)
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  },[])

  if(!session){
    return (
      <ErrorBoundary>
        <LoginPage onError={setMessage} />
        <Toast/>
      </ErrorBoundary>
    )
  }

  return(
    <ErrorBoundary>
      <DashboardPage session={session} onToast={setMessage} />
      <Toast/>
    </ErrorBoundary>
  )
}
