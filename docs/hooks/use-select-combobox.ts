import { ChangeEvent, useState } from "react"

interface SelectComboboxValue {
  id: string
  name: string
}

interface SelectComboboxProps {
  defaultValue?: SelectComboboxValue
  items: SelectComboboxValue[]
}

export const useSelectCombobox = ({
  defaultValue = { id: "", name: "" },
  items,
}: SelectComboboxProps) => {
  const [selectedItem, setSelectedItem] =
    useState<SelectComboboxValue>(defaultValue)
  const [filteredItems, setFilteredItems] = useState(items)
  const [hasMatchItem, setHasMatchItem] = useState(false)

  const handleSelect = (value: SelectComboboxValue) => {
    let hasMatchItem = false
    setFilteredItems(
      items.filter((item) => {
        if (item.id === value.id) {
          hasMatchItem = true
        }
        return item.name.toLowerCase().includes(value.name.toLowerCase())
      })
    )
    setSelectedItem(value)
    setHasMatchItem(hasMatchItem)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    handleSelect({ id: value, name: value })
  }

  return {
    selectedItem,
    filteredItems,
    handleSelect,
    handleChange,
    hasMatchItem,
  }
}
