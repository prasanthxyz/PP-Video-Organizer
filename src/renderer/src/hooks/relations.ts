import _ from 'lodash'
import * as React from 'react'
import { useQueryClient } from 'react-query'
import { IVideo } from 'src/types'
import { useAllGalleries } from './galleries'
import { useAllTags } from './tags'
import { useAllVideos } from './videos'

interface IRelations {
  selection: {
    tags: Set<string>
    videos: Set<string>
    galleries: Set<string>
  }
  saveSelection: (videos: Set<string>, tags: Set<string>, galleries: Set<string>) => Promise<void>
  combinations: [string, string][]
  combinationIndex: number
  setCombinationIndex: React.Dispatch<React.SetStateAction<number>>
  refreshCombinations: () => Promise<void>
  isGeneratingCombinations: boolean
}

export default function useRelations(): IRelations {
  const queryClient = useQueryClient()

  const allVideos = useAllVideos()
  const allGalleries = useAllGalleries()
  const allTags = useAllTags()

  const [selection, setSelection] = React.useState({
    tags: new Set<string>(),
    videos: new Set<string>(),
    galleries: new Set<string>()
  })
  const [combinations, setCombinations] = React.useState<[string, string][]>([])
  const [combinationIndex, setCombinationIndex] = React.useState(0)

  async function saveSelection(
    videos: Set<string>,
    tags: Set<string>,
    galleries: Set<string>
  ): Promise<void> {
    setSelection({
      tags,
      videos,
      galleries
    })
    setCombinations(getCombinations(allVideos.data || [], videos, tags, galleries))
    setCombinationIndex(0)
  }

  async function refreshCombinations(): Promise<void> {
    await Promise.all([
      queryClient.invalidateQueries(['allVideos']),
      queryClient.invalidateQueries(['allGalleries']),
      queryClient.invalidateQueries(['allTags'])
    ])
  }

  React.useEffect(() => {
    if (allVideos.isSuccess && allTags.isSuccess && allGalleries.isSuccess) {
      const availableVideos = new Set(
        allVideos.data
          ?.filter((video) => video.isAvailable && video.isTgpAvailable)
          .map((video) => video.id) || []
      )
      const availableGalleries = new Set(
        allGalleries.data
          ?.filter((gallery) => gallery.isAvailable && gallery.images.length > 0)
          .map((gallery) => gallery.id) || []
      )
      saveSelection(new Set(availableVideos), new Set(), new Set(availableGalleries))
    }
  }, [allVideos.dataUpdatedAt, allTags.dataUpdatedAt, allGalleries.dataUpdatedAt])

  const isGeneratingCombinations =
    allVideos.isLoading || allGalleries.isLoading || allTags.isLoading

  return {
    selection,
    combinations,
    combinationIndex,
    setCombinationIndex,
    saveSelection,
    refreshCombinations,
    isGeneratingCombinations
  }
}

function getCombinations(
  allVideos: IVideo[],
  selectedVideos: Set<string>,
  selectedTags: Set<string>,
  selectedGalleries: Set<string>
): [string, string][] {
  const combinations: [string, string][] = []
  for (const video of allVideos) {
    if (!selectedVideos.has(video.filePath)) continue

    const commonTags = video.tags.filter((tag) => selectedTags.has(tag))
    const commonGalleries = video.galleries.filter((gallery) => selectedGalleries.has(gallery))
    if (commonTags.length !== selectedTags.size || commonGalleries.length === 0) continue

    for (const gallery of commonGalleries) {
      combinations.push([video.filePath, gallery])
    }
  }

  return _.shuffle(combinations)
}
