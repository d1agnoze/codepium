"use client"
import { useEffect, useState } from "react";

const useFetchCurrent = (url: string) => {
    const urlBase = `http://localhost:3000/api/${url}`
    const [data, setData] = useState<unknown>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(urlBase);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setData(result);
            } catch (error: any) {
                setError(error?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
}

export default useFetchCurrent;