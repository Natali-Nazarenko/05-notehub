import axios from 'axios';
import type { Note } from '../types/note';

interface ApiResponse {
    notes: Note[];
    totalPages: number;
}

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
const url = 'https://notehub-public.goit.study/api/notes';

export async function fetchNotes(page: number): Promise<ApiResponse> {
    const options = {
        method: 'GET',
        params: {
            page,
            perPage: 12,
        },
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${myKey}`,
        },
    };

    const { data } = await axios.get<ApiResponse>(url, options);
    return data;
}

export async function createNote() {}

export async function deleteNote() {}
