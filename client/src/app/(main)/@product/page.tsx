import { featureProducts } from "@/lib/actions/product.action";

export default async function MainProduct() {
    const { response } = await featureProducts();
    if (!response) {
        return <p>Lỗi</p>;
    }

    return (
        <div className="grid grid-cols-4 gap-12">{response.result.length}</div>
    );
}
