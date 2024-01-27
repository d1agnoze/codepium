"use client"
import { useEffect, useState } from "react";
import ExpertiseForm from "./expertise form";
import OnboardingForm from "./onboarding-form";
import useFetchCurrent from "@/hooks/fetch";
import useLoading from "@/hooks/loading";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Step } from "@/enums/registration-step";

function OnboardingGroup() {
    const { set_loading } = useLoading()
    const router = useRouter()
    const { data, error, loading } = useFetchCurrent('auth/checkStep')
    useEffect(() => {
        if (error) toast.warn(error)
        if (data != null) {
            set_loading(loading)
            if (data.step === 2) {
                toast.info(data.message)
                router.replace("/")
            }
        }
    }, [data, error, loading])
    return (<>
        {data.step === Step.uninitialized && <OnboardingForm />}
        {data.step === Step.registerd && <ExpertiseForm />}
    </>);
}

export default OnboardingGroup;
