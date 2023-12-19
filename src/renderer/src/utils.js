import mainAdapter from '../../mainAdapter'

export async function getExecutablesStatus() {
  const pythonExecutable = await mainAdapter.getPythonExecutable()
  let pipExecutable = ''
  if (pythonExecutable !== '') {
    try {
      await mainAdapter.execCommand(`${pythonExecutable} -m pip --version`)
      pipExecutable = `${pythonExecutable} -m pip`
    } catch (_e) {}
  }

  let vcsiExists = false
  if (pipExecutable !== '') {
    const installedPackages = (
      await mainAdapter.execCommand(`${pipExecutable} freeze`, { encoding: 'utf8' })
    ).split('\n')
    vcsiExists = installedPackages.filter((pkg) => pkg.startsWith('vcsi==')).length > 0
  }

  return [
    await mainAdapter.isCommandExisting('ffmpeg'),
    pythonExecutable !== '',
    pipExecutable !== '',
    vcsiExists
  ]
}
