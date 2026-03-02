export interface ApiRoutes { 
    [key: string]: {

        listEndpoint: string;
        itemEndpoint: (id: string) => string;

    };
}

// App endpoints
// Can be used to fetch data from external APIs
// Add more endpoints as needed
// To use external APIs, add them to the apiRoutes object
// Use the listEndpoint to fetch a list of items
// Use the itemEndpoint to fetch a single item

export const apiRoutes: ApiRoutes = {
    projects: {
        listEndpoint: 'https://api.example.com/projects',
        itemEndpoint: (id: string) => `https://api.example.com/projects/${id}`
    },

    pokemons: {
        listEndpoint: 'https://pokeapi.co/api/v2/pokemon',
        itemEndpoint: (id: string) => `https://pokeapi.co/api/v2/pokemon/${id}`
    }

    // Add more endpoints as needed
}

// Reusable fetch function
export async function fetchData(

    type: keyof typeof apiRoutes,
    id?: string,
    options?: RequestInit // Accepts all request options that can be used in fetch

) { 

    let endpoint;

    if (id) {

        // For item endpoints, the id is required
        
        endpoint = apiRoutes[type]?.itemEndpoint(id);
        if (!endpoint) {
            throw new Error(`No item endpoint found for type: ${type}`);
        }
    } else {

        // For list endpoints, the id is not required
        endpoint = apiRoutes[type]?.listEndpoint;
        if (!endpoint) {
            throw new Error(`No list endpoint found for type: ${type}`);
        }
    }

    const response = await fetch(endpoint, {

        method: options?.method || 'GET',
        headers: { 

            'Content-Type': 'application/json',
            ...options?.headers,
        },

        body: options?.body,
        ...options,

    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    } 

    const data = await response.json();
    return data;
}