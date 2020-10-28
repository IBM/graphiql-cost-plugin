/// <reference types="react" />
import { Characteristics, RateLimits } from '../types';
declare type Props = {
    rateLimits: RateLimits;
    characteristics: Characteristics;
};
export declare function CostAndRates({ characteristics, rateLimits }: Props): JSX.Element;
export {};
