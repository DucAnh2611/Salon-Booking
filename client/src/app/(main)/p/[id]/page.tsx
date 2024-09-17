import ProductDetail from "@/components/product-detail";

interface IProductDetailPageProps {
    params: { id: string };
}

export default function ProductDetailPage({ params }: IProductDetailPageProps) {
    const { id } = params;

    return <ProductDetail id={id} />;
}
