"use server"

import StopLoading from "@/components/stoploading";
import OnboardingGroup from "@/components/auth/onboarding-group";


export default async function Page() {
    return (
        <div className="mt-10 max-sm:px-2 md: px-10">
            <StopLoading/>
            <OnboardingGroup />
        </div>
    );
}
