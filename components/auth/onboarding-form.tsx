"use client"
import * as z from "zod"
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "../SubmitButton";
import { formSchema } from "@/schemas/create-use.schema";
import { useFormState } from "react-dom";
import { addMetadata } from "@/app/onboarding/actions";
import { useEffect, useOptimistic } from "react";
import { stat } from "fs";
import { toast } from "react-toastify";
import useLoading from "@/hooks/loading";
import { redirect, useRouter } from "next/navigation";
import { MessageObject } from "@/types/message.route";

const OnboardingForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) })
    const [state, formAction] = useFormState(addMetadata, initState)
    const {toggleVisibility} = useLoading()
    const router = useRouter()
    useEffect(() => {
        if (state.message !== '' && state.ok) toast.success(state.message)
        if (state.message !== '' && !state.ok) toast.error(state.message)
    }, [state])
    const submitForm = async (formData: FormData) => {
        toggleVisibility()
        await formAction(formData)
        toggleVisibility()
        redirect('/onboarding')
    }
    return (
        <Form {...form}>
            <form action={submitForm} className="space-y-8">
                <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="You username" {...field} />
                        </FormControl>
                        <FormDescription>
                            Your username is going to be @{field.value}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="displayName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                            <Input placeholder="your display name" {...field} />
                        </FormControl>
                        <FormDescription>
                            This is your public display name.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="about" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tell us more about yourself:</FormLabel>
                        <FormControl>
                            <Textarea placeholder="You can leave this blank" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <SubmitButton />
            </form>
        </Form>
    );
}

export default OnboardingForm;

const initState: MessageObject = {
    message: '',
    ok: true
}
