import * as React from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { Check2, X } from 'react-bootstrap-icons'
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
  const fileHealth = fileExists ? <Check2 /> : <X />
  const tgpHealth = !fileExists ? <></> : tgpExists ? <Check2 /> : <X />
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
    <tr>
      <td>{fileNameView}</td>
      <td>{fileHealth}</td>
      <td>{tgpHealth}</td>
      <td>{genTgpButton}</td>
      <td>{delVideoButton}</td>
    </tr>
  )
}
