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
        <div>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <ProvinceCombobox />
                    {pSelected && <DistrictCombobox />}
                    {dSelected && <WardCombobox />}
                </div>
                {wSelected && (
                    <Input
                        placeholder="Số nhà, tên đường"
                        className="focus-visible:ring-transparent"
                        value={street}
                        onChange={handleChangeStreet}
                    />
                )}
                {pSelected && dSelected && wSelected && street && (
                    <div>
                        <p className="text-sm text-muted-foreground">
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
