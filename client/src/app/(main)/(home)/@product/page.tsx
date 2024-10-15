import ProductFeatureCard from "@/components/product-feature-card";
import { featureProducts } from "@/lib/actions/product.action";

export default async function MainProduct() {
    const { response } = await featureProducts();

    if (!response) {
        return <p>Lỗi</p>;
    }

    return (
        <div className="flex w-full justify-center">
            <div
                className="grid gap-5 pt-3"
                style={{
                    gridTemplateColumns: `repeat(${response.result.length}, minmax(0, 1fr))`,
                }}
            >
                {response.result.map((p) => (
                    <div key={p.id} className="w-[300px] h-fit">
                        <ProductFeatureCard product={p} />
                    </div>
                ))}
            </div>
        </div>
    );
}
