import { Button, Checkbox, CheckboxGroup, Spinner, VStack } from '@chakra-ui/react'
import * as React from 'react'

export default function CheckBoxGroup({ allItems, selectedItems, update }) {
  const [isSaving, setIsSaving] = React.useState(false)
  const [value, setValue] = React.useState([])

  React.useEffect(() => {
    setValue(selectedItems)
  }, [selectedItems])

  const checkBoxes = allItems.map((item) => (
    <Checkbox key={item} value={item}>
      {item}
    </Checkbox>
  ))

  const handleSave = async () => {
    setIsSaving(true)
    const updateObj = { add: [], remove: [] }
    for (const item of value) {
      if (!selectedItems.includes(item)) {
        updateObj['add'].push(item)
      }
    }
    for (const item of selectedItems) {
      if (!value.includes(item)) {
        updateObj['remove'].push(item)
      }
    }
    await update(updateObj)
    setIsSaving(false)
  }

  return (
    <VStack>
      <CheckboxGroup value={value} onChange={setValue}>
        {checkBoxes}
      </CheckboxGroup>
      {isSaving ? <Spinner /> : <Button onClick={async () => await handleSave()}>Save</Button>}
    </VStack>
  )
}
