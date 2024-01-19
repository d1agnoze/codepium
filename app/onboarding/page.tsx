"use server"

import OnboardingForm from "@/components/auth/onboarding-form";
import { addMetadata, setExpertise } from "./actions";
import ExpertiseForm from "@/components/auth/expertise form";

export default async function Page() {
    return (
        <div className="mt-10 max-sm:px-2 md: px-10">
            <OnboardingForm callback={addMetadata}></OnboardingForm>
            <ExpertiseForm callback={setExpertise}/>
        </div>
    );
}