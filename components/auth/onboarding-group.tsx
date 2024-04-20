"use client";
import { useEffect } from "react";
import ExpertiseForm from "./expertise form";
import OnboardingForm from "./onboarding-form";
import useFetchCurrent from "@/hooks/fetch";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Step } from "@/enums/registration-step";
import { hideLoading, showLoading } from "@/utils/loading.service";

function OnboardingGroup() {
  const router = useRouter();
  const { data, error, loading } = useFetchCurrent("auth/checkStep");
  useEffect(() => {
    if (error || !data) {
      toast.warn(error);
      return;
    }
    if (data.step === 2) {
      toast.info(data.message);
      router.replace("/");
    }
  }, [data, error]);

  useEffect(() => {
    loading ? showLoading() : hideLoading();
  }, [loading]);
  return (
    <>
      {data && data.step === Step.uninitialized && <OnboardingForm />}
      {data && data.step === Step.registerd && <ExpertiseForm />}
    </>
  );
}

export default OnboardingGroup;
