export declare type Unit = 'second' | 'minute' | 'hour' | 'day';
/**
 * A single rate limit, used in "assemblyRateLimits" and "rateLimits".
 */
export declare type RateLimit = {
    rate: number;
    interval: number;
    unit: Unit;
    hardLimit: boolean;
};
/**
 * A single count limit, used in "assemblyCountLimits".
 */
export declare type CountLimit = {
    count: number;
    hardLimit: boolean;
};
/**
 * Count and cost characteristics of a query.
 */
export declare type Characteristics = {
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
export declare type RateLimits = {
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
export declare type CostEndpointResponse = {
    query: {
        query: string;
        operationType: 'query' | 'mutation' | 'subscription';
    };
    request: Characteristics;
    rateLimits?: RateLimits;
    name: string;
};
/**
 * The state that cost data is in.
 */
export declare const enum DataAvailability {
    None = "NONE",
    Loading = "LOADING",
    Error = "ERROR",
    Available = "AVAILABLE"
}
export declare type TimeFrame = {
    interval: number;
    unit: Unit;
};
