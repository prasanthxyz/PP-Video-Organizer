import { Button, Table } from 'antd'
import { Link } from 'react-router-dom'

const VideosTable = ({ dbVideos, handleDeleteVideo, filterText }) => (
  <Table
    dataSource={dbVideos
      .filter((video) => video.videoName.toLowerCase().includes(filterText))
      .map((video) => ({
        key: video.filePath,
        dataIndex: video.videoName,
        video: video.isAvailable ? (
          <Link to={`/video/${encodeURIComponent(video.filePath)}`}>{video.videoName}</Link>
        ) : (
          video.videoName
        ),
        delete: (
          <Button size="sm" danger onClick={async () => await handleDeleteVideo(video.filePath)}>
            Delete
          </Button>
        ),
        error: !video.isAvailable ? 'File missing!' : !video.isTgpAvailable ? 'TGP missing!' : '',
        quality: Math.round(video.quality * 100) / 100,
        width: video.width,
        height: video.height,
        FR: Math.round(video.frameRate * 100) / 100,
        BR: Math.round(video.bitRate / 1000),
        minutes: Math.round(video.duration * 100) / 100
      }))}
    columns={[
      {
        title: 'Video',
        dataIndex: 'video',
        sorter: (a, b) => a.dataIndex.localeCompare(b.dataIndex)
      },
      { title: 'Delete', dataIndex: 'delete' },
      { title: 'Error', dataIndex: 'error' },
      { title: 'Quality', dataIndex: 'quality', sorter: (a, b) => a.quality - b.quality },
      { title: 'Width', dataIndex: 'width', sorter: (a, b) => a.width - b.width },
      { title: 'Height', dataIndex: 'height', sorter: (a, b) => a.height - b.height },
      { title: 'FR', dataIndex: 'FR', sorter: (a, b) => a.FR - b.FR },
      { title: 'BR/1000', dataIndex: 'BR', sorter: (a, b) => a.BR - b.BR },
      { title: 'Minutes', dataIndex: 'minutes', sorter: (a, b) => a.minutes - b.minutes }
    ]}
  />
)

export default VideosTable
