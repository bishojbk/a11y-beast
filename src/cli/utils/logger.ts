let verbose = false;

export function setVerbose(v: boolean) { verbose = v; }

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const MAGENTA = "\x1b[35m";

export const c = { RESET, DIM, RED, GREEN, YELLOW, CYAN, BOLD, MAGENTA };

export function info(msg: string) {
  process.stderr.write(`${CYAN}ℹ${RESET} ${msg}\n`);
}

export function success(msg: string) {
  process.stderr.write(`${GREEN}✓${RESET} ${msg}\n`);
}

export function warn(msg: string) {
  process.stderr.write(`${YELLOW}⚠${RESET} ${msg}\n`);
}

export function error(msg: string) {
  process.stderr.write(`${RED}✖${RESET} ${msg}\n`);
}

export function debug(msg: string) {
  if (verbose) process.stderr.write(`${DIM}  ${msg}${RESET}\n`);
}
