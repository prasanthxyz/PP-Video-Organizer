import _ from 'lodash'
import * as React from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

export default function CheckBoxGroups({
  lists,
  saveHandlers,
  useDiffObj = false,
  postSave = null
}) {
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

  const handleSave = async () => {
    for (let i = 0; i < lists.length; i++) await saveHandlers[i](selectedItems[i])

    const saveObjs = useDiffObj
      ? [...Array(lists.length).keys()].map((i) =>
          getDiffObj(prevSelectedItems[i], selectedItems[i])
        )
      : selectedItems
    if (postSave !== null) await postSave(saveObjs)
  }

  const getLabel = (item) => {
    const itemComponents = item.replace(/\\/g, '/').split('/')
    return itemComponents[itemComponents.length - 1]
  }

  const checkLists = lists.map((list, listIndex) => (
    <Col key={list.heading} className="w-50">
      <Row>
        <Col>
          <div className="fs-3 mb-1">{list.heading}</div>
        </Col>
        <Col className="d-flex align-items-center">
          <Form.Check
            label="Select All"
            checked={selectedItems[listIndex].size === list.allItems.length}
            ref={(input) => {
              if (input) {
                input.indeterminate =
                  selectedItems[listIndex].size !== 0 &&
                  selectedItems[listIndex].size !== list.allItems.length
              }
            }}
            onChange={(e) => handleSelectAll(listIndex, e.target.checked)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Control
            type="text"
            placeholder="Filter"
            className="mt-1 mb-2"
            value={filterTexts[listIndex]}
            onChange={(e) => {
              const newFilterTexts = [...filterTexts]
              newFilterTexts[listIndex] = e.target.value.toLowerCase()
              setFilterTexts(newFilterTexts)
            }}
          />
        </Col>
      </Row>
      {list.allItems
        .map((item, itemIndex) => {
          return (
            <div key={item}>
              <Form.Check
                id={item}
                value={item}
                label={getLabel(item)}
                onChange={(e) => handleChange(listIndex, itemIndex, e.target)}
                checked={selectedItems[listIndex].has(item)}
              />
            </div>
          )
        })
        .filter((item) => item.key.toLowerCase().includes(filterTexts[listIndex]))}
    </Col>
  ))
  checkLists.push(
    <Col className="mt-1" key="SAVE">
      {!_.isEqual(prevSelectedItems, selectedItems) && <Button onClick={handleSave}>Save</Button>}
    </Col>
  )

  return <Row className="mt-2">{checkLists}</Row>
}
