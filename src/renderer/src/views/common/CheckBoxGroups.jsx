import _ from 'lodash'

function getLabel(path) {
  const pathComponents = path.replace(/\\/g, '/').split('/')
  return pathComponents[pathComponents.length - 1]
}

const CheckBoxGroups = ({
  lists,
  selectedItems,
  handleSelectAll,
  filterTexts,
  setFilterTexts,
  handleChange,
  prevSelectedItems,
  handleSave
}) => (
  <div id="checkboxgroups" className="d-flex">
    {lists.map((list, listIndex) => (
      <div key={list.heading} className="checkboxgroup">
        <div className="checkboxgroup-header">
          <p className="checkboxgroup-heading">{list.heading}</p>
          <input
            id={`checkbox${listIndex}`}
            type="checkbox"
            label="Select All"
            checked={
              selectedItems[listIndex].size > 0 &&
              selectedItems[listIndex].size === list.allItems.length
            }
            ref={(input) => {
              if (input) {
                input.indeterminate =
                  selectedItems[listIndex].size !== 0 &&
                  selectedItems[listIndex].size !== list.allItems.length
              }
            }}
            onChange={(e) => handleSelectAll(listIndex, e.target.checked)}
          />
          <label htmlFor={`checkbox${listIndex}`}>Select All</label>
        </div>
        <div className="checkboxgroup-filter">
          <input
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
        </div>
        <div className="checkboxgroup-items">
          {list.allItems
            .map((item, itemIndex) => (
              <div key={`${listIndex}-${item}`} value={item}>
                <input
                  id={`${listIndex}-${item}`}
                  type="checkbox"
                  value={item}
                  onChange={(e) => handleChange(listIndex, itemIndex, e.target)}
                  checked={selectedItems[listIndex].has(item)}
                />
                <label htmlFor={`${listIndex}-${item}`}>{getLabel(item)}</label>
              </div>
            ))
            .filter((item) => item.props.value.toLowerCase().includes(filterTexts[listIndex]))}
        </div>
      </div>
    ))}
    <div className="checkboxgroups-save-button">
      {!_.isEqual(prevSelectedItems, selectedItems) && <button onClick={handleSave}>Save</button>}
    </div>
  </div>
)

export default CheckBoxGroups
