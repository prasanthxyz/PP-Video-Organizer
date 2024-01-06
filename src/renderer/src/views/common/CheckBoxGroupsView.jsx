import _ from 'lodash'
import { Button, Checkbox, Input, Stack } from 'rsuite'

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
  <Stack spacing={24} alignItems="flex-start" wrap={false}>
    {lists.map((list, listIndex) => (
      <Stack.Item flex="1 1 0px" key={list.heading}>
        <Stack direction="column" alignItems="flex-start">
          <Stack.Item>
            <h4 style={{ margin: 0 }}>{list.heading}</h4>
          </Stack.Item>
          <Stack.Item>
            <Checkbox
              checked={
                selectedItems[listIndex].size > 0 &&
                selectedItems[listIndex].size === list.allItems.length
              }
              indeterminate={
                selectedItems[listIndex].size !== 0 &&
                selectedItems[listIndex].size !== list.allItems.length
              }
              onChange={(value, checked) => handleSelectAll(listIndex, checked)}
            >
              Select All
            </Checkbox>
          </Stack.Item>
          <Stack.Item>
            <Input
              placeholder="Filter"
              style={{ width: '10rem', marginTop: '4px', marginBottom: '4px' }}
              size="sm"
              value={filterTexts[listIndex]}
              onChange={(value) => {
                const newFilterTexts = [...filterTexts]
                newFilterTexts[listIndex] = value.toLowerCase()
                setFilterTexts(newFilterTexts)
              }}
            />
          </Stack.Item>
          {list.allItems
            .map((item, itemIndex) => (
              <Stack.Item key={`${listIndex}-${item}`} value={getLabel(item)}>
                <Checkbox
                  value={item}
                  onChange={(value, checked) =>
                    handleChange(listIndex, itemIndex, { checked: checked, value: value })
                  }
                  checked={selectedItems[listIndex].has(item)}
                >
                  {getLabel(item)}
                </Checkbox>
              </Stack.Item>
            ))
            .filter((item) => item.props.value.toLowerCase().includes(filterTexts[listIndex]))}
        </Stack>
      </Stack.Item>
    ))}
    <Stack.Item flex="1 1 0px">
      <div style={{ marginTop: '0.8rem' }}>
        {!_.isEqual(prevSelectedItems, selectedItems) && (
          <Button appearance="primary" onClick={handleSave}>
            Save
          </Button>
        )}
      </div>
    </Stack.Item>
  </Stack>
)

export default CheckBoxGroupsView
