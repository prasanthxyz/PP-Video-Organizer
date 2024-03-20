import { execSync as execCommand } from 'child_process'
import { sync as isCommandExisting } from 'command-exists'

export function getPythonExecutable(): string {
  if (isCommandExisting('python')) return 'python'
  if (isCommandExisting('python3')) return 'python3'
  if (isCommandExisting('py')) return 'py'
  return ''
}

export function getExecutablesStatus(): boolean[] {
  const pythonExecutable = getPythonExecutable()
  let pipExecutable = ''
  if (pythonExecutable !== '') {
    try {
      execCommand(`${pythonExecutable} -m pip --version`)
      pipExecutable = `${pythonExecutable} -m pip`
    } catch (_e) {
      /* empty */
    }
  }

  let vcsiExists = false
  if (pipExecutable !== '') {
    const installedPackages = execCommand(`${pipExecutable} freeze`, {
      encoding: 'utf8'
    }).split('\n')
    vcsiExists = installedPackages.filter((pkg: string) => pkg.startsWith('vcsi==')).length > 0
  }

  return [isCommandExisting('ffmpeg'), pythonExecutable !== '', pipExecutable !== '', vcsiExists]
}
