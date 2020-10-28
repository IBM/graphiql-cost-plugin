/// <reference types="react" />
/**
 * Renders the given number.
 *  - Rounds numbers with decimals to at most 2 decimals
 *  - Returns the infinity sign for numbers >= 2147483647
 */
export declare function NumberOrInf(props: {
    num: number;
}): JSX.Element;
