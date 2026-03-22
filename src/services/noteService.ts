import axios from 'axios';
import type { CreateNote, Note } from '../types/note';

interface ApiResponse {
    notes: Note[];
    totalPages: number;
}

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] = `Bearer ${myKey}`;
axios.defaults.headers.common['accept'] = 'application/json';

export async function fetchNotes(page: number, search: string): Promise<ApiResponse> {
    const options = {
        method: 'GET',
        params: {
            page,
            perPage: 12,
            search,
        },
    };

    const { data } = await axios.get<ApiResponse>('/notes', options);
    return data;
}

export async function createNote(payload: CreateNote): Promise<Note> {
    const { data } = await axios.post<Note>('/notes', payload);
    return data;
}

export async function deleteNote(noteId: Note['id']): Promise<void> {
    await axios.delete(`/notes/${noteId}`);
}
