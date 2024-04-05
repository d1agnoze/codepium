"use client";
import { hideLoading } from "@/utils/loading.service";
import nProgress from "nprogress";
import { useEffect, useRef } from "react";

const StopLoading = () => {
  const stop = useRef(true);
  useEffect(() => {
    hideLoading();
    nProgress.done();
  }, [stop]);
  return <></>;
};
export default StopLoading;
