import { Button } from 'react-bootstrap'
import SpinnerOr from '../common/SpinnerOr'

function VideoRow({
  video,
  fileExists,
  getVideoLink,
  videoName,
  deleteVideo,
  tgpExists,
  isGeneratingTgp,
  handleGenerateTgp
}) {
  return (
    <tr>
      <td style={{ maxWidth: '3rem' }} className="text-end">
        {video.sl}
      </td>
      <td className="col-7">{fileExists ? getVideoLink() : videoName}</td>
      <td>
        <Button size="sm" variant="danger" onClick={async () => await deleteVideo(video.filePath)}>
          Delete
        </Button>
      </td>
      <td className="text-danger fw-bold">
        {!fileExists ? (
          'File missing!'
        ) : !tgpExists ? (
          <SpinnerOr
            isSpinner={isGeneratingTgp}
            msg={<span className="text-success">Generating TGP...</span>}
          >
            <Button size="sm" variant="success" onClick={handleGenerateTgp}>
              Generate TGP
            </Button>
          </SpinnerOr>
        ) : (
          ''
        )}
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

export default VideoRow
