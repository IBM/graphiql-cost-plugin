import React from 'react';

type Unit = 'second' | 'minute' | 'hour' | 'day';
/**
 * A single rate limit, used in "assemblyRateLimits" and "rateLimits".
 */
type RateLimit = {
    rate: number;
    interval: number;
    unit: Unit;
    hardLimit: boolean;
};
/**
 * A single count limit, used in "assemblyCountLimits".
 */
type CountLimit = {
    count: number;
    hardLimit: boolean;
};
/**
 * Count and cost characteristics of a query.
 */
type Characteristics = {
    fieldCost: number;
    fieldCounts: {
        [fieldName: string]: number;
    };
    typeCost: number;
    typeCounts: {
        [typeName: string]: number;
    };
    inputFieldCost: number;
    inputTypeCost: number;
    argumentCost: number;
};
/**
 * Set of ratelimits defined on a gateway.
 */
type RateLimits = {
    assemblyRateLimits?: {
        [limitKey: string]: RateLimit[];
    };
    rateLimits?: {
        [limitKey: string]: RateLimit[];
    };
    assemblyCountLimits?: {
        [limitKey: string]: CountLimit[];
    };
};
/**
 * The response data returned by a cost endpoint.
 */
type CostEndpointResponse = {
    query: {
        query: string;
        operationType: 'query' | 'mutation' | 'subscription';
    };
    request: Characteristics;
    rateLimits?: RateLimits;
    name: string;
    errors?: any;
};
/**
 * The state that cost data is in.
 */
declare const enum DataAvailability {
    None = "NONE",
    Loading = "LOADING",
    Error = "ERROR",
    Available = "AVAILABLE"
}

type Props = {
    dataAvailability: DataAvailability;
    costData: CostEndpointResponse;
};
declare function CostPlugin({ dataAvailability, costData }: Props): React.JSX.Element;

export { CostPlugin };
