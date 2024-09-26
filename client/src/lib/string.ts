export const joinString = ({
    joinString = "",
    strings,
}: {
    joinString: string;
    strings: string[];
}) => {
    return strings.join(joinString);
};
