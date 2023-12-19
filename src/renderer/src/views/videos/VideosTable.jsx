import { Col, Table } from 'react-bootstrap'
import VideoRow from '../../components/VideoRow'

const VideosTable = ({ dbVideos, handleDeleteVideo, filterText }) => (
  <Col>
    <p className="fs-5 mt-2 mb-0">Videos</p>
    <Table size="sm">
      <thead>
        <tr>
          <th>Video</th>
          <th></th>
          <th>Error</th>
          <th>Quality</th>
          <th>Width</th>
          <th>Height</th>
          <th>FR</th>
          <th>BR/1000</th>
          <th>Minutes</th>
        </tr>
      </thead>
      <tbody>
        {dbVideos
          .filter((video) => video.videoName.toLowerCase().includes(filterText))
          .map((video, index) => (
            <VideoRow video={video} deleteVideo={handleDeleteVideo} key={index} />
          ))}
      </tbody>
    </Table>
  </Col>
)

export default VideosTable
