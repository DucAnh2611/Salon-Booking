import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number = 500) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    const [isDebouncing, SetIsDebouncing] = useState<boolean>(false);

    useEffect(() => {
        if (!isDebouncing) SetIsDebouncing(true);
        const handler = setTimeout(() => {
            setDebouncedValue(value);
            SetIsDebouncing(false);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return { debouncedValue, isDebouncing };
}

export default useDebounce;
