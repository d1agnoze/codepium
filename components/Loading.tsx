"use client"
import useLoading from "@/hooks/loading";

const LoadingProvider = () => {
    const { isVisible } = useLoading()
    return (<>
        {isVisible &&
            <div id="loading_overlay" className="w-screen h-screen absolute top-0 left-0 z-50 grid place-items-center">
                <div className="w-full h-full bg-slate-700 opacity-60 absolute"></div>
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        }
    </>);
}

export default LoadingProvider;
