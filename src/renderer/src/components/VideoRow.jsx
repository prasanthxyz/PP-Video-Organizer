import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { Button, Spinner, Td, Tr } from '@chakra-ui/react'
import * as React from 'react'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'

export default function VideoRow({ videoPath, deleteVideo }) {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [fileExists, setFileExists] = React.useState(false)
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)

  const setFilesExist = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(videoPath))
    setFileExists(await mainAdapter.isFileExisting(videoPath))
  }

  React.useEffect(() => {
    setFilesExist()
  }, [])

  const handleGenerateTgp = async (regenerate = false) => {
    setIsGeneratingTgp(true)
    await mainAdapter.generateTgp(videoPath, regenerate)
    setTgpExists(true)
    setIsGeneratingTgp(false)
  }

  const videoPathComponents = videoPath.replace(/\\/g, '/').split('/')
  const videoName = videoPathComponents[videoPathComponents.length - 1]

  const fileNameView = fileExists ? (
    <Link to={`/video/${videoPath}`}>{videoName}</Link>
  ) : (
    <>{videoName}</>
  )
  const fileHealth = fileExists ? <CheckIcon /> : <CloseIcon />
  const tgpHealth = !fileExists ? <></> : tgpExists ? <CheckIcon /> : <CloseIcon />
  const genTgpButton = !fileExists ? (
    <></>
  ) : isGeneratingTgp ? (
    <Spinner />
  ) : (
    <Button onClick={async () => await handleGenerateTgp(tgpExists)}>
      {tgpExists ? 'Regenerate' : 'Generate'} TGP
    </Button>
  )
  const delVideoButton = <Button onClick={async () => await deleteVideo(videoPath)}>Delete</Button>

  return (
    <Tr>
      <Td>{fileNameView}</Td>
      <Td>{fileHealth}</Td>
      <Td>{tgpHealth}</Td>
      <Td>{genTgpButton}</Td>
      <Td>{delVideoButton}</Td>
    </Tr>
  )
}
