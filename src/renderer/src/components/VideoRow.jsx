import * as React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'
import { getImgPathAndVideoName } from '../utils'
import SpinnerOr from './SpinnerOr'

export default function VideoRow({ video, deleteVideo, index }) {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [fileExists, setFileExists] = React.useState(false)
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)

  const setFilesExist = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(video.filePath))
    setFileExists(await mainAdapter.isFileExisting(video.filePath))
  }

  React.useEffect(() => {
    setFilesExist()
  }, [])

  const handleGenerateTgp = async () => {
    setIsGeneratingTgp(true)
    await mainAdapter.generateTgp(video.filePath)
    setTgpExists(true)
    setIsGeneratingTgp(false)
  }

  const { videoName } = getImgPathAndVideoName(video.filePath)
  const getVideoLink = () => <Link to={`/video/${video.filePath}`}>{videoName}</Link>

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
    <Button size="sm" variant="danger" onClick={async () => await deleteVideo(video.filePath)}>
      Delete
    </Button>
  )

  return (
    <tr>
      <td style={{ maxWidth: '3rem' }} className="text-end">
        {video.sl}
      </td>
      <td className="col-7">{fileExists ? getVideoLink() : videoName}</td>
      <td>{delVideoButton}</td>
      <td className="text-danger fw-bold">
        {!fileExists ? 'File missing!' : !tgpExists ? genTgpButton : ''}
      </td>
      <td>{Math.round(video.quality * 100) / 100}</td>
      <td>{video.width}</td>
      <td>{video.height}</td>
      <td>{video.frameRate}</td>
      <td>{Math.round(video.bitRate / 1000)}</td>
      <td>{Math.round(video.duration * 100) / 100}</td>
    </tr>
  )
}
