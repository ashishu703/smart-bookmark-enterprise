let lastCall=0
export function guard(interval=500){
  const now=Date.now()
  if(now-lastCall<interval) return false
  lastCall=now
  return true
}
