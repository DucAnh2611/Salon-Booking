export default function NoRecord({ type = "Bản ghi" }: { type?: string }) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <p>Không có {type} nào phù hợp</p>
        </div>
    );
}
