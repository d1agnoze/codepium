import Browse from "@/components/question/Browse";
import { DEFAULT_SITE } from "@/defaults/site";

export default async function Page() {
  const url_base = DEFAULT_SITE;
  return (
    <div className="w-full flex flex-col px-8 mt-5 gap-3">
      <div className="w-full mb-5">
        <h1 className="text-2xl font-bold">Question</h1>
        <p className="">Explore lastest questions and help other programmers</p>
      </div>
      {/* QUESTIONS */}
      <div>
        <Browse url_base={url_base} />
      </div>
    </div>
  );
}
