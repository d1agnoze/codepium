"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { editorDrawerService } from "@/services/drawer.service";

export default function DrawerHost() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [element, setElement] = useState<JSX.Element>(<div></div>);
  useEffect(() => {
    editorDrawerService.subscribe((val) => {
      setElement(val.content);
      setIsOpen(val.open);
    });
  }, []);
  return (
    <Drawer
      onOpenChange={(open) => setIsOpen(open)}
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              {element}
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
  );
}
