import { IServiceStep } from "@/interface/service.interface";
import { api_media_url } from "@/lib/apiCall";
import { getMediaType } from "@/lib/media-checker";
import { joinString } from "@/lib/string";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { Card } from "./ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface IServiceStepCardProps {
    step: IServiceStep;
}

export default function ServiceStepCard({ step }: IServiceStepCardProps) {
    return (
        <div>
            <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger>
                    <Card className="p-3 w-full h-fit">
                        <div className="space-y-3">
                            <div className="w-full h-[150px] bg-muted rounded overflow-hidden">
                                {step.thumbnail ? (
                                    <div className="w-full h-full">
                                        {getMediaType(step.thumbnail.path) ===
                                        "image" ? (
                                            <Image
                                                src={joinString({
                                                    joinString: "",
                                                    strings: [
                                                        api_media_url,
                                                        step.thumbnail.path,
                                                    ],
                                                })}
                                                alt="step_media"
                                                width={500}
                                                height={500}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={joinString({
                                                    joinString: "",
                                                    strings: [
                                                        api_media_url,
                                                        step.thumbnail.path,
                                                    ],
                                                })}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageOff size={15} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{`Bước ${step.step}`}</p>
                                <p className="w-full line-clamp-1 text-ellipsis text-base font-medium h-[1.5rem]">
                                    {step.name}
                                </p>
                            </div>
                        </div>
                    </Card>
                </HoverCardTrigger>
                <HoverCardContent
                    side="right"
                    align="start"
                    className="!max-w-none w-fit"
                >
                    <div className="w-[450px] h-fit flex gap-5">
                        <div className="flex-1 h-fit bg-muted rounded overflow-hidden">
                            {step.thumbnail ? (
                                <div className="w-full h-auto">
                                    {getMediaType(step.thumbnail.path) ===
                                    "image" ? (
                                        <Image
                                            src={joinString({
                                                joinString: "",
                                                strings: [
                                                    api_media_url,
                                                    step.thumbnail.path,
                                                ],
                                            })}
                                            alt="step_media"
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <video
                                            src={joinString({
                                                joinString: "",
                                                strings: [
                                                    api_media_url,
                                                    step.thumbnail.path,
                                                ],
                                            })}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="w-full aspect-square flex items-center justify-center">
                                    <ImageOff size={15} />
                                </div>
                            )}
                        </div>
                        <div className="w-[300px]">
                            <p className="w-full text-wrap break-words text-ellipsis text-base font-medium h-fit">
                                {step.name}
                            </p>
                            <p className="w-full text-wrap break-words text-sm">
                                {step.description}
                            </p>
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}
