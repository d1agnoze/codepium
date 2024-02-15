"use client"
import { hideLoading } from "@/utils/loading.service";
import { useEffect } from "react";

export default function PostForm() {
  useEffect(() => {
    hideLoading();
  }, []);
  return <div>Guud job</div>;
}
