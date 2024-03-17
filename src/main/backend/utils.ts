import { sync as isCommandExisting } from 'command-exists';

export { execSync as execCommand } from 'child_process';

export { isCommandExisting };

export function getPythonExecutable(): string {
  if (isCommandExisting('python')) return 'python';
  if (isCommandExisting('python3')) return 'python3';
  if (isCommandExisting('py')) return 'py';
  return '';
}
