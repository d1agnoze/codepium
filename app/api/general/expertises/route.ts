import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data, error } = await supabase.from('Expertise').select(`display_name`)
    if (!error) {
        const res = data.map(item => item.display_name)
        return Response.json(res)
    }
    return NextResponse.error()
}