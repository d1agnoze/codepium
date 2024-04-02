import { useState, useEffect } from "react";

export const useFetch = <T = any>(url: string, abort?: AbortController) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url, { signal: abort?.signal });
        if (!response.ok) throw new Error(response.statusText);
        const json: T = await response.json();
        setIsLoading(false);
        setData(json);
        setError(null);
      } catch (error: any) {
        setError(`${error.message}`);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { data, isLoading, error };
};
