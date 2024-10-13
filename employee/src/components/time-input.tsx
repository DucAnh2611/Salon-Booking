import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";

interface ITimeMinutesInputProps {
    onChange: (minutes: number) => void;
    value: number;
}

export default function TimeMinuteInput({
    onChange,
    value,
}: ITimeMinutesInputProps) {
    const [duration, SetDuration] = useState<{
        hours: number;
        minutes: number;
    }>({ hours: 0, minutes: 0 });

    const handleChangeDuration =
        (type: "minutes" | "hours") => (e: ChangeEvent<HTMLInputElement>) => {
            const newDuration = {
                ...duration,
            };

            const value = parseInt(e.target.value) || 0;

            switch (type) {
                case "minutes":
                    if (value <= 0) {
                        newDuration.hours = 0;
                        newDuration.minutes = 0;
                        break;
                    }
                    if (value >= 60) {
                        const addHour = Math.floor(value / 60);

                        newDuration.hours += addHour;
                        newDuration.minutes = value % 60;
                        break;
                    }
                    newDuration.minutes = value;
                    break;
                case "hours":
                    if (value <= 0) {
                        newDuration.hours = 0;
                        break;
                    }
                    newDuration.hours = value;
                    break;
                default:
                    break;
            }

            onChange(newDuration.hours * 60 + newDuration.minutes);
            SetDuration(newDuration);
        };

    useEffect(() => {
        SetDuration({
            hours: Math.floor(value / 60),
            minutes: value % 60,
        });
    }, [value]);

    return (
        <div className="flex gap-2 cursor-default">
            {duration.hours > 0 && (
                <div className="flex gap-1 flex-1">
                    <Input
                        type="number"
                        placeholder="Giờ"
                        value={duration.hours}
                        onChange={handleChangeDuration("hours")}
                    />
                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                        <p>Giờ</p>
                    </div>
                </div>
            )}
            <div className="flex gap-1 flex-1">
                <Input
                    type="number"
                    placeholder="Phút"
                    value={duration.minutes}
                    onChange={handleChangeDuration("minutes")}
                />
                <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                    <p>Phút</p>
                </div>
            </div>
        </div>
    );
}
