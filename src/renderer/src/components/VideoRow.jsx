import * as React from 'react'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'
import { HStack } from '@chakra-ui/react'

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

  const videoPathComponents = videoPath.replace(/\\/g, '/').split('/')
  const videoName = videoPathComponents[videoPathComponents.length - 1]

  return (
    <HStack>
      <Link to={`/video/${videoPath}`}>{videoName}</Link>
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
    </HStack>
  )
}
