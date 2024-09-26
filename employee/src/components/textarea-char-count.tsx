import { ChangeEvent, forwardRef, useEffect, useState } from "react";
import { Textarea, TextareaProps } from "./ui/textarea";

type TTextareaCharCounterProps = TextareaProps & {};

const TextareaCharCounter = forwardRef<
    HTMLTextAreaElement,
    TTextareaCharCounterProps
>(({ maxLength = 0, onChange, value, ...props }, ref) => {
    const [valueChange, SetValueChange] = useState<any>(value);

    const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const v = e.target.value;

        if (v.length <= maxLength) {
            SetValueChange(e.target.value);
            if (onChange) {
                onChange(e);
            }
        }
    };

    useEffect(() => {
        SetValueChange(value);
    }, [value]);

    return (
        <div className="relative">
            <Textarea
                {...props}
                value={valueChange}
                onChange={onChangeValue}
                maxLength={maxLength}
            />
            {maxLength && (
                <div className="absolute bottom-2 right-2">
                    <div className="text-xs text-muted-foreground">
                        <span className="text-primary">
                            {valueChange.length}
                        </span>
                        /<span>{maxLength}</span>
                    </div>
                </div>
            )}
        </div>
    );
});

export default TextareaCharCounter;
