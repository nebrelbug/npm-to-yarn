/**
 * Converts yarn to npm command
 */
export declare function convertToNpm(str: string): string;
/**
 * Converts npm to yarn command
 */
export declare function convertToYarn(str: string): string;
/**
 * Converts between npm and yarn command
 */
export default function convert(str: string, to: 'npm' | 'yarn'): string;
