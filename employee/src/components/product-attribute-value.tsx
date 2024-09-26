import { IAttributeValueUpdate } from "@/interface/api/product.interface";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface IInputProductAttributeValueProps {
    onDelete: (value: IAttributeValueUpdate) => void;
    value: IAttributeValueUpdate;
}

export default function InputProductAttributeValue({
    onDelete,
    value,
}: IInputProductAttributeValueProps) {
    const handleDelete = () => {
        onDelete(value);
    };

    return (
        <div className="flex">
            <Input
                value={value.value}
                placeholder="Mẫu mã"
                disabled
                className="!opacity-100 rounded-tr-none rounded-br-none border-r-0"
            />
            <Button
                variant="outline"
                type="button"
                className="rounded-bl-none rounded-tl-none text-destructive"
                onClick={handleDelete}
            >
                Xóa
            </Button>
        </div>
    );
}
