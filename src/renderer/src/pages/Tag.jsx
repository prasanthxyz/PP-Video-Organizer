import * as React from 'react'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import { Context } from '../App'
import TagView from '../views/tags/Tag'

export default function Tag() {
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())

  const { allVideos, hasDataChanged, loadDataIfChanged } = React.useContext(Context)

  React.useEffect(() => {
    loadDataIfChanged()
  }, [hasDataChanged])

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
