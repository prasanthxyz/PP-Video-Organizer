import { HStack, Spinner } from '@chakra-ui/react'
import * as React from 'react'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'

export default function VideoRow({ videoPath }) {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)

  const setTgpsExists = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(videoPath))
  }

  React.useEffect(() => {
    setTgpsExists()
  }, [])

  const handleGenerateTgp = async (regenerate = false) => {
    setIsGeneratingTgp(true)
    await mainAdapter.generateTgp(videoPath, regenerate)
    setTgpExists(true)
    setIsGeneratingTgp(false)
  }

  const videoPathComponents = videoPath.replace(/\\/g, '/').split('/')
  const videoName = videoPathComponents[videoPathComponents.length - 1]
  const tgpUiElement = isGeneratingTgp ? (
    <Spinner />
  ) : (
    <button onClick={async () => await handleGenerateTgp(tgpExists)}>
      {tgpExists ? 'Regenerate' : 'Generate'} TGP
    </button>
  )

  return (
    <HStack>
      <Link to={`/video/${videoPath}`}>{videoName}</Link>
      {tgpUiElement}
    </HStack>
  )
}
