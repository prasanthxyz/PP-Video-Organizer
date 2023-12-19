import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import SpinnerOr from '../common/SpinnerOr'

const VideoRowView = ({ video, deleteVideo, isGeneratingTgp, handleGenerateTgp }) => (
  <tr>
    <td className="col-7">
      {video.isAvailable ? (
        <Link to={`/video/${encodeURIComponent(video.filePath)}`}>{video.videoName}</Link>
      ) : (
        video.videoName
      )}
    </td>
    <td>
      <Button size="sm" variant="danger" onClick={async () => await deleteVideo(video.filePath)}>
        Delete
      </Button>
    </td>
    <td className="text-danger fw-bold">
      {!video.isAvailable ? (
        'File missing!'
      ) : !video.isTgpAvailable ? (
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

export default VideoRowView
