"use client";

import { useEffect, useRef, useState } from "react";
import Filter, { settings } from "../general/Filter";
import { Separator } from "../ui/separator";
import { question_seo } from "@/types/question.seo";
import { Pagination as Pag } from "@/types/pagination.interface";
import { PAGINATION_SETTINGS } from "@/defaults/browsing_paginatioin";
import { toast } from "react-toastify";
import nProgress from "nprogress";
import Question from "./QuestionSEODisplay";
import { FetchError } from "@/helpers/error/FetchError";
import { Skeleton } from "../ui/skeleton";
import Pagin from "@/components/general/CustomPagination";

const Browse = ({
  pre_sel_exp,
  url_base,
}: {
  url_base: string;
  pre_sel_exp?: Expertise;
}) => {
  const url = useRef<URL>(new URL("/api/question", url_base));
  const [currPage, setCurrPage] = useState<{ page: number }>({ page: 1 });
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Pag<question_seo>>({
    data: [],
    limit: PAGINATION_SETTINGS.limit,
    page: PAGINATION_SETTINGS.page,
    total: 1,
  });
  const [settings, setSettings] = useState<settings>({
    tag: [],
    search: "",
    date: undefined,
  });

  useEffect(() => {
    loading ? nProgress.start() : nProgress.done();
  }, [loading]);

  useEffect(() => {
    const abort = new AbortController();

    const search = url.current.searchParams;
    search.set("page", String(currPage.page));
    search.set("limit", String(PAGINATION_SETTINGS.limit));

    async function fetchUrl() {
      try {
        setLoading(true);
        const res = await fetch(url.current.toString(), {
          signal: abort.signal,
        });
        if (!res.ok) throw new FetchError(res.statusText);
        const data: Pag<question_seo> = await res.json();
        setData(data);
      } catch (err: any) {
        if (err instanceof FetchError) toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUrl();
    return () => abort.abort("abort fetch");
  }, [currPage]);

  useEffect(() => {
    const search = url.current.searchParams;
    clearParams(search);

    if (settings.search !== "") {
      search.set("search", settings.search);
    }

    if (settings.tag.length > 0) {
      search.set("tag", settings.tag.map((x) => x.id).join(","));
    }

    if (settings.date) {
      const def_from_date =
        settings.date.from?.toJSON() ?? new Date("1900-1-1").toJSON();
      const def_to_date = settings.date.to?.toJSON() ?? new Date().toJSON();

      search.set("from", def_from_date);
      search.set("to", def_to_date);
    }

    setCurrPage({ page: 1 });
  }, [settings]);

  const filterHandler = (a: settings) => {
    setSettings(a);
  };

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  return (
    <div className="w-full">
      <Filter values={filterHandler} pre_sel_exp={pre_sel_exp} />
      <Separator className="mt-5 mb-3" />
      <div className="flex flex-col gap-3">
        {!loading && data.data.length === 0 && <p>No data found</p>}
        {loading
          ? Array.from({ length: PAGINATION_SETTINGS.limit }, () => (
              <Skeleton className="px-3 py-4 bg-hslvar rounded-md w-full h-[150px]" />
            ))
          : data.data.map((item) => <Question key={item.id} question={item} />)}
      </div>
      <Separator className="mt-5 mb-3" />
      <Pagin
        defaultPage={1}
        count={data.total}
        page={currPage.page}
        onChange={(_, v) => {
          if (v !== currPage.page) setCurrPage({ page: v });
        }}
      />
    </div>
  );
};
export default Browse;

const clearParams = (search: URLSearchParams) => {
  search.delete("from");
  search.delete("to");
  search.delete("tag");
  search.delete("search");
};
