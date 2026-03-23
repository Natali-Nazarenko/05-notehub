import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';

import NoteList from '../NoteList/NoteList';
import css from './App.module.css';
import { fetchNotes } from '../../services/noteService';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import SearchBox from '../SearchBox/SearchBox';

function App() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSearch = useDebouncedCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, 1000);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['notes', page, search],
        queryFn: () => fetchNotes(page, search),
        placeholderData: keepPreviousData,
    });

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={search} onSearch={handleSearch} />
                {isSuccess && data.totalPages > 1 && (
                    <Pagination
                        totalPages={data.totalPages}
                        currentPage={page}
                        onPageChange={setPage}
                    />
                )}
                <button className={css.button} onClick={openModal}>
                    Create note +
                </button>
            </header>
            {isLoading && <Loader />}
            {isError && <ErrorMessage />}

            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <NoteForm onClose={closeModal} />
                </Modal>
            )}
            {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
        </div>
    );
}

export default App;
