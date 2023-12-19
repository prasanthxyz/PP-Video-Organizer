import * as React from 'react'
import { useGenerateTgp } from '../hooks/videos'
import VideoRowView from '../views/videos/VideoRowView'

export default function VideoRow({ video, deleteVideo }) {
  const [generateTgp, isGeneratingTgp] = useGenerateTgp()

  return (
    <VideoRowView
      video={video}
      deleteVideo={deleteVideo}
      isGeneratingTgp={isGeneratingTgp}
      handleGenerateTgp={() => generateTgp(video.filePath)}
    />
  )
}
