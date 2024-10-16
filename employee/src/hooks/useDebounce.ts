import { useEffect, useState } from "react";

const useDebounce = <T>(
    defaultValue: T,
    delay: number = 500
): [
    debounce: T,
    SetValue: React.Dispatch<React.SetStateAction<T>>,
    value: T,
    isDebounce: boolean
] => {
    const [value, SetValue] = useState<T>(defaultValue);
    const [isDebounce, SetIsDebounce] = useState<boolean>(false);
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        SetIsDebounce(true);
        const handler = setTimeout(() => {
            setDebouncedValue(value);
            SetIsDebounce(false);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return [debouncedValue, SetValue, value, isDebounce];
};

export default useDebounce;
