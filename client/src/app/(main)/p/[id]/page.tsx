import ProductDetail from "@/components/product-detail";

interface IProductDetailPageProps {
    params: { id: string };
}

export default function ProductDetailPage({ params }: IProductDetailPageProps) {
    const { id } = params;

    return (
        <div className="space-y-5">
            <ProductDetail id={id} />
            <div>
                <h1>Sản phẩm liên quan</h1>
            </div>
        </div>
    );
}
