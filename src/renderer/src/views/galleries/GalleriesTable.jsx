import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'
import * as React from 'react'
import { Link } from 'react-router-dom'

const GalleriesTable = ({ dbGalleries, handleDeleteGallery, filterText }) => (
  <Table
    dataSource={dbGalleries
      .filter((gallery) => gallery.galleryName.toLowerCase().includes(filterText))
      .map((gallery) => ({
        key: gallery.galleryPath,
        dataIndex: gallery.galleryName,
        gallery: gallery.isAvailable ? (
          <Link to={`/gallery/${encodeURIComponent(gallery.galleryPath)}`}>
            {gallery.galleryName}
          </Link>
        ) : (
          gallery.galleryName
        ),
        isAvailable: gallery.isAvailable ? <CheckOutlined /> : <CloseOutlined />,
        delete: (
          <Button
            size="sm"
            danger
            onClick={async () => await handleDeleteGallery(gallery.galleryPath)}
          >
            Delete
          </Button>
        )
      }))}
    columns={[
      {
        title: 'Gallery',
        dataIndex: 'gallery',
        sorter: (a, b) => a.dataIndex.localeCompare(b.dataIndex)
      },
      { title: 'Available?', dataIndex: 'isAvailable', width: 10 },
      { title: 'Delete', dataIndex: 'delete' }
    ]}
  />
)

export default GalleriesTable
