export declare const unchangedCLICommands: string[];
export declare const yarnCLICommands: string[];
export declare const npmCLICommands: string[];
/**
 * Returns the current package manager
 * @param command The command to get the package manager from
 * @returns The package manager
 */
export declare function getManager(command: string): 'npm' | 'yarn' | 'pnpm' | 'bun';
/**
 * Checks whether the command is other than npm command
 * @param command The command to check
 * @returns Whether the command is other than npm command
 */
export declare function isOtherManagerCommand(command: string): boolean;
