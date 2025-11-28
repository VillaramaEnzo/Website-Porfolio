import { useState, useEffect, useCallback } from "react";
import { fetchData, apiRoutes } from "@/lib/dataClient";

type UseFetchDataOptions = RequestInit & { refetchOnMount?: boolean };

export function useFetchData(
    type: keyof typeof apiRoutes, 
    id?: string,
    options?: UseFetchDataOptions
) {
    
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchDataWrapper = useCallback(async () => {

        setLoading(true);
        setError(null);

        try {

            const responseData = await fetchData(type, id, options);
            setData(responseData);

        } catch (fetchError) {

            setError(fetchError as Error);

        } finally {

            setLoading(false);
        }
    }, [type, id, options]);

    useEffect(() => {

        if (options?.refetchOnMount) {
            fetchDataWrapper();
        }
    }, [fetchDataWrapper]);

    return { data, error, loading, refetch: fetchDataWrapper };
}