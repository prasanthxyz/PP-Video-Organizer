import * as React from 'react'
import { useParams } from 'react-router'
import { useTag, useUpdateTagVideos } from '../hooks/tags'
import { useAllVideos } from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import TagView from '../views/tags/TagView'

export default function Tag() {
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())
  const allVideos = useAllVideos()

  let { tagTitle } = useParams()
  tagTitle = decodeURIComponent(tagTitle)
  const tag = useTag(tagTitle)
  const updateTagVideos = useUpdateTagVideos()

  React.useEffect(() => {
    if (!tag.isLoading) setSelectedVideos(new Set(tag.data.videos.map((video) => video.filePath)))
  }, [tag.isLoading])

  if (tag.isLoading || allVideos.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <TagView
      tag={tag.data}
      allVideos={allVideos.data}
      selectedVideos={selectedVideos}
      setSelectedVideos={setSelectedVideos}
      updateTagVideos={updateTagVideos}
    />
  )
}
