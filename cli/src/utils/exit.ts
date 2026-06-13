import chalk from "chalk";
import type { Ora } from "ora";

/** Returns true when the user cancelled via Ctrl+C or prompt escape. */
export function isUserCancellation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const err = error as { name?: string; message?: string; code?: string };

  if (err.name === "ExitPromptError") return true;
  if (err.code === "ERR_USE_AFTER_CLOSE") return true;
  if (typeof err.message === "string" && err.message.includes("force closed the prompt")) {
    return true;
  }

  return false;
}

export function exitCancelled(spinner?: Ora): never {
  if (spinner?.isSpinning) {
    spinner.stop();
  }
  console.log(chalk.yellow("\nCancelled."));
  process.exit(0);
}

export function handleCliError(error: unknown, spinner?: Ora): never {
  if (isUserCancellation(error)) {
    exitCancelled(spinner);
  }

  if (spinner?.isSpinning) {
    spinner.fail(chalk.red("Failed"));
  }

  const message = error instanceof Error ? error.message : "An unexpected error occurred.";
  console.error(chalk.red(`\n${message}`));
  process.exit(1);
}

/** Run async CLI work with unified Ctrl+C / error handling. */
export async function runCommand(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (error) {
    handleCliError(error);
  }
}

/** Run work behind an ora spinner; Ctrl+C stops cleanly during long operations. */
export async function withSpinner<T>(
  message: string,
  fn: (spinner: Ora) => Promise<T>,
): Promise<T> {
  const { default: ora } = await import("ora");
  const spinner = ora(message).start();

  const onSigint = () => exitCancelled(spinner);
  process.once("SIGINT", onSigint);

  try {
    const result = await fn(spinner);
    process.off("SIGINT", onSigint);
    return result;
  } catch (error) {
    process.off("SIGINT", onSigint);
    handleCliError(error, spinner);
  }
}
