"use client";
import { loadingService } from "@/utils/loading.service";
import { useEffect, useState } from "react";
import React from "react";

const LoadingProvider = () => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const sub = loadingService.subscribe((value) => { setIsLoading(value); });
    return () => sub.unsubscribe();
  }, []);
  return (
    <>
      {isLoading &&
        (
          <div
            id="loading_overlay"
            className="w-full h-full absolute top-0 left-0 z-50 flex justify-center items-center"
          >
            <div className="w-full h-full hero-overlay absolute">
            </div>
            <span className=" mt-10 loading text-white loading-spinner loading-lg">
            </span>
          </div>
        )}
    </>
  );
};

export default LoadingProvider;
