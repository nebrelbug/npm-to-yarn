type Command = 'npm' | 'yarn' | 'pnpm' | 'bun';
/**
 * Converts between npm and yarn command
 */
export declare function convert(str: string, to: 'npm' | 'yarn' | 'pnpm' | 'bun'): string;
export declare const convertMultiple: (str: string | string[], to: Command | Command[]) => string[];
export type { Command };
