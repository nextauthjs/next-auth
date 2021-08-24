/**
 * @typedef {import("src/providers").EmailConfig} EmailConfig
 */
/**
 * Starts an e-mail login flow, by generating a token,
 * and sending it to the user's e-mail (with the help of a DB adapter)
 * @param {string} identifier
 * @param {import("src/types/internals").InternalOptions<EmailConfig & import("src/types/internals").InternalProvider>} options
 */
export default function email(identifier: string, options: import("src/types/internals").InternalOptions<EmailConfig & import("src/types/internals").InternalProvider>): Promise<void>;
export type EmailConfig = import("src/providers").EmailConfig;
