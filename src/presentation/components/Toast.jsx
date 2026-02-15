import { useState, useEffect } from "react"
export function useToast(){
  const[message,setMessage]=useState(null)
  useEffect(()=>{
    if(!message)return
    const t=setTimeout(()=>setMessage(null),3000)
    return()=>clearTimeout(t)
  },[message])
  const Toast=()=>message?<div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded">{message}</div>:null
  return{setMessage,Toast}
}
