import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import NoteList from '../NoteList/NoteList';
import css from './App.module.css';
import { fetchNotes } from '../../services/noteService';
import Pagination from '../Pagination/Pagination';

function App() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['notes', page],
        queryFn: () => fetchNotes(page),
        placeholderData: keepPreviousData,
    });

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                {/* Компонент SearchBox */}
                {isSuccess && data.totalPages > 1 && (
                    <Pagination
                        totalPages={data.totalPages}
                        currentPage={page}
                        onPageChange={setPage}
                    />
                )}
                {/* Кнопка створення нотатки */}
            </header>
            {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
        </div>
    );
}

export default App;
