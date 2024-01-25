"use client"
import { useOptimistic, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import useFetchCurrent from "@/hooks/fetch";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/navigation";
import { setExpertise } from "@/app/onboarding/actions";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
export default function ExpertiseForm() {
    const { data, error, loading } = useFetchCurrent('general/expertises')
    const [selected, setSelected] = useState<Expertise[]>([])
    const [columns, setColumns] = useState<Expertise[]>([])
    const router = useRouter()
    const itemsPerColumn = 10
    const [state, formAction] = useFormState(setExpertise, initialState)
    useEffect(() => {
        if (data) {
            setColumns(Array.from({ length: Math.ceil(data.length / itemsPerColumn) }, (_, index) => data.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn)))
        }
        if (error) router.push('/error')
    }, [data, error])
    useEffect(() => {
        if (!state.ok) toast.error(state.message)
        if (state.ok && state.message !== '') {
            toast.success(state.message)
            router.push('/')
        }
    }, [state])

    return (<div className="w-full min-h-max">
        {loading ?
            <div className="w-full flex items-center justify-center"><span className="loading loading-spinner loading-md"></span></div> : <Card>
                <CardHeader>
                    <CardTitle>🎓Select your expertise(s)</CardTitle>
                    <CardDescription>Pick one and starting diving into the world of developers</CardDescription>
                </CardHeader>
                <CardContent>
                    {<div className="flex flex-col gap-3">
                        <ul>
                            {selected.map((item) => (<li key={item.id} className="inline ml-2">
                                <Badge className="bg-accent" onClick={() => setSelected(selected.filter(expertis => expertis.id != item.id))}>{item.display_name}</Badge>
                            </li>))}
                        </ul>
                        <div className="flex flex-wrap gap-6">
                            {columns.map((column, columnIndex) => (
                                <ul key={columnIndex} className="column">
                                    {/**@ts-ignore */}
                                    {column.map((item) => (
                                        <li key={item.id}>
                                            <Badge className={cn("cursor-pointer text-sm", selected.includes(item) && "hidden")} onClick={() => {
                                                if (!selected.includes(item)) {
                                                    setSelected([...selected, item])
                                                }
                                            }}>{item.display_name}</Badge>
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </div> || <Skeleton count={2} />}
                </CardContent>
                <CardFooter className="flex flex-row-reverse">
                    <form action={formAction} onSubmit={(event) => console.log(event)
                    }>
                        <input type="hidden" name="data" value={JSON.stringify(selected.map(item => item.id))} />
                        <Button type="submit" className="hover:bg-accent font-bold">All set? Let's GOOO😆</Button>
                    </form>
                </CardFooter>
            </Card>}
    </div>);
}
const initialState: MessageObject = {
    message: '',
    ok: true
}