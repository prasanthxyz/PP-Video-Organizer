import * as React from 'react'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'
import { getImgPathAndVideoName } from '../utils'
import VideoRowView from '../views/videos/VideoRow'

export default function VideoRow({ video, deleteVideo, index }) {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [fileExists, setFileExists] = React.useState(false)
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)

  const setFilesExist = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(video.filePath))
    setFileExists(await mainAdapter.isFileExisting(video.filePath))
  }

  React.useEffect(() => {
    setFilesExist()
  }, [])

  const handleGenerateTgp = async () => {
    setIsGeneratingTgp(true)
    await mainAdapter.generateTgp(video.filePath)
    setTgpExists(true)
    setIsGeneratingTgp(false)
  }

  const { videoName } = getImgPathAndVideoName(video.filePath)
  const getVideoLink = () => <Link to={`/video/${video.filePath}`}>{videoName}</Link>

  return (
    <VideoRowView
      video={video}
      fileExists={fileExists}
      getVideoLink={getVideoLink}
      videoName={videoName}
      deleteVideo={deleteVideo}
      tgpExists={tgpExists}
      isGeneratingTgp={isGeneratingTgp}
      handleGenerateTgp={handleGenerateTgp}
    />
  )
}
