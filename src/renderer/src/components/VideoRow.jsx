import * as React from 'react'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'

export default function VideoRow({ videoPath }) {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [phoneTgpExists, setPhoneTgpExists] = React.useState(false)

  const setTgpsExists = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(videoPath, 'pc'))
    setPhoneTgpExists(await mainAdapter.isTgpExisting(videoPath, 'phone'))
  }

  React.useEffect(() => {
    setTgpsExists()
  }, [])

  const handleGenerateTgp = async (regenerate = false) => {
    await mainAdapter.generateTgp(videoPath, 'pc', regenerate)
    setTgpExists(true)
  }

  const handleGeneratePhoneTgp = async (regenerate = false) => {
    await mainAdapter.generateTgp(videoPath, 'phone', regenerate)
    setPhoneTgpExists(true)
  }

  return (
    <>
      <Link to={`/video/${videoPath}`}>{videoPath}</Link>
      {tgpExists ? (
        <>
          Tgp Exists
          <button onClick={async () => await handleGenerateTgp(true)}>Regenerate TGP</button>
        </>
      ) : (
        <button onClick={async () => await handleGenerateTgp()}>Generate TGP</button>
      )}
      {phoneTgpExists ? (
        <>
          Phone Tgp Exists
          <button onClick={async () => await handleGeneratePhoneTgp(true)}>
            Regenerate Phone TGP
          </button>
        </>
      ) : (
        <button onClick={async () => await handleGeneratePhoneTgp()}>Generate Phone TGP</button>
      )}
    </>
  )
}
