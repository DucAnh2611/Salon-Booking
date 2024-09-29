import { relatedServices } from "@/lib/actions/service.action";
import ProductSearchCard from "./product-search-card";
import ServiceSearchCard from "./service-search-card";
import { Separator } from "./ui/separator";

interface IRelatedServiceProps {
    id: string;
}

export default async function RelatedService({ id }: IRelatedServiceProps) {
    const { response } = await relatedServices(id);

    if (!response) {
        return <></>;
    }

    const related = response.result;

    return (
        <div className="space-y-6">
            {!!related.products.length && (
                <div>
                    <h1 className="text-3xl font-bold border-l-4 border-primary px-2">
                        Sản phẩm liên quan
                    </h1>
                    <Separator orientation="horizontal" className="my-3" />
                    <div className="grid grid-cols-4 gap-4">
                        {related.products.map((product) => (
                            <div key={product.id} className="w-full h-[320px]">
                                <ProductSearchCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!!related.services.length && (
                <div>
                    <h1 className="text-3xl font-bold border-l-4 border-primary px-2">
                        Dịch vụ liên quan
                    </h1>
                    <Separator orientation="horizontal" className="my-3" />
                    <div className="grid grid-cols-4 gap-4">
                        {related.services.map((sevrvice) => (
                            <div key={sevrvice.id} className="w-full h-[320px]">
                                <ServiceSearchCard service={sevrvice} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
