import { Step } from "@/enums/registration-step"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const user_id = (await supabase.auth.getUser()).data.user?.id
    const { data, error } = await supabase.rpc('check_user_step')
    if (error) {
        return NextResponse.json({ message: 'Error connecting to the database' }, { status: 400 })
    }
    console.log(data);
    let res
    switch (data) {
        case Step.uninitialized:
            res = { step: data, message: 'User profile not initialized' }
        case Step.registerd:
            res = { step: data, message: `User's expertise not initialized` }
        case Step.completed:
            res = { step: data, message: `User's profile has already been initialized` }
    }
    console.log(res);
    return Response.json(res)
}