import useDebounce from "./useDebounce";
interface IUsePaginationProps {
    defLimit?: number;
    defPage?: number;
}

export default function usePagination({
    defLimit = 10,
    defPage = 1,
}: IUsePaginationProps) {
    const [limit, SetLimit] = useDebounce<number>(defLimit, 500);
    const [page, SetPage] = useDebounce<number>(defPage, 500);

    return { limit, SetLimit, page, SetPage };
}
