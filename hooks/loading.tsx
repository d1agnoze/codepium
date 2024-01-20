"use client"
import { useState } from "react";

const useLoading = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggle_loading = () => {
        setIsVisible((prevVisible) => !prevVisible);
    };
    const set_loading = (value: boolean) => {
        setIsVisible(value);
    }
    return {
        isVisible,
        toggleVisibility: toggle_loading,
        set_loading
    };
};
export default useLoading;