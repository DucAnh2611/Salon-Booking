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
    IServiceStepCreate,
} from "@/interface/api/service.interface";
import { IServiceCreateSectionProps } from "@/interface/service-section.interface";
import { api_media_url } from "@/utils/apiCall";
import { getMediaType } from "@/utils/media-checker.util";
import { useMemo, useState } from "react";

interface ICreateServiceStepSection extends IServiceCreateSectionProps {}

export default function CreateServiceStepSection({
    form,
    sessionId,
}: ICreateServiceStepSection) {
    const [steps, SetSteps] = useState<IServiceStepCreate[]>([]);

    const handleCreateStep = (newStep: IServiceStep) => {
        const newSteps = [
            ...steps,
            {
                name: newStep.name,
                description: newStep.description,
                thumbnailId: newStep.thumbnailId || "",
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
            (acc: IServiceStepCreate[], curr, index) => {
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
                        step: stepNum,
                        ...newStep,
                        ...(newStep.thumbnailId
                            ? { thumbnailId: newStep.thumbnailId }
                            : {}),
                        ...(newStep.thumbnailUrl
                            ? { thumbnailUrl: newStep.thumbnailUrl }
                            : {}),
                    };
                }
                return step;
            })
        );
    };

    useMemo(() => {
        form.setValue(
            "steps",
            steps.map((item) => {
                const { thumbnailUrl, thumbnailId, ...step } = item;

                let mapItem: IServiceStepCreate = {
                    ...step,
                };

                if (thumbnailUrl) {
                    mapItem = {
                        ...step,
                        thumbnailUrl,
                    };
                }
                return mapItem;
            })
        );
    }, [steps]);

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
