import { productDetail } from "@/lib/actions/product.action";
import ProductTypeSelect from "./product-type";

export default async function ProductDetail({ id }: { id: string }) {
    const { response, error } = await productDetail(id);

    if (!response) {
        return <p>Failed</p>;
    }

    const product = response.result;

    return (
        <div>
            <p>ProductId: {product.base.id}</p>
            <p>Product name: {product.base.name}</p>
            <div>
                <ProductTypeSelect product={product} />
            </div>
        </div>
    );
}
