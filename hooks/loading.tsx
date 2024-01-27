"use client";
import {
  hideLoading,
  loadingService,
  showLoading,
} from "@/utils/loading.service";

const useLoading = () => {
  const toggle_loading = () => {
    loadingService.getValue() ? hideLoading() : showLoading();
  };
  const set_loading = (value: boolean) => {
    value ? showLoading() : hideLoading();
  };
  return {
    toggleVisibility: toggle_loading,
    set_loading,
  };
};
export default useLoading;
