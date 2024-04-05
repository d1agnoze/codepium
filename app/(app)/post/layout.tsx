"use server";
import SimpleAlert from "@/components/general/SimpleAlert";
import { DEF_SB_EXP_NO } from "@/defaults/sidebar";
import { Badge } from "@/components/ui/badge";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { PostSidebar } from "@/types/post.sidebar";
import { post_seo } from "@/types/post.seo";

async function Layout({ children }: { children: React.ReactNode }) {
  let f_err = null;
  let f_data: PostSidebar = { question: [], expertises: [] };
  try {
    f_data = await getData();
  } catch (err: any) {
    f_err = err;
  }

  return (
    <>
      <div className="drawer lg:drawer-open drawer-end">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {f_err && <SimpleAlert text={f_err} variant="error" />}
          {children}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-56 min-h-full bg-hslvar text-base-content">
            {/* Sidebar content here */}
            <h1 className="text-primary text-md font-bold flex gap-2">
              Lastest Articles
            </h1>
            <ul className="flex flex-col gap-1">
              {f_data.question.map((q: post_seo) => (
                <li key={q.id} className="w-full">
                  <Link href={`/post/${q.id}`}>
                    <div
                      className={
                        "flex flex-col gap-1 justify-start items-start text-start"
                      }
                    >
                      <span className="text-md font-semibold flex gap-2 text-accent">
                        {q.title.length > 20
                          ? q.title.slice(0, 20) + "..."
                          : q.title}
                      </span>
                      <div className="flex gap-1 flex-wrap items-center">
                        <span className="text-xs italic text-secondary-foreground">
                          by @{q.user_name}
                        </span>
                        <span className="text-pink-500 font-bold py-0.5 px-2 bg-accent rounded-md border-blue-900">
                          {q.likes}💗
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="divider"></div>
            <h1 className="text-primary text-md font-bold mb-2">
              Explore newest expertise
            </h1>
            <ul>
              {f_data.expertises.map((q: Expertise) => (
                <li key={q.id} className="w-full">
                  <div className="text-primary text-md py-1">
                    <Badge variant={"outline"} className="rounded-md truncate">
                      <a href={`/post?filter=${q.id}`}>{q.display_name}</a>
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
            <li>
              <Link
                href={"/post/recommend"}
                className="text-secondary-foreground"
              >
                Browse recommended articles
              </Link>
            </li>
            <li>
              <Link href={"/post"} className="text-secondary-foreground">
                Browse all articles...
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

const getData = async () => {
  "use server";
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const res: PostSidebar = { question: [], expertises: [] };
  const { data: expertise, error: exp_err } = await supabase
    .from("Expertise")
    .select()
    .order("created_at", { ascending: false })
    .limit(DEF_SB_EXP_NO)
    .returns<Expertise[]>();

  const { data: question, error: ques_err } = await supabase
    .from("get_post_seo")
    .select()
    .order("created_at", { ascending: false })
    .limit(DEF_SB_EXP_NO)
    .returns<post_seo[]>();

  if (exp_err || ques_err) throw new Error("Error fetching expertise tags");

  res.expertises = expertise;
  res.question = question;

  return res;
};

export default Layout;
