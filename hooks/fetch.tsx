"use client";
import { useEffect, useState } from "react";

/**
 * NOTE: useFetchCurrent
 * custom hook for fetching data
 *
 * @param url
 * @returns {data, loading, error}
 * */
const useFetchCurrent = <T = any,>(
  url: string,
): { data: T | undefined; loading: boolean; error: any | null } => {
  const urlBase = `/api/${url}`;
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlBase);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (error: any) {
        console.log(error);
        setError(error?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetchCurrent;
