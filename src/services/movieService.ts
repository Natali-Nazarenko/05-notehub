import axios from 'axios';
import type { Movie } from '../types/movie';

interface ApiResponse {
    results: Movie[];
    total_pages: number;
}

const myKey = import.meta.env.VITE_API_KEY;
const url = 'https://api.themoviedb.org/3/search/movie';

export async function fetchMovies(request: string, page: number): Promise<ApiResponse> {
    const options = {
        method: 'GET',
        params: {
            query: request,
            page,
        },
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${myKey}`,
        },
    };

    const { data } = await axios.get<ApiResponse>(url, options);
    return data;
}
