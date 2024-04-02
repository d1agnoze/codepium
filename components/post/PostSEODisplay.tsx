import moment from "moment";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { post_seo } from "@/types/post.seo";
import Profile from "../general/Avatar";

const Post = ({ post }: { post: post_seo }) => {
  return (
    <div className="px-3 py-4 bg-hslvar rounded-md">
      <div className="flex max-sm:flex-col-reverse">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Profile
              email={post.email}
              id={post.user_id}
              size="8"
              display_name={post.display_name}
              background_img={post.background_image}
              username={post.user_name}
            />
            <div className="flex flex-col gap-1 text-xs">
              <span>{post.user_name}</span>
              <span>
                🕐{" "}
                <span className="text-muted-foreground">
                  {moment(new Date(post.created_at)).toDate().toDateString()}
                </span>
              </span>
            </div>
          </div>
          <div className="flex flex-col px-10 gap-2">
            <Link className="text-2xl font-semibold" href={`/post/${post.id}`}>
              {post.title}
            </Link>
            <div className="flex gap-1">
              {post.tags.map((tag) => (
                <Badge variant="outline" key={tag.id} className="font-thin">
                  #{tag.name}
                </Badge>
              ))}
            </div>
            <div className="h-auto flex gap-3 text-sm text-accent">
              <span>{post.likes} Likes 💗</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
