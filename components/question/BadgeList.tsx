"use server";

import Link from "next/link";
import { Badge } from "../ui/badge";

export default async function BadgeList({ tags }: { tags: Expertise[] }) {
  const title = tags.map((tag) => tag.display_name).join(", ");
  return (
    <section className="w-full flex gap-1 flex-wrap" title={title}>
      {tags.map((tag) => (
        <Badge
          className="bg-accent text-primary-foreground cursor-pointer"
          variant={"small"}
          key={tag.id}
        >
          <Link href={`/question?filter=${tag.id}`}>{tag.display_name}</Link>
        </Badge>
      ))}
    </section>
  );
}
