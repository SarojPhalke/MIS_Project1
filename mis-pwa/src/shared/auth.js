import React from 'react'
// import { supabase } from './supabase'

export function useSession() {
  const [session, setSession] = React.useState(null)
  React.useEffect(() => {
    // supabase not connected, skip session logic
  }, [])
  return session
}

export function useRole() {
  const session = useSession()
  const [role, setRole] = React.useState(null)
  React.useEffect(() => {
    // supabase not connected, skip role logic
  }, [session?.user?.id])
  return role
}

export async function signInWithEmail(email) {
  // supabase not connected, skip sign in
  return
}

export async function signOut() {
  // supabase not connected, skip sign out
  return
}


