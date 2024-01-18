"use client"
import { useState } from "react";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, DrawerFooter } from "./ui/drawer";
import { ModeToggle } from "./ui/theme-toggle";

export default function DrawerHost() {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
    return (<div className="">
        <Button onClick={() => setIsDrawerOpen((prev) => !prev)}>toggle</Button>
        <Drawer open={isDrawerOpen}>
            {/* <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
              </DrawerTrigger> */}
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
                            <Button variant="outline" onClick={() => setIsDrawerOpen((prev) => !prev)}>Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    </div>)


}