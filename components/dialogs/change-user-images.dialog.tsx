"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { get_user_seo } from "@/types/get_user_seo.dto";
import { sha256 } from "js-sha256";
import { Pencil, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { UploadImage } from "@/app/profile/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type ImageState = { url: string; file: File | null };

const Personalization = ({ user }: { user: get_user_seo }) => {
  const [open, setOpen] = useState<boolean>(false);
  const defaultObj = { url: user.background_image, file: null };
  const [img, setImg] = useState<ImageState>(defaultObj);
  const inputRef = useRef<HTMLInputElement>(null);
  const gravtarHash = sha256(user.email);
  const router = useRouter();
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  /* INFO: onChange function*/
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg({ url: reader.result as string, file });
      };
      reader.readAsDataURL(file);
    }
  };
  const navToGravatar = () => {
    window.open(`https://gravatar.com/${gravtarHash}`, "_blank");
  };

  /* INFO: submit function*/
  const onSubmit = async () => {
    try {
      setIsSubmiting(true);
      if (img.file) {
        const payload = new FormData();
        payload.append("image", img.file, img.file.name);
        await UploadImage(payload);
        router.refresh();
        setOpen(false);
      } else {
        throw new Error("Invalid file, please try again");
      }
    } catch (err: any) {
      toast.error(err.message);
      resetImage();
    } finally {
      setIsSubmiting(false);
    }
  };

  /* INFO: RESET function*/
  const resetImage = () => {
    if (inputRef.current) inputRef.current.value = "";
    setImg(defaultObj);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center gap-2 rounded-full bg-hslvar p-2 hover:bg-hslvar/80">
          <Pencil size={15} color="white" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Personalization</DialogTitle>
          <DialogDescription className="">
            <div>
              Your Avatar is based on your email associated with Gravatar. to
              change your avatar, please navigate to the Gravatar website
            </div>
            <Button size={"sm"} onClick={navToGravatar} className="mt-3">
              Open Gravatar
            </Button>
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col gap-2">
          <h2>Change background image</h2>
          <div>
            <img className="rounded-md" src={img.url} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">
              Picture{" "}
              <span className="text-muted-foreground">
                (allowed mime type: image/png, image/jpeg)
              </span>
              :
            </Label>
            <Input
              id="picture"
              type="file"
              onChange={onChange}
              ref={inputRef}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex gap-1"
              onClick={resetImage}
              disabled={isSubmiting}
            >
              <RefreshCcw size={15} />
              <span>Reset</span>
            </Button>
            <Button size={"sm"} onClick={onSubmit} disabled={isSubmiting}>
              Upload Image
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default Personalization;
