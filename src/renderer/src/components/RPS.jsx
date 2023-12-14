import _ from 'lodash'
import * as React from 'react'
import mainAdapter from '../../../mainAdapter'
import { getImgPathAndVideoName } from '../utils'
import RPSView from '../views/home/RPS'

export default function RPS({ combination, showVid, isVideoPlaying }) {
  const [galleryImages, setGalleryImages] = React.useState([])

  const videoPath = combination[0]
  const galleryPath = combination[1]

  const loadGalleryImages = async () => {
    const imagePaths = _.shuffle(await mainAdapter.getGalleryImagePaths(galleryPath))
    setGalleryImages(imagePaths.map((imagePath) => 'file:///' + imagePath.replace(/\\/g, '/')))
  }

  React.useEffect(() => {
    loadGalleryImages()
  }, [combination])

  return (
    <RPSView
      showVid={showVid}
      getImgPathAndVideoName={getImgPathAndVideoName}
      galleryImages={galleryImages}
      videoPath={videoPath}
      isVideoPlaying={isVideoPlaying}
    />
  )
}
