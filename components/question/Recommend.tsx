"use client";

import { question_seo } from "@/types/question.seo";

import Pagin from "@/components/general/CustomPagination";
import { Pagination as Pag } from "@/types/pagination.interface";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Question from "./QuestionSEODisplay";
import { PAGINATION_SETTINGS } from "@/defaults/browsing_paginatioin";
import { FetchError } from "@/helpers/error/FetchError";
import { toast } from "react-toastify";
import nprogress from "nprogress";

const Recommended = ({ url_base }: { url_base: string }) => {
  const [data, setData] = useState<Pag<question_seo>>({
    data: [],
    limit: PAGINATION_SETTINGS.limit,
    page: PAGINATION_SETTINGS.page,
    total: 1,
  });

  const [currPage, setCurrPage] = useState<number>(1);
  const url = useRef<URL>(new URL("/api/question/recommend", url_base));

  useEffect(() => {
    const abort = new AbortController();
    async function fetchUrl() {
      try {
        nprogress.start();
        const search = url.current.searchParams;
        search.set("page", String(currPage));
        search.set("limit", String(PAGINATION_SETTINGS.limit));

        const res = await fetch(url.current.toString(), {
          signal: abort.signal,
        });
        if (!res.ok) throw new FetchError(res.statusText);
        const data: Pag<question_seo> = await res.json();
        setData(data);
      } catch (err: any) {
        /* NOTE: ignore abort request error */
        if (err instanceof FetchError) toast.error(err.message);
      } finally {
        nprogress.done();
      }
    }

    fetchUrl();
    return () => abort.abort();
  }, [currPage]);

  return (
    <div>
      <div className="w-full">
        <div className="flex flex-col gap-3">
          {data.data.length === 0 && <p>No data found</p>}
          {/* {
            Array.from({ length: PAGINATION_SETTINGS.limit }, () => (
            <Skeleton className="px-3 py-4 bg-hslvar rounded-md w-full h-[150px]" />
          ))} */}
          {data.data.map((item) => (
            <Question key={item.id} question={item} />
          ))}
        </div>
        <Separator className="mt-5 mb-3" />
        <Pagin
          defaultPage={1}
          count={data.total}
          page={currPage}
          onChange={(_, v) => {
            if (v !== currPage) setCurrPage(v);
          }}
        />
      </div>
    </div>
  );
};
export default Recommended;
