import React from 'react'
import { supabase } from './supabase'

export function useSession() {
  const [session, setSession] = React.useState(null)
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session || null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])
  return session
}

export function useRole() {
  const session = useSession()
  const [role, setRole] = React.useState(null)
  React.useEffect(() => {
    let active = true
    async function fetchRole() {
      if (!session?.user?.id) { setRole(null); return }
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (active) setRole(data?.role || null)
    }
    fetchRole()
    return () => { active = false }
  }, [session?.user?.id])
  return role
}

export async function signInWithEmail(email) {
  await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } })
}

export async function signOut() {
  await supabase.auth.signOut()
}


