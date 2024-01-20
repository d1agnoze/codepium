"use client"
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, DrawerFooter, DrawerTrigger } from "./ui/drawer";
import { Terminal } from "lucide-react";

export default function DrawerHost() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    useEffect(() => {
        const keyPressed = (event: any) => {
            if (event.key === "/") {
                setIsOpen((prev) => !prev)
            }
        }
        window.addEventListener("keydown", keyPressed)
        return function cleanup() {
            window.removeEventListener('keydown', keyPressed);
        }
    }, [])
    return (
        <Drawer onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
            <DrawerTrigger asChild>
                <Button id="term_btn" className="rounded-full bg-accent text-primary hover:text-primary-foreground">
                    <Terminal />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Move Goal</DrawerTitle>
                        <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="flex items-center justify-center space-x-2">
                            {"Sometihng"}
                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )


}