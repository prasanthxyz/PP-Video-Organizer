import * as React from 'react'
import { getNameAndPathComponents } from '../utils'
import CheckBoxGroupsView from '../views/common/CheckBoxGroups'

export default function CheckBoxGroups({ lists, saveHandlers, useDiffObj = false, postSave }) {
  const [prevSelectedItems, setPrevSelectedItems] = React.useState([])
  const [selectedItems, setSelectedItems] = React.useState([])
  const [filterTexts, setFilterTexts] = React.useState([])

  React.useEffect(() => {
    const selectedItems = lists.map((list) => list.selectedItems)
    setSelectedItems(selectedItems)
    setPrevSelectedItems(selectedItems)
    setFilterTexts(lists.map(() => ''))
  }, [lists])

  if (selectedItems.length === 0) return <></>

  const handleChange = (listIndex, itemIndex, element) => {
    const newSet = new Set(selectedItems[listIndex])
    if (element.checked) {
      newSet.add(element.value)
    } else {
      newSet.delete(element.value)
    }

    const newSelectedItems = [...selectedItems]
    newSelectedItems[listIndex] = newSet
    setSelectedItems(newSelectedItems)
  }

  const handleSelectAll = (listIndex, checked) => {
    const newSet = checked ? new Set(lists[listIndex].allItems) : new Set()
    const newSelectedItems = [...selectedItems]
    newSelectedItems[listIndex] = newSet
    setSelectedItems(newSelectedItems)
  }

  const handleSave = async () => {
    for (let i = 0; i < lists.length; i++) await saveHandlers[i](selectedItems[i])

    const saveObjs = useDiffObj
      ? [...Array(lists.length).keys()].map((i) =>
          getDiffObj(prevSelectedItems[i], selectedItems[i])
        )
      : selectedItems
    if (postSave !== null) await postSave(saveObjs)
  }

  return (
    <CheckBoxGroupsView
      lists={lists}
      selectedItems={selectedItems}
      handleSelectAll={handleSelectAll}
      filterTexts={filterTexts}
      setFilterTexts={setFilterTexts}
      getNameAndPathComponents={getNameAndPathComponents}
      handleChange={handleChange}
      prevSelectedItems={prevSelectedItems}
      handleSave={handleSave}
    />
  )
}

const getDiffObj = (prevItems, curItems) => {
  const diffObj = { add: [], remove: [] }
  for (const item of curItems) {
    if (!prevItems.has(item)) {
      diffObj['add'].push(item)
    }
  }
  for (const item of prevItems) {
    if (!curItems.has(item)) {
      diffObj['remove'].push(item)
    }
  }
  return diffObj
}
