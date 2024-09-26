import { detailService } from "@/lib/actions/service.action";
import AddServiceCart from "./add-service-cart";

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
        <div>
            {service.name}
            <AddServiceCart service={service} />
        </div>
    );
}
