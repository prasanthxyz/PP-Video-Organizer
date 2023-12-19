import _ from 'lodash'
import { Button, Col, Form, Row } from 'react-bootstrap'

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
  <Row className="mt-2">
    {lists.map((list, listIndex) => (
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
    ))}
    <Col className="mt-1" key="SAVE">
      {!_.isEqual(prevSelectedItems, selectedItems) && <Button onClick={handleSave}>Save</Button>}
    </Col>
  </Row>
)

export default CheckBoxGroups
