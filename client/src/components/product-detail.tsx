import { productDetail } from "@/lib/actions/product.action";
import ProductDetailMedia from "./product-detail-media";
import ProductTypeSelect from "./product-type";
import { Card } from "./ui/card";

export default async function ProductDetail({ id }: { id: string }) {
    const { response, error } = await productDetail(id);

    if (!response) {
        return <p>Failed</p>;
    }

    const product = response.result;
    if (!product.base) return <></>;

    return (
        <div className="space-y-6">
            <Card className="grid grid-cols-2 gap-8 p-4">
                <div className="col-span-1">
                    <ProductDetailMedia medias={product.base.productMedia} />
                </div>
                <div className="col-span-1 space-y-2">
                    <h1 className="text-3xl font-bold h-[2.25rem] line-clamp-2 break-words w-full">
                        {product.base.name}
                    </h1>
                    <p className="text-muted-foreground w-full">
                        {product.base.description}
                    </p>

                    <div>
                        <ProductTypeSelect product={product} />
                    </div>
                </div>
            </Card>
        </div>
    );
}
