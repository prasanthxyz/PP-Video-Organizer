// eslint-disable-next-line import/prefer-default-export
export async function getExecutablesStatus(): Promise<boolean[]> {
  const pythonExecutable = await window.api.getPythonExecutable();
  let pipExecutable = '';
  if (pythonExecutable !== '') {
    try {
      await window.api.execCommand(`${pythonExecutable} -m pip --version`);
      pipExecutable = `${pythonExecutable} -m pip`;
    } catch (_e) {
      /* empty */
    }
  }

  let vcsiExists = false;
  if (pipExecutable !== '') {
    const installedPackages = (
      await window.api.execCommand(`${pipExecutable} freeze`, {
        encoding: 'utf8',
      })
    ).split('\n');
    vcsiExists =
      installedPackages.filter((pkg: string) => pkg.startsWith('vcsi=='))
        .length > 0;
  }

  return [
    await window.api.isCommandExisting('ffmpeg'),
    pythonExecutable !== '',
    pipExecutable !== '',
    vcsiExists,
  ];
}
