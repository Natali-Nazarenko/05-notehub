import css from './SearchBox.module.css';

interface SearchBoxProps {
    value: string;
    onSearch: (value: string) => void;
}

function SearchBox({ value, onSearch }: SearchBoxProps) {
    const hanleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };
    return (
        <input
            className={css.input}
            type="text"
            defaultValue={value}
            onChange={hanleChange}
            placeholder="Search notes"
        />
    );
}

export default SearchBox;
