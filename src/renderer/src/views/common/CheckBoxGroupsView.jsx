import { Button, Checkbox, Flex, Input, Typography } from 'antd'
import _ from 'lodash'

function getLabel(path) {
  const pathComponents = path.replace(/\\/g, '/').split('/')
  return pathComponents[pathComponents.length - 1]
}

const CheckBoxGroupsView = ({
  lists,
  selectedItems,
  handleSelectAll,
  filterTexts,
  setFilterTexts,
  handleChange,
  prevSelectedItems,
  handleSave
}) => (
  <Flex>
    {lists.map((list, listIndex) => (
      <Flex key={list.heading} vertical flex="1 1 0" style={{ width: 0 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {list.heading}
        </Typography.Title>
        <Checkbox
          checked={
            selectedItems[listIndex].size > 0 &&
            selectedItems[listIndex].size === list.allItems.length
          }
          indeterminate={
            selectedItems[listIndex].size !== 0 &&
            selectedItems[listIndex].size !== list.allItems.length
          }
          onChange={(e) => handleSelectAll(listIndex, e.target.checked)}
        >
          Select All
        </Checkbox>
        <Input
          placeholder="Filter"
          style={{ width: '10rem', marginTop: '4px', marginBottom: '4px' }}
          value={filterTexts[listIndex]}
          onChange={(e) => {
            const newFilterTexts = [...filterTexts]
            newFilterTexts[listIndex] = e.target.value.toLowerCase()
            setFilterTexts(newFilterTexts)
          }}
        />
        {list.allItems
          .map((item, itemIndex) => (
            <Checkbox
              key={`${listIndex}-${item}`}
              value={item}
              onChange={(e) => handleChange(listIndex, itemIndex, e.target)}
              checked={selectedItems[listIndex].has(item)}
            >
              {getLabel(item)}
            </Checkbox>
          ))
          .filter((item) => item.props.value.toLowerCase().includes(filterTexts[listIndex]))}
      </Flex>
    ))}
    <Flex vertical flex="1 1 0" style={{ width: 0 }}>
      <div style={{ marginTop: '0.8rem' }}>
        {!_.isEqual(prevSelectedItems, selectedItems) && (
          <Button size="large" onClick={handleSave}>
            Save
          </Button>
        )}
      </div>
    </Flex>
  </Flex>
)

export default CheckBoxGroupsView
