'use client'

import { useFormStatus } from 'react-dom'
import { Button } from './ui/button'

export function SubmitButton({ text }: { text?: string }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" aria-disabled={pending} disabled={pending}>
            {(text ? text : 'Submit') + (pending ? " ..." : '')}
        </Button>
    )
}