import _ from 'lodash'
import * as React from 'react'
import mainAdapter from '../../../mainAdapter'

export default function useCombinations(videos, tags, galleries) {
  const [isGenerating, setIsGenerating] = React.useState(true)
  const [combinations, setCombinations] = React.useState([])
  const [combinationIndex, setCombinationIndex] = React.useState(0)

  const generateCombinations = async () => {
    setCombinations(_.shuffle(await mainAdapter.getCombinationsData(videos, tags, galleries)))
    setCombinationIndex(0)
    setIsGenerating(false)
  }

  React.useEffect(() => {
    generateCombinations()
  }, [videos, tags, galleries])

  return [isGenerating, combinations, combinationIndex, setCombinationIndex]
}
