export interface Note {
    id: string;
    title: string;
    content: string;
    tag: string;
}

export interface CreateNote {
    title: string;
    content: string;
    tag: string;
}
