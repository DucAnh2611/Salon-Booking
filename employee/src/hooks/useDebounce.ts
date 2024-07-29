import { useEffect, useState } from "react";

const useDebounce = <T>(
    defaultValue: T,
    delay: number = 500
): [debounce: T, SetValue: React.Dispatch<React.SetStateAction<T>>] => {
    const [value, SetValue] = useState<T>(defaultValue);
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return [debouncedValue, SetValue];
};

export default useDebounce;
