import * as React from 'react'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import { Context } from '../App'
import useAvailableVideos from '../hooks/videos'
import TagView from '../views/tags/Tag'

export default function Tag() {
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())

  const allVideos = useAvailableVideos().data

  let { tagTitle } = useParams()
  tagTitle = decodeURIComponent(tagTitle)

  const loadData = async () => {
    setSelectedVideos(
      new Set((await mainAdapter.getDbTagData(tagTitle))['videos'].map((video) => video.filePath))
    )
  }

  React.useEffect(() => {
    loadData()
  }, [])

  return (
    <TagView
      tagTitle={tagTitle}
      allVideos={allVideos}
      selectedVideos={selectedVideos}
      setSelectedVideos={setSelectedVideos}
    />
  )
}
