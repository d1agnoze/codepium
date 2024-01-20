"use server"

import { addMetadata, setExpertise } from "./actions";
import OnboardingGroup from "@/components/auth/onboarding-group";

export default async function Page() {
    return (
        <div className="mt-10 max-sm:px-2 md: px-10">
            <OnboardingGroup callbackForExpertise={setExpertise} callbackForSubmit={addMetadata} />
        </div>
    );
}