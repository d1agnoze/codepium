"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { DEFAULT_500_ICON } from "@/defaults/profile";
import { hideLoading } from "@/utils/loading.service";
import { useEffect } from "react";

export default function Error(
  { error, reset }: { error: Error & { digest?: string }; reset: () => void },
) {
  useEffect(() => hideLoading(), []);
  useEffect(() => console.error(error), [error]);

  return (
    <div className="mt-3 lg:mt-7 mx-auto">
      <div className="hero min-h-screen items-start justify-start">
        <div className="hero-content flex-col lg:flex-row">
          <img
            src={DEFAULT_500_ICON}
            className="max-w-sm rounded-lg"
          />
          <div>
            <div>
              <h1 className="text-3xl font-bold">Oops! We got an error!</h1>
              <p className="py-3 italic">{error.message}</p>
            </div>
            <Button onClick={() => reset()}>Try again</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
