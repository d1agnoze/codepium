"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, BellDot, Check} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { notification } from "@/types/notification.type";
import {
  checkForNotiType,
  getNotificationsLastest as getData,
} from "@/app/profile/actions";
import { toast } from "react-toastify";
import { Skeleton } from "../ui/skeleton";
import moment from "moment";
import { createClientComponentClient as initClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";

type Props = { id: string };
type Curr_Notification = notification & { new?: boolean };

const Notification = (props: Props) => {
  const [read, setRead] = useState(true);
  const [data, setData] = useState<Curr_Notification[] | null>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sb = initClient();
    const channels = sb
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `receiver=eq.${props.id}`,
        },
        (payload) => {
          if (payload.errors) return;
          if (payload.new) {
            setRead(false);
            setData((prev) => {
              const newData = payload.new as Curr_Notification;
              if (prev === null) return [newData];
              if (prev.map((x) => x.id).includes(newData.id)) return prev;

              newData.new = true;
              prev.unshift(newData);
              prev.pop();

              return prev;
            });
          }
        },
      )
      .subscribe();

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      channels.unsubscribe();
    };
  }, [props.id]);

  useEffect(() => {
    setLoading(true);
    getData()
      .then((data: notification[]) => {
        if (data.length === 0) {
          setData(null);
        } else setData(data);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const MarkAsRead = () => {
    setRead(true);
    setData((prev) => {
      if (prev === null) return prev;
      return prev.map((x) => ({ ...x, new: false }));
    });
  };
  const navigateTo = async (id: string | null) => {
    try {
      if (id == null) throw new Error("Cant find notification destination");
      nProgress.start();
      const type = await checkForNotiType(id);
      if (type == null) throw new Error("Cant find notification destination");
      router.push(`/${type}/${id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      nProgress.done();
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="rounded-full">
          {read ? (
            <Bell size={30} />
          ) : (
            <BellDot size={30} color="hsl(var(--accent))" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-transparent border-none p-0" side="bottom">
        <Card className={cn("")}>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            {!read ?? (
              <CardDescription>You have unread messages.</CardDescription>
            )}
          </CardHeader>
          <CardContent className="gap-4">
            <div>
              {loading && <Loading />}
              {data == null ? (
                <div>No notification found</div>
              ) : (
                data.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => navigateTo(item.source_ref)}
                    className="mb-4 grid grid-cols-1 items-start px-2 py-1 transition-all rounded-md last:mb-0 last:pb-0 hover:bg-secondary"
                  >
                    <div className="flex gap-2 w-full text-sm font-medium leading-none">
                      {item.new === true && (
                        <span className="h-2 w-2 rounded-full bg-accent mt-2" />
                      )}

                      <div className="flex flex-col gap-2 truncate">
                        <p className="truncate">{item.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {moment(item.created_at).fromNow()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full"
              aria-disabled={read}
              disabled={read}
              onClick={() => MarkAsRead()}
            >
              <Check className="mr-2 h-4 w-4" /> Mark all as read
            </Button>
            <Button
              variant={"ghost"}
              className="w-full h-8"
              onClick={() => MarkAsRead()}
            >
              Go to notification center
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;

const Loading = () => {
  return Array.from({ length: 3 }).map((_, index) => (
    <Skeleton className="w-full h-12 bg-hslvar mb-3" key={index} />
  ));
};
