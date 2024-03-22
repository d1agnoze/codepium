import { PAGINATION_SETTINGS } from "@/defaults/comment_pagination";
import { comment } from "@/types/comment.type";
import { Pagination as Pag } from "@/types/pagination.interface";
import { animated, useTransition } from "@react-spring/web";
import { MessageCircleX } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { paginationCalulator as paginationCalculate } from "@/utils/pagination.utils";
import { toast } from "react-toastify";

export interface SelectedHandler {
  data: {
    comment_user_id: string;
    comment_user_name: string;
  };
  comment_id: string;
  isDefault: boolean;
}

export default function CommentsDisplay(
  { thread_ref, parent_ref, mode, handler, source_user_id, user_id, new_cmt }: {
    thread_ref: string;
    parent_ref: string;
    mode: "question" | "post" | "answer";
    handler: (comment: SelectedHandler) => void;
    source_user_id: string;
    user_id: string;
    new_cmt: comment[];
  },
) {
  const [selected, setSelected] = useState<SelectedHandler>({
    data: {
      comment_user_name: "",
      comment_user_id: "",
    },
    comment_id: "",
    isDefault: true,
  });
  const [cmts, setCmts] = useState<comment[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [displayComment, setDisplayComment] = useState<Pag<comment>>({
    data: [],
    total: PAGINATION_SETTINGS.total,
    page: PAGINATION_SETTINGS.page,
    limit: PAGINATION_SETTINGS.limit,
  });
  const [curr_page, setCurr_page] = useState<number>(displayComment.page);
  const pagination_list: number[] = paginationCalculate(
    curr_page,
    displayComment.total,
  );

  const url =
    `/api/general/comments?thread_ref=${thread_ref}&parent_ref=${parent_ref}&mode=${mode}&page=${curr_page}&limit=${6}`;

  const selectReplyHandler = (cmt: comment) => {
    const isDefault = cmt.id === selected.comment_id || cmt.user_id === user_id;
    setSelected((_) => {
      return isDefault
        ? {
          data: {
            comment_user_name: "",
            comment_user_id: "",
          },
          comment_id: "",
          isDefault: true,
        }
        : {
          data: {
            comment_user_name: cmt.user_name,
            comment_user_id: cmt.user_id,
          },
          comment_id: cmt.id,
          isDefault: false,
        };
    });
  };

  useLayoutEffect(() => () => sessionStorage.clear(), []);

  useEffect(() => handler(selected), [selected]);

  useEffect(() => {
    if (!show) {
      setCmts(
        displayComment.data.slice(0, 2),
      );
    } else setCmts(displayComment.data);
  }, [show, displayComment]);

  useEffect(() => {
    const abort = new AbortController();
    if (sessionStorage.getItem(`${thread_ref}_COMMENT_${curr_page}`)) {
      const data: Pag<comment> = JSON.parse(
        sessionStorage.getItem(`${thread_ref}_COMMENT_${curr_page}`) as string,
      );
      setDisplayComment((prev) => {
        return { ...prev, data: data.data };
      });
      return;
    }
    //Action when switching pages
    setIsLoading(true);
    fetch(url, { signal: abort.signal }).then((res) => res.json()).then(
      (data: Pag<comment>) => {
        if ((data as any).message != undefined) {
          toast.error("We have a server issue");
          return;
        }
        if (!(displayComment.data.length === 0)) {
          sessionStorage.setItem(
            `${thread_ref}_COMMENT_${data.page}`,
            JSON.stringify(data),
          );
        }
        setDisplayComment({
          ...data,
          data: data.data.filter((cmt) =>
            !(new_cmt.map((c) => c.id).includes(cmt.id))
          ),
        });
      },
    ).finally(() => setIsLoading(false));

    return () => abort.abort();
  }, [curr_page]);

  const transitionAnimation = useTransition(new_cmt, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 200 },
  });
  const isPost = mode === "post";
  return (
    <div
      className={`flex flex-col text-right ${
        !isPost ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`divider w-full pb-0 mb-0 mt-1" + ${
          displayComment.total > 0 ? "" : "hidden"
        }`}
      >
      </div>
      {new_cmt.length > 0 &&
        transitionAnimation((style, item) => (
          <animated.div style={style}>
            <div
              className={`flex gap-1 border mb-1 ${
                !isPost ? "text-xs" : "text-md"
              }`}
              key={item.id}
            >
              <span className="px-2 bg-accent text-primary rounded-md">
                NEW
              </span>{" "}
              <span className="font-bold">You:</span>
              {item.reply_to !== source_user_id &&
                (
                  <span className="px-0 font-bold">
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
          className={`p-0 my-1 flex flex-nowrap justify-end items-center gap-2 ${
            !isPost ? "text-xs" : "text-sm"
          }`}
        >
          <span
            className="p-1 cursor-pointer bg-gray-700 rounded-md hover:scale-105 transition-all text-white"
            onClick={() => selectReplyHandler(cmt)}
          >
            {cmt.user_name}
          </span>
          {cmt.mode === "comment" &&
            (
              <span className="px-0 font-bold underline">
                {`@${cmt.receiver_name}`}
              </span>
            )}
          <span>
            {cmt.content}
          </span>
          {selected.comment_id === cmt.id &&
            selected.data.comment_user_id !== user_id &&
            (
              <div onClick={() => selectReplyHandler(cmt)}>
                <MessageCircleX size={16} color="hsl(var(--accent))" />
              </div>
            )}
        </div>
      ))}
      {show && displayComment.total > 0 &&
        (
          <div className="w-full flex float-right mt-3">
            <Pagination className="justify-end md:scale-90 md:translate-x-10">
              <PaginationContent>
                {pagination_list.at(0) !== 1 &&
                  (
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        size={"sm"}
                        onClick={() => setCurr_page(curr_page - 1)}
                      />
                    </PaginationItem>
                  )}
                {pagination_list
                  .map((i) => (
                    <PaginationItem key={Math.random()}>
                      <PaginationLink
                        href="#"
                        size={"sm"}
                        onClick={() => setCurr_page(i)}
                        isActive={i === curr_page}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                {pagination_list.at(pagination_list.length - 1) !==
                    displayComment.total &&
                  (
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        size={"sm"}
                        onClick={() => setCurr_page(curr_page + 1)}
                      />
                    </PaginationItem>
                  )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      <div
        className={`divider w-full mb-1 mt-0" + ${
          displayComment.total > 0 ? "" : "hidden"
        }`}
      >
      </div>
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
            <span
              onClick={() => setShow((prev) => !prev)}
              className={displayComment.total > 0 ? "" : "hidden"}
            >
              {show ? "Hide most" : "Show all"} comments
            </span>
          )}
      </div>
    </div>
  );
}
