export default function Failure({ type = "Bản ghi" }: { type?: string }) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <p className="text-destructive">Lấy thông tin {type} thất bại</p>
        </div>
    );
}
