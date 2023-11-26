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

  const checkBoxes = allItems.map((item) => (
    <div key={item}>
      <Form.Check
        value={item}
        label={item}
        onChange={handleUpdate}
        checked={selectedItems.has(item)}
      />
    </div>
  ))

  return (
    <Stack direction="vertical">
      <Form>{checkBoxes}</Form>
    </Stack>
  )
}
