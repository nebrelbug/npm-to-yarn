/**
 * Converts between npm and yarn command
 */
export declare function convert(str: string, to: 'npm' | 'yarn' | 'pnpm' | 'bun'): string;
/**
 * Returns highlighted html string
 */
export declare function highlight(command: string, theme?: "light" | "dark"): Promise<void>;
