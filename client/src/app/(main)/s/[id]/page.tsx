import RelatedService from "@/components/related-service";
import ServiceDetail from "@/components/service-detail";

interface IServiceDetailPageProps {
    params: { id: string };
}

export default function ProductDetailPage({ params }: IServiceDetailPageProps) {
    const { id } = params;

    return (
        <div className="space-y-12">
            <ServiceDetail id={id} />
            <RelatedService id={id} />
        </div>
    );
}
