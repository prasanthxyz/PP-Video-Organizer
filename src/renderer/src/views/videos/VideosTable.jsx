import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Table } from 'rsuite'

const { Column, HeaderCell, Cell } = Table

const VideosTable = ({ dbVideos, handleDeleteVideo, filterText }) => {
  const [sortColumn, setSortColumn] = React.useState('video')
  const [sortType, setSortType] = React.useState('asc')

  const getData = () => {
    if (sortColumn && sortType) {
      const col =
        { video: 'videoName', FR: 'frameRate', BR: 'bitRate', minutes: 'duration' }[sortColumn] ||
        sortColumn
      return dbVideos.sort((a, b) => {
        let x = a[col]
        let y = b[col]
        if (typeof x === 'string') {
          x = x.charCodeAt()
        }
        if (typeof y === 'string') {
          y = y.charCodeAt()
        }
        if (sortType === 'asc') {
          return x - y
        } else {
          return y - x
        }
      })
    }
    return dbVideos
  }

  return (
    <Table
      autoHeight
      wordWrap="break-all"
      onSortColumn={(sortColumn, sortType) => {
        setSortColumn(sortColumn)
        setSortType(sortType)
      }}
      sortColumn={sortColumn}
      sortType={sortType}
      data={getData()
        .filter((video) => video.videoName.toLowerCase().includes(filterText))
        .map((video) => ({
          video: video.isAvailable ? (
            <Link to={`/video/${encodeURIComponent(video.filePath)}`}>{video.videoName}</Link>
          ) : (
            video.videoName
          ),
          delete: (
            <FaTrash color="red" onClick={async () => await handleDeleteVideo(video.filePath)} />
          ),
          error: !video.isAvailable ? 'No File!' : !video.isTgpAvailable ? 'No TGP!' : '',
          quality: Math.round(video.quality * 100) / 100,
          width: video.width,
          height: video.height,
          FR: Math.round(video.frameRate * 100) / 100,
          BR: Math.round(video.bitRate / 1000),
          minutes: Math.round(video.duration * 100) / 100
        }))}
    >
      <Column flexGrow={1} sortable>
        <HeaderCell>Video</HeaderCell>
        <Cell dataKey="video" />
      </Column>
      <Column width={60} align="center">
        <HeaderCell>Delete</HeaderCell>
        <Cell dataKey="delete" />
      </Column>
      <Column width={75}>
        <HeaderCell>Error</HeaderCell>
        <Cell dataKey="error" />
      </Column>
      <Column sortable>
        <HeaderCell>Quality</HeaderCell>
        <Cell dataKey="quality" />
      </Column>
      <Column sortable>
        <HeaderCell>Width</HeaderCell>
        <Cell dataKey="width" />
      </Column>
      <Column sortable>
        <HeaderCell>Height</HeaderCell>
        <Cell dataKey="height" />
      </Column>
      <Column sortable>
        <HeaderCell>FR</HeaderCell>
        <Cell dataKey="FR" />
      </Column>
      <Column sortable>
        <HeaderCell>BR/1000</HeaderCell>
        <Cell dataKey="BR" />
      </Column>
      <Column sortable>
        <HeaderCell>Minutes</HeaderCell>
        <Cell dataKey="minutes" />
      </Column>
    </Table>
  )
}

export default VideosTable
