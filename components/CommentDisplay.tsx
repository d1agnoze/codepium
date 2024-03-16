import { PAGINATION_SETTINGS } from "@/defaults/comment_pagination";
import { comment } from "@/types/comment.type";
import { Pagination as Pag } from "@/types/pagination.interface";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { MessageCircleX } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

//TODO: comments display
export default function CommentsDisplay(
  { thread_ref, parent_ref, mode, handler, source_user_id, user_id, new_cmt }: {
    thread_ref: string;
    parent_ref: string;
    mode: "question" | "post" | "answer";
    handler: (data: { id: string; name: string }) => void;
    source_user_id: string;
    user_id: string;
    new_cmt: comment[];
  },
) {
  const [selected, setSelected] = useState<{ id: string; name: string }>({
    id: source_user_id,
    name: "",
  });
  const [cmts, setCmts] = useState<comment[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const url =
    `/api/general/comments?thread_ref=${thread_ref}&parent_ref=${parent_ref}&mode=${mode}&page=${1}&limit=${6}`;

  const [displayComment, setDisplayComment] = useState<Pag<comment>>({
    data: [],
    total: PAGINATION_SETTINGS.total,
    page: PAGINATION_SETTINGS.page,
    limit: PAGINATION_SETTINGS.limit,
  });

  const selectReplyHandler = (data: { id: string; name: string }) => {
    setSelected((prev) => {
      return {
        id: prev.id === data.id ? source_user_id : data.id,
        name: prev.id === data.id ? "" : data.name,
      };
    });
  };

  useEffect(() => {
    handler(selected);
  }, [selected]);

  useEffect(() => {
    if (show) setCmts(displayComment.data.toSpliced(0, 3));
    else setCmts(displayComment.data);
  }, [show]);

  useEffect(() => {
    setIsLoading(true);
    fetch(url).then((res) => res.json()).then((data: Pag<comment>) => {
    }).finally(() => setIsLoading(false));
  }, []);

  const transitionAnimation = useTransition(new_cmt, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 200 },
  });

  return (
    <div className="flex flex-col text-right items-end">
      <div className="divider w-full pb-0 mb-0 mt-1"></div>
      {new_cmt.length > 0 &&
        transitionAnimation((style, item) => (
          <animated.div style={style}>
            <div className="flex gap-1 border mb-1 text-xs" key={item.id}>
              <span className="px-2 bg-accent text-primary rounded-md">
                NEW
              </span>{" "}
              <span className="font-bold">You:</span>
              {item.reply_to !== source_user_id &&
                (
                  <span className="px-0 text-white font-bold">
                    {`@${item.receiver_name}`}
                  </span>
                )}
              <p>{item.content}</p>
            </div>
          </animated.div>
        ))}
      {cmts.map((
        cmt,
      ) => (
        <div
          key={cmt.id}
          className={`p-0 my-1 flex flex-nowrap justify-end items-center gap-2 text-xs `}
        >
          <span
            className="p-1 cursor-pointer bg-gray-700 rounded-md hover:scale-105 transition-all text-white"
            onClick={() =>
              selectReplyHandler({ id: cmt.user_id, name: cmt.user_name })}
          >
            {cmt.user_name}
          </span>
          {cmt.reply_to !== source_user_id &&
            (
              <span className="px-0 text-white font-bold underline">
                {`@${cmt.receiver_name}`}
              </span>
            )}
          <span>
            {cmt.content}
          </span>
          {selected.id === cmt.user_id && selected.id !== user_id &&
            (
              <div
                onClick={() =>
                  selectReplyHandler({ id: cmt.user_id, name: cmt.user_name })}
              >
                <MessageCircleX size={16} color="hsl(var(--accent))" />
              </div>
            )}
        </div>
      ))}
      {show &&
        (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" size={"sm"} />
              </PaginationItem>
              {[1, 2, 3].map((i) => (
                <PaginationItem>
                  <PaginationLink href="#" size={"sm"}>{i}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" size={"sm"} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      <div className="divider w-full pb-0 mb-1 mt-1"></div>
      <div
        className={`flex flex-nowrap justify-end items-center gap-2 text-xs ${
          isLoading ? "cursor-wait text-gray-400" : "cursor-pointer"
        }`}
      >
        {isLoading
          ? (
            <>
              <span className="loading loading-dots loading-xs"></span>
              <span>loading</span>
            </>
          )
          : (
            <span onClick={() => setShow((prev) => !prev)}>
              {show ? "Hide" : "Show"} all comments
            </span>
          )}
      </div>
    </div>
  );
}
// setCmts(
//   displayComment.less.filter((cmt) =>
//     !(new_cmt.map((c) => c.id).includes(cmt.id))
//   ),
