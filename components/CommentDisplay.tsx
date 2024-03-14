import { comment } from "@/types/comment.type";
import { MessageCircleX } from "lucide-react";
import { useEffect, useState } from "react";

//TODO: comments display
export default function CommentsDisplay(
  { thread_ref, parent_ref, mode, handler, source_user_id }: {
    thread_ref: string;
    parent_ref: string;
    mode: "question" | "post" | "answer";
    handler: (data: { id: string; name: string }) => void;
    source_user_id: string;
  },
) {
  const [selected, setSelected] = useState<{ id: string; name: string }>({
    id: source_user_id,
    name: "",
  });
  const [cmts, setCmts] = useState<comment[]>([]);
  const [show, setShow] = useState<boolean>(false);

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
    fetch(
      `/api/general/comments?thread_ref=${thread_ref}&parent_ref=${parent_ref}&mode=${mode}&showall=${show}`,
      { cache: "force-cache" },
    ).then((res) => res.json()).then((data: comment[]) => setCmts(data));
  }, [show]);

  return (
    <div className="flex flex-col text-right items-end">
      <div className="divider w-full pb-0 mb-0 mt-1"></div>
      {cmts.map((cmt) => (
        <div
          key={cmt.id}
          className={`p-2 my-1 flex flex-nowrap justify-end items-center gap-2 text-xs `}
        >
          <span
            className="p-1 cursor-pointer bg-gray-700 rounded-md hover:scale-105 transition-all text-white"
            onClick={() =>
              selectReplyHandler({ id: cmt.user_id, name: cmt.user_name })}
          >
            {cmt.user_name}
          </span>
          <span>
            {cmt.content}
          </span>
          {selected.id === cmt.user_id &&
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
      <div className="divider w-full pb-0 mb-1 mt-1"></div>
      <div
        className="flex flex-nowrap justify-end items-center gap-2 text-xs cursor-pointer"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? "Hide" : "Show"} all comments
      </div>
    </div>
  );
}
