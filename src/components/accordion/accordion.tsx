import { Text } from "@/components";

import { AccordionHeaderSkeleton } from "./accordion-header-skeleton";

type Props = React.PropsWithChildren<{
    accordionKey: string;
    activeKey?: string;
    setActive: (key?: string) => void;
    fallback: string | React.ReactNode;
    isLoading?: boolean;
    icon: React.ReactNode;
    label: string;
}>

export const Accordion = ({
    accordionKey,
    activeKey,
    setActive,
    fallback,
    icon,
    label,
    children,
    isLoading,
}: Props) => {
    if(isLoading){
        return <AccordionHeaderSkeleton />
    }

    const isActive = activeKey === accordionKey;

    const toggleAccordion = () => {
        if(isActive) {
            setActive(undefined);
        } else {
            setActive(accordionKey);
        }
    };
}