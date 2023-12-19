import * as React from 'react'
import { useGallery } from '../hooks/galleries'
import { getImgPathAndVideoName } from '../utils'
import CenterMessage from '../views/app/CenterMessage'
import RPSView from '../views/home/RPS'

export default function RPS({ combination, showVid, isVideoPlaying }) {
  const videoPath = combination[0]
  const galleryPath = combination[1]
  const gallery = useGallery(galleryPath)

  if (gallery.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <RPSView
      showVid={showVid}
      getImgPathAndVideoName={getImgPathAndVideoName}
      galleryImages={gallery.data.images}
      videoPath={videoPath}
      isVideoPlaying={isVideoPlaying}
    />
  )
}
