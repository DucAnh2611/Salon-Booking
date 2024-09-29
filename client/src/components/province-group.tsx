"use client";

import useProvince from "@/hook/useProvince.hook";
import { joinString } from "@/lib/string";
import { ChangeEvent } from "react";
import DistrictCombobox from "./district-combobox";
import ProvinceCombobox from "./province-combobox";
import { Input } from "./ui/input";
import WardCombobox from "./ward-combobox";

interface IProvinceGroupProps {}

export default function ProvinceGroup({}: IProvinceGroupProps) {
    const {
        province: { selected: pSelected },
        district: { selected: dSelected },
        ward: { selected: wSelected },
        street,
        setStreet,
    } = useProvince();

    const handleChangeStreet = (e: ChangeEvent<HTMLInputElement>) => {
        const st = e.target.value;

        setStreet(st);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-2 w-full">
                <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="flex-1">
                        <ProvinceCombobox />
                    </div>
                    {pSelected && (
                        <div className="flex-1">
                            <DistrictCombobox />
                        </div>
                    )}
                    {dSelected && (
                        <div className="flex-1">
                            <WardCombobox />
                        </div>
                    )}
                </div>
                {wSelected && (
                    <Input
                        placeholder="Số nhà, tên đường"
                        className="focus-visible:ring-transparent w-full"
                        value={street}
                        onChange={handleChangeStreet}
                    />
                )}
                {pSelected && dSelected && wSelected && street && (
                    <div className="w-full">
                        <p className="text-sm text-muted-foreground break-words whitespace-normal text-ellipsis">
                            {joinString({
                                joinString: ", ",
                                strings: [
                                    street,
                                    wSelected.name,
                                    dSelected.name,
                                    pSelected.name,
                                ],
                            })}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
