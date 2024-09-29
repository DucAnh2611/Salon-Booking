import ProductDetail from "@/components/product-detail";
import RelatedProduct from "@/components/related-product";

interface IProductDetailPageProps {
    params: { id: string };
}

export default function ProductDetailPage({ params }: IProductDetailPageProps) {
    const { id } = params;

    return (
        <div className="space-y-12">
            <ProductDetail id={id} />
            <RelatedProduct id={id} />
        </div>
    );
}
