import { Col, Table } from 'react-bootstrap'
import VideoRow from '../../components/VideoRow'

function VideosTable({ dbVideos, handleDeleteVideo, filterText }) {
  return (
    <Col>
      <p className="fs-5 mt-2 mb-0">Videos</p>
      <Table size="sm">
        <thead>
          <tr>
            <th>SL</th>
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
            .map((video) => (
              <VideoRow video={video} deleteVideo={handleDeleteVideo} key={video.filePath} />
            ))
            .filter((videoRow) => videoRow.key.toLowerCase().includes(filterText))}
        </tbody>
      </Table>
    </Col>
  )
}

export default VideosTable
