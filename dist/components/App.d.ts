/// <reference types="react" />
import { CostEndpointResponse, DataAvailability } from '../types';
declare type Props = {
    dataAvailability: DataAvailability;
    costData: CostEndpointResponse;
};
export declare function CostPlugin({ dataAvailability, costData }: Props): JSX.Element;
export {};
