import { Button, Checkbox, CheckboxGroup, Spinner, VStack } from '@chakra-ui/react'
import * as React from 'react'

export default function CheckBoxGroup({ allItems, selectedItems, save, update }) {
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

  const handleUpdate = async (newValue) => {
    setValue(newValue)
    if (update !== null) await update(newValue)
  }

  const handleSave = async () => {
    if (save === null) return
    setIsSaving(true)
    const saveObj = { add: [], remove: [], data: value }
    for (const item of value) {
      if (!selectedItems.includes(item)) {
        saveObj['add'].push(item)
      }
    }
    for (const item of selectedItems) {
      if (!value.includes(item)) {
        saveObj['remove'].push(item)
      }
    }
    await save(saveObj)
    setIsSaving(false)
  }

  return (
    <VStack>
      <CheckboxGroup value={value} onChange={handleUpdate}>
        {checkBoxes}
      </CheckboxGroup>
      {save !== null &&
        (isSaving ? <Spinner /> : <Button onClick={async () => await handleSave()}>Save</Button>)}
    </VStack>
  )
}
