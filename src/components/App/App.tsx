import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import css from './App.module.css';

import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

const notify = () => toast.error('No movies found for your request.');

function App() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [request, setRequest] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['movies', request, page],
        queryFn: () => fetchMovies(request, page),
        enabled: Boolean(request),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
    });

    const totalPages = data?.total_pages ?? 0;

    useEffect(() => {
        if (data && data.results.length === 0) notify();
    }, [data]);

    const handleRequest = (request: string) => {
        setRequest(request);
        setPage(1);
    };

    const openModal = (movie: Movie) => {
        setSelectedMovie(movie);
    };
    const closeModal = () => setSelectedMovie(null);

    return (
        <>
            <SearchBar onSubmit={handleRequest} />
            {isSuccess && totalPages > 1 && (
                <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={({ selected }) => setPage(selected + 1)}
                    forcePage={page - 1}
                    containerClassName={css.pagination}
                    activeClassName={css.active}
                    nextLabel="→"
                    previousLabel="←"
                />
            )}
            {isLoading && <Loader />}
            {isError && <ErrorMessage />}
            {data && data.results.length > 0 && (
                <MovieGrid onSelect={openModal} movies={data.results} />
            )}
            {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
            <Toaster />
            {}
        </>
    );
}

export default App;
