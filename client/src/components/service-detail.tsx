import { detailService } from "@/lib/actions/service.action";
import { formatMoney } from "@/lib/money";
import AddServiceCart from "./add-service-cart";
import ServiceDetailMedia from "./service-detail-media";
import ServiceStepCard from "./service-steps";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

interface IServiceDetailProps {
    id: string;
}

export default async function ServiceDetail({ id }: IServiceDetailProps) {
    const { response } = await detailService(id);

    if (!response) {
        return <></>;
    }

    const service = response.result;

    return (
        <div className="space-y-6">
            <Card>
                <div className="grid grid-cols-2 gap-8 p-4">
                    <div className="col-span-1">
                        <ServiceDetailMedia medias={service.media} />
                    </div>
                    <div className="col-span-1 space-y-2">
                        <h1 className="text-3xl font-bold h-[2.25rem] line-clamp-2 break-words w-full">
                            {service.name}
                        </h1>

                        <p className="text-muted-foreground w-full">
                            {service.description}
                        </p>

                        <p className="text-2xl font-bold text-primary">
                            {formatMoney(service.price)}
                        </p>

                        <Separator orientation="horizontal" className="my-1" />

                        {service.category && (
                            <div className="w-full grid grid-cols-7">
                                <div className="col-span-2 flex h-fit">
                                    <p className="text-sm text-muted-foreground">
                                        Danh mục
                                    </p>
                                </div>
                                <div className="col-span-5 flex items-start">
                                    <p className="text-sm">{`${service.category.title}`}</p>
                                </div>
                            </div>
                        )}

                        <div className="w-full grid grid-cols-7">
                            <div className="col-span-2 flex h-fit">
                                <p className="text-sm text-muted-foreground">
                                    Thời lượng
                                </p>
                            </div>
                            <div className="col-span-5 flex items-start">
                                <p className="text-sm">{`${service.duration} phút`}</p>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-7">
                            <div className="col-span-2 flex h-fit">
                                <p className="text-sm text-muted-foreground">
                                    Quy trình
                                </p>
                            </div>
                            <div className="col-span-5 flex items-start">
                                <p className="text-sm">{`${service.steps.length} bước`}</p>
                            </div>
                        </div>

                        <Separator orientation="horizontal" className="my-1" />

                        <div>
                            <AddServiceCart service={service} />
                        </div>
                    </div>
                </div>
                <Separator orientation="horizontal" className="" />
                <div className="space-y-3 p-4">
                    <h1 className="text-xl font-medium border-primary px-2">
                        Quy trình dịch vụ
                    </h1>
                    {!service.steps.length && (
                        <div className="w-full py-24 text-muted-foreground text-center bg-background text-sm rounded-sm">
                            Dịch vụ này không có quy trình
                        </div>
                    )}
                    {!!service.steps.length && (
                        <div className="w-full grid grid-cols-4 gap-3">
                            {service.steps.map((step) => (
                                <div key={step.id}>
                                    <ServiceStepCard step={step} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
