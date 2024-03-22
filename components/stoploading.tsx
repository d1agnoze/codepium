"use client";
import { hideLoading } from "@/utils/loading.service";
import { useEffect, useRef } from "react";

const StopLoading = () => {
  const stop = useRef(true);
  useEffect(() => hideLoading(), [stop]);
  return <></>;
};
export default StopLoading;
