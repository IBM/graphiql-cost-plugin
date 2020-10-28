/// <reference types="react" />
import { Characteristics, TimeFrame } from '../types';
declare type Props = {
    timeFrame: TimeFrame;
    limits: {
        name: string;
        rate: number;
    }[];
    characteristics: Characteristics;
};
export declare function TimeFrameDetails({ timeFrame, limits, characteristics }: Props): JSX.Element;
export {};
