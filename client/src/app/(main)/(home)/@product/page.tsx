import ProductFeatureCard from "@/components/product-feature-card";
import { featureProducts } from "@/lib/actions/product.action";

export default async function MainProduct() {
    const { response } = await featureProducts();

    if (!response) {
        return <p>Lỗi</p>;
    }

    return (
        <div className="flex gap-5 justify-center pt-3">
            {response.result.map((p) => (
                <div key={p.id} className="w-[300px] h-fit">
                    <ProductFeatureCard product={p} />
                </div>
            ))}
        </div>
    );
}
