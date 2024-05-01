import moment from "moment";
import Link from "next/link";
import { Post } from "@/types/post.type";
import { copyToClipboard } from "@/utils/data-table.utils";

const MyPost = ({ post }: { post: Post }) => {
  return (
    <div className="px-3 py-4 bg-hslvar rounded-md">
      <div className="flex max-sm:flex-col-reverse">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col px-10 gap-2">
            <span className="text-muted-foreground">
              {moment(new Date(post.created_at)).toDate().toDateString()} -{" "}
              <span className="text-accent">{post.likes} Like(s)</span>
            </span>

            <Link
              className="text-xl font-semibold truncate"
              href={`/post/${post.id}`}
            >
              <span className="text-error">
                {post.isDeleted && "DELETED: "}
              </span>
              <span>{post.title}</span>
            </Link>
            <div className="flex gap-3">
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => copyToClipboard(post.id, "Copied")}
              >
                Copy id
              </button>
              <Link className="btn btn-xs btn-ghost" href={`/post/${post.id}`}>
                Navigate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyPost;
