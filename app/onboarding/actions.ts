"use server"

import { formSchema } from "@/schemas/create-use.schema";
import Supabase from "@/utils/supabase/route-handler";

export async function addMetadata(formData: FormData): Promise<MessageObject> {
    const validate = formSchema.safeParse({
        about: formData.get('about') ? formData.get('about') : '',
        user_name: formData.get('username'),
        display_name: formData.get('displayName'),
    })
    if (!validate.success)
        return { message: "Bad request", ok: false }

    const supabase = Supabase()
    const user = (await supabase.auth.getUser()).data.user!
    const res = await supabase.rpc('check_user_exists', { userid: user.id })
    if (!(!!res.data)) {
        const { error } = await supabase.rpc('create_user_data', {
            username: validate.data.username,
            displayname: validate.data.displayName,
            about_param: validate.data.about
        })
        return !error ? { message: "User data created", ok: true } : { message: "An Error has occured, please try again later", ok: false }
    }
    return { message: "User have already been created", ok: false }
}


export async function setExpertise(prevState: any, formData: FormData): Promise<MessageObject> {
    if (formData.get('data') != null) {
        const selected = JSON.parse(formData.get('data')?.toString()!)
        console.log(selected);
        if (selected.length == 0) {
            return { message: "You cannot empty your expertise!", ok: false }
        }
        return { message: "Expertise confirmed", ok: true }
    }
    return { message: "Bad request", ok: false }
}