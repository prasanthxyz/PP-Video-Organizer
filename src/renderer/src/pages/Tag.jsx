import * as React from 'react'
import { useParams } from 'react-router'
import { useTag, useUpdateTagVideos } from '../hooks/tags'
import { useAllVideos } from '../hooks/videos'
import TagView from '../views/tags/Tag'

export default function Tag() {
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())

  const allVideos = useAllVideos().data || []

  let { tagTitle } = useParams()
  tagTitle = decodeURIComponent(tagTitle)
  const tag = useTag(tagTitle)
  const updateTagVideos = useUpdateTagVideos()

  React.useEffect(() => {
    if (!tag.isLoading) setSelectedVideos(new Set(tag.data.videos.map((video) => video.filePath)))
  }, [tag.isLoading])

  return (
    <TagView
      tagTitle={tagTitle}
      allVideos={allVideos}
      selectedVideos={selectedVideos}
      setSelectedVideos={setSelectedVideos}
      updateTagVideos={updateTagVideos}
    />
  )
}
