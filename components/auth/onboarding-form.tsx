"use client"
import * as z from "zod"
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
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

const OnboardingForm = ({ callback }: { callback: (formData: FormData) => Promise<void> }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })
    return (
        <Form {...form}>
            <form action={callback} className="space-y-8">
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
                        <FormLabel>Username</FormLabel>
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
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}

export default OnboardingForm;
const formSchema = z.object({
    username: z.string({
        required_error: "username is required",
        invalid_type_error: "username must be a string",
    }),
    displayName: z.string({
        required_error: "display name is required",
        invalid_type_error: "display name must be a string",
    }),
    about: z.string().default(''),
    expertise: z.array(z.string(), {
        required_error: "At least one expertise needs to be selected",
    })
})
