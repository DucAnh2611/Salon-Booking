import { Button } from "@/components/ui/button";
import { featureProducts } from "@/lib/actions/product.action";
import { joinString } from "@/lib/string";
import Link from "next/link";

export default async function MainProduct() {
    const { response } = await featureProducts();

    if (!response) {
        return <p>Lỗi</p>;
    }

    return (
        <div className="grid grid-cols-4 gap-12">
            {response.result.map((p) => (
                <div key={p.id}>
                    <p>{p.name}</p>
                    <Button asChild>
                        <Link
                            href={joinString({
                                joinString: "/",
                                strings: ["p", p.id],
                            })}
                        >
                            Chi tiết
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
    );
}
