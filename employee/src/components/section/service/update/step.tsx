import DialogCreateStepService from "@/components/dialog/service/create-step";
import DialogUpdateStepService from "@/components/dialog/service/update-step";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    IServiceStep,
    IServiceStepDetail,
    IServiceStepUpdate,
} from "@/interface/api/service.interface";
import { IServiceUpdateSectionProps } from "@/interface/service-section.interface";
import { api_media_url } from "@/utils/apiCall";
import { getMediaType } from "@/utils/media-checker.util";
import { useEffect, useState } from "react";

interface IUpdateServiceStepSection extends IServiceUpdateSectionProps {
    stepDetail: IServiceStepDetail[];
}

export default function UpdateServiceStepSection({
    form,
    sessionId,
    stepDetail,
}: IUpdateServiceStepSection) {
    const [steps, SetSteps] = useState<IServiceStepUpdate[]>([]);

    const handleCreateStep = (newStep: IServiceStep) => {
        const newSteps = [
            ...steps,
            {
                name: newStep.name,
                description: newStep.description,
                thumbnailId: "",
                thumbnailUrl: newStep.thumbnailUrl || "",
                step: steps.length + 1,
            },
        ];
        const sortSteps = newSteps.sort((a, b) => a.step - b.step);
        SetSteps(sortSteps);
    };

    const onRemoveStep = (stepNum: number) => () => {
        const newStep = steps.filter((step) => step.step !== stepNum);
        const reArrange = newStep.reduce(
            (acc: IServiceStepUpdate[], curr, index) => {
                acc.push({
                    ...curr,
                    step: (acc[index - 1]?.step || 0) + 1,
                });
                return acc;
            },
            []
        );
        SetSteps(reArrange);
    };

    const onUpdateStep = (stepNum: number) => (newStep: IServiceStep) => {
        SetSteps((steps) =>
            steps.map((step) => {
                if (step.step === stepNum) {
                    return {
                        id: step.id,
                        step: stepNum,
                        name: newStep.name,
                        description: newStep.description,
                        thumbnailUrl: newStep.thumbnailUrl,
                    };
                }
                return step;
            })
        );
    };

    useEffect(() => {
        form.setValue(
            "steps",
            steps.map((item) => {
                const { thumbnailUrl, thumbnailId, thumbnail, ...step } = item;

                let mapItem: IServiceStepUpdate = {
                    ...step,
                };

                if (thumbnailUrl) {
                    mapItem = {
                        ...step,
                        thumbnailUrl,
                    };
                }

                if (thumbnailId) {
                    mapItem = {
                        ...step,
                        thumbnailId,
                    };
                }
                return mapItem;
            })
        );
    }, [steps]);

    useEffect(() => {
        const newSort = [...stepDetail];
        SetSteps(
            newSort
                .sort((a, b) => a.step - b.step)
                .map((step) => ({
                    id: step.id,
                    name: step.name,
                    description: step.description,
                    step: step.step,
                    thumbnailId: step.thumbnailId,
                    thumbnail: step.thumbnail,
                }))
        );
    }, [stepDetail]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Các bước thực hiện của dịch vụ</CardTitle>
                <CardDescription>
                    Mô tả các bước thực hiện của dịch vụ, nếu không muốn thêm,
                    có thể bỏ qua.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <div>
                        <DialogCreateStepService
                            sessionId={sessionId}
                            onCreate={handleCreateStep}
                            stepNums={
                                (steps.at(steps.length - 1)?.step || 0) + 1
                            }
                        />
                    </div>
                    <div>
                        <Accordion type="multiple">
                            {steps.map((step) => (
                                <AccordionItem
                                    value={step.step.toString()}
                                    key={step.step + step.name + sessionId}
                                >
                                    <AccordionTrigger>
                                        <div className="flex gap-2 items-center">
                                            <p className="text-normal font-medium">
                                                Bước {step.step}:
                                            </p>
                                            <p className="text-nowrap">
                                                {step.name}
                                            </p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="relative">
                                            <div className="flex gap-3 items-start mb-2">
                                                {step.thumbnailId &&
                                                    step.thumbnail?.path && (
                                                        <div className="h-44 aspect-[4/3] rounded overflow-hidden shrink-0">
                                                            {getMediaType(
                                                                step.thumbnail
                                                                    ?.path
                                                            ) === "image" ? (
                                                                <img
                                                                    className="w-full h-full object-cover"
                                                                    alt="step-service"
                                                                    src={
                                                                        api_media_url +
                                                                        step
                                                                            .thumbnail
                                                                            ?.path
                                                                    }
                                                                />
                                                            ) : (
                                                                <video
                                                                    className="w-full h-full object-cover"
                                                                    src={
                                                                        api_media_url +
                                                                        step
                                                                            .thumbnail
                                                                            ?.path
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                {step.thumbnailUrl && (
                                                    <div className="h-44 aspect-[4/3] rounded overflow-hidden shrink-0">
                                                        {getMediaType(
                                                            step.thumbnailUrl
                                                        ) === "image" ? (
                                                            <img
                                                                className="w-full h-full object-cover"
                                                                alt="step-service"
                                                                src={
                                                                    api_media_url +
                                                                    step.thumbnailUrl
                                                                }
                                                            />
                                                        ) : (
                                                            <video
                                                                className="w-full h-full object-cover"
                                                                src={
                                                                    api_media_url +
                                                                    step.thumbnailUrl
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h2 className="text-lg font-bold break-words leading-4">
                                                        {step.name}
                                                    </h2>
                                                    <p className="text-sm break-words mt-2">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <DialogUpdateStepService
                                                    step={step}
                                                    onCreate={onUpdateStep(
                                                        step.step
                                                    )}
                                                    sessionId={sessionId}
                                                    defaultMedia={
                                                        step.thumbnail?.path ||
                                                        null
                                                    }
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={onRemoveStep(
                                                        step.step
                                                    )}
                                                    variant="destructive"
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
