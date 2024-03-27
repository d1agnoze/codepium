"use client";

import { useEffect, useRef, useState } from "react";
import Filter, { settings } from "../general/Filter";
import { Separator } from "../ui/separator";
import { question_seo } from "@/types/question.seo";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Pagination as Pag } from "@/types/pagination.interface";
import { PAGINATION_SETTINGS } from "@/defaults/browsing_paginatioin";
import { toast } from "react-toastify";
import nProgress from "nprogress";
import Question from "./QuestionSEODisplay";
import { FetchError } from "@/helpers/error/FetchError";

const Browse = ({ url_base }: { url_base: string }) => {
  const url = useRef<URL>(new URL("/api/question", url_base));
  const [currPage, setCurrPage] = useState<{ page: number }>({ page: 1 });
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
    const abort = new AbortController();
    nProgress.start();
    if (currPage.page === -1) currPage.page = 1;

    url.current.searchParams.set("page", String(currPage.page));
    url.current.searchParams.set("limit", String(PAGINATION_SETTINGS.limit));

    fetch(url.current.toString(), { signal: abort.signal })
      .then((res) => {
        if (!res.ok) throw new FetchError(res.statusText);
        res.json().then((data: Pag<question_seo>) => {
          console.log(data);
          setData(data);
        });
      })
      .catch((err) => {
        if (err instanceof FetchError) toast.error(err.message);
      })
      .finally(() => nProgress.done());

    return () => abort.abort();
  }, [currPage]);

  useEffect(() => {
    if (settings.search === "" && settings.search == null) {
      url.current.searchParams.delete("search");
    } else url.current.searchParams.set("search", settings.search);

    if (settings.tag.length === 0 && settings.tag == null) {
      url.current.searchParams.delete("tag");
    } else url.current.searchParams.set("tag", settings.tag.join(","));

    if (settings.date) {
      const def_from_date = new Date("1900-1-1").toJSON();
      const def_to_date = new Date().toJSON();
      url.current.searchParams.set(
        "from",
        settings.date.from?.toJSON() ?? def_from_date,
      );
      url.current.searchParams.set(
        "to",
        settings.date.to?.toJSON() ?? def_to_date,
      );
    } else {
      url.current.searchParams.delete("from");
      url.current.searchParams.delete("to");
    }

    setCurrPage({ page: -1 });
  }, [settings]);

  const filterHandler = (a: settings) => {
    console.log(a);
    setSettings(a);
  };

  return (
    <div className="w-full">
      <Filter values={filterHandler} />
      <Separator className="mt-5 mb-3" />
      <div className="flex flex-col gap-3">
        {data.data.map((item) => <Question key={item.id} question={item} />)}
      </div>
      <Separator className="mt-5 mb-3" />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          {Array.from({ length: data.total }, (_, index) => index + 1).map((
            item,
          ) => (
            <PaginationItem
              key={item}
              onClick={() => setCurrPage({ page: item })}
            >
              <PaginationLink href="#" isActive={item === currPage.page}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
export default Browse;
