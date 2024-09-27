import ServiceFeatureCard from "@/components/service-feature-card";
import { featureServices } from "@/lib/actions/service.action";

export default async function MainService() {
    const { response } = await featureServices();

    if (!response) {
        return <p>Lỗi</p>;
    }

    return (
        <div className="flex gap-5 justify-center pt-3">
            {response.result.map((s) => (
                <div key={s.id} className="w-[300px]">
                    <ServiceFeatureCard service={s} />
                </div>
            ))}
        </div>
    );
}
