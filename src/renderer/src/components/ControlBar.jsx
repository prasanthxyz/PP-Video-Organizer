import * as React from 'react'
import { useGallery } from '../hooks/galleries'
import { useVideo } from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import ControlBarView from '../views/home/ControlBarView'

export default function ControlBar({
  showVid,
  setShowVid,
  videoPath,
  galleryPath,
  handleBack,
  handleNext
}) {
  const video = useVideo(videoPath)
  const gallery = useGallery(galleryPath)

  if (video.isLoading || gallery.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <ControlBarView
      showVid={showVid}
      setShowVid={setShowVid}
      video={video}
      gallery={gallery}
      handleBack={handleBack}
      handleNext={handleNext}
    />
  )
}
