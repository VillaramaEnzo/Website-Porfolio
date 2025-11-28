import { fetchData, apiRoutes } from "@/lib/dataClient";
import { catchError } from "@/utils/catchErrorHelpers";

export async function getDynamicPaths(type: keyof typeof apiRoutes) { 
    // Original implementation
    // try {
    //     const data = await fetchData(type);
    //     const paths = data.map((item: { id: string }) => ({
    //         params: { id: item.id.toString() },
    //     }));
    //
    //     return { paths, fallback: false };
    // } catch (error) {
    //     console.log("Failed to generate paths:", error);
    //     return { paths: [], fallback: false };
    // }

    // New implementation using catchError
    const [error, data] = await catchError(fetchData(type));
    
    if (error) {
        console.log("Failed to generate paths:", error);
        return { paths: [], fallback: false };
    }

    const paths = data.map((item: { id: string }) => ({
        params: { id: item.id.toString() },
    }));

    return { paths, fallback: false };
}

export async function getDynamicProps(type: keyof typeof apiRoutes, id: string) {
    // Original implementation
    // try {
    //     const data = await fetchData(type, id);
    //     return { props: { data } };
    // } catch (error) {
    //     console.log("Failed to fetch data:", error);
    //     return { props: { data: null, error: "Failed to fetch data" } };
    // }

    // New implementation using catchError
    const [error, data] = await catchError(fetchData(type, id));
    
    if (error) {
        console.log("Failed to fetch data:", error);
        return { props: { data: null, error: "Failed to fetch data" } };
    }

    return { props: { data } };
}