import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }
  const user_id = (await supabase.auth.getUser()).data.user?.id
  const { data } = await supabase.rpc('check_user_exists', { userid: user_id })
  if (user_id && !(!!data)) {
    return NextResponse.redirect(requestUrl.origin + "/onboarding")
  }
  return NextResponse.redirect(requestUrl.origin)
}
