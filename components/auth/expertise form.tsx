"use client"
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import useFetchCurrent from "@/hooks/fetch";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/navigation";
export default function ExpertiseForm({ callback }: { callback: (formData: FormData) => Promise<void> }) {
    const { data, error, loading } = useFetchCurrent('general/expertises')
    const [selected, setSelected] = useState<string[]>([])
    const [columns, setColumns] = useState<string[]>([])
    const router = useRouter()
    const itemsPerColumn = 10
    useEffect(() => {
        if (data) {
            {/*@ts-ignore*/ }
            setColumns(Array.from({ length: Math.ceil(data.length / itemsPerColumn) }, (_, index) => data.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn)))
        }
        if (error)
            router.replace('/error')
    }, [data, error])

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
                            {selected.map((item) => (<li key={item} className="inline ml-2">
                                <Badge className="bg-accent" onClick={() => setSelected(selected.filter(expertis => expertis != item))}>{item}</Badge>
                            </li>))}
                        </ul>
                        <div className="flex flex-wrap gap-6">
                            {columns.map((column, columnIndex) => (
                                <ul key={columnIndex} className="column">
                                    {/**@ts-ignore */}
                                    {column.map((item, index) => (
                                        <li key={index}>
                                            <Badge className={cn("cursor-pointer text-sm", selected.includes(item) && "hidden")} onClick={() => {
                                                if (!selected.includes(item)) {
                                                    setSelected([...selected, item])
                                                }
                                            }}>{item}</Badge>
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </div> || <Skeleton count={2} />}
                </CardContent>
                <CardFooter className="flex flex-row-reverse">
                    <form action={callback} onSubmit={(event) => console.log(event)
                    }>
                        <input type="hidden" name="data" value={JSON.stringify(selected)} />
                        <Button type="submit" className="hover:bg-accent font-bold">All set? Let's GOOO😆</Button>
                    </form>
                </CardFooter>
            </Card>}

    </div>);
}