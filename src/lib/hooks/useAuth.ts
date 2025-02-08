// src/lib/hooks/useAuth.ts
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase/client'

export function useAuth() {
  const router = useRouter()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return { signOut }
}