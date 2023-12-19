import { sync as isCommandExisting } from 'command-exists'

export { execSync as execCommand } from 'child_process'

export { isCommandExisting }

export async function getPythonExecutable() {
  return (await isCommandExisting('python'))
    ? 'python'
    : (await isCommandExisting('python3'))
      ? 'python3'
      : (await isCommandExisting('py'))
        ? 'py'
        : ''
}
