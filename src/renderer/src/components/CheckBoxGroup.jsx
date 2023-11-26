import * as React from 'react'
import { Button, Form, InputGroup, Spinner, Stack } from 'react-bootstrap'

export default function CheckBoxGroup({ allItems, selectedItems, update }) {
  const [value, setValue] = React.useState(new Set())

  React.useEffect(() => {
    setValue(selectedItems)
  }, [selectedItems])

  const handleUpdate = async (e) => {
    const newValue = new Set(value)
    if (e.target.checked) {
      newValue.add(e.target.value)
    } else {
      newValue.delete(e.target.value)
    }
    setValue(newValue)
    await update(newValue)
  }

  const checkBoxes = allItems.map((item) => (
    <div key={item}>
      <Form.Check value={item} label={item} onChange={handleUpdate} checked={value.has(item)} />
    </div>
  ))

  return (
    <Stack direction="vertical">
      <Form>{checkBoxes}</Form>
    </Stack>
  )
}
