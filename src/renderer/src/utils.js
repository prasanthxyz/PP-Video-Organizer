import mainAdapter from '../../mainAdapter'

export async function getExecutablesStatus() {
  const pythonExecutable = (await mainAdapter.isCommandExisting('python'))
    ? 'python'
    : (await mainAdapter.isCommandExisting('python3'))
      ? 'python3'
      : (await mainAdapter.isCommandExisting('py'))
        ? 'py'
        : ''

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

export function getNameAndPathComponents(path) {
  const pathComponents = path.replace(/\\/g, '/').split('/')
  const name = pathComponents[pathComponents.length - 1]
  return [name, pathComponents]
}

export function getImgPathAndVideoName(videoPath) {
  const [videoName, videoPathComponents] = getNameAndPathComponents(videoPath)
  const imgPath = [
    ...videoPathComponents.slice(0, videoPathComponents.length - 1),
    'img',
    videoName + '.jpg'
  ].join('/')
  return { imgPath, videoName }
}
