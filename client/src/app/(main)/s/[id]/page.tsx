import ServiceDetail from "@/components/service-detail";

interface IServiceDetailPageProps {
    params: { id: string };
}

export default function ProductDetailPage({ params }: IServiceDetailPageProps) {
    const { id } = params;

    return <ServiceDetail id={id} />;
}
