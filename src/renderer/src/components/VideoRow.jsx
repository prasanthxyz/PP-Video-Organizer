import * as React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'
import { getImgPathAndVideoName } from '../utils'
import SpinnerOr from './SpinnerOr'

export default function VideoRow({ videoPath, deleteVideo, index }) {
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

  const handleGenerateTgp = async () => {
    setIsGeneratingTgp(true)
    await mainAdapter.generateTgp(videoPath)
    setTgpExists(true)
    setIsGeneratingTgp(false)
  }

  const { videoName } = getImgPathAndVideoName(videoPath)
  const getVideoLink = () => <Link to={`/video/${videoPath}`}>{videoName}</Link>

  const genTgpButton = (
    <SpinnerOr
      isSpinner={isGeneratingTgp}
      msg={<span className="text-success">Generating TGP...</span>}
    >
      <Button size="sm" variant="success" onClick={handleGenerateTgp}>
        Generate TGP
      </Button>
    </SpinnerOr>
  )

  const delVideoButton = (
    <Button size="sm" variant="danger" onClick={async () => await deleteVideo(videoPath)}>
      Delete
    </Button>
  )

  return (
    <tr>
      <td className="col-1 text-end">{index + 1}</td>
      <td className="col-7">{fileExists ? getVideoLink() : videoName}</td>
      <td>{delVideoButton}</td>
      <td className="text-danger fw-bold">
        {!fileExists ? 'File missing!' : !tgpExists ? genTgpButton : ''}
      </td>
    </tr>
  )
}
