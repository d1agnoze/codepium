"use server";

import { getPosts } from "./actions";
import { columns } from "./columns";
import { PostDataTable } from "@/components/post/post_data_table";

export default async function Page() {
  try {
    const data = await getPosts();
    return (
      <div className="p-5">
        <h1 className="text-3xl font-bold mb-7">My Articles</h1>
        <PostDataTable
          data={data}
          columns={columns}
          filter_col={[{ key: "title", label: "Article's title" }]}
        />
      </div>
    );
  } catch (err: any) {
    throw err;
  }
}
