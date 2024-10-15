import ServiceFeatureCard from "@/components/service-feature-card";
import { featureServices } from "@/lib/actions/service.action";

export default async function MainService() {
    const { response } = await featureServices();

    if (!response) {
        return <p>Lỗi</p>;
    }

    return (
        <div className="flex w-full justify-center">
            <div
                className="grid gap-5 pt-3"
                style={{
                    gridTemplateColumns: `repeat(${response.result.length}, minmax(0, 1fr))`,
                }}
            >
                {response.result.map((s) => (
                    <div key={s.id} className="w-[300px]">
                        <ServiceFeatureCard service={s} />
                    </div>
                ))}
            </div>
        </div>
    );
}
