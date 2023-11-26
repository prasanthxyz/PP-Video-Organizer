import * as React from 'react'
import { Button, Form, InputGroup, Spinner, Stack } from 'react-bootstrap'

export default function CheckBoxGroup({ allItems, selectedItems, update }) {
  const handleUpdate = async (e) => {
    const newValue = new Set(selectedItems)
    if (e.target.checked) {
      newValue.add(e.target.value)
    } else {
      newValue.delete(e.target.value)
    }
    await update(newValue)
  }

  const checkBoxes = allItems.map((item) => {
    const itemComponents = item.replace(/\\/g, '/').split('/')
    const label = itemComponents[itemComponents.length - 1]
    return (
      <div key={item}>
        <Form.Check
          id={label}
          value={item}
          label={label}
          onChange={handleUpdate}
          checked={selectedItems.has(item)}
        />
      </div>
    )
  })

  return (
    <Stack direction="vertical">
      <Form>{checkBoxes}</Form>
    </Stack>
  )
}
