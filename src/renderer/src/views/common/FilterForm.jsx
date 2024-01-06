import * as React from 'react'
import { Input } from 'rsuite'

const FilterForm = ({ setFilterText }) => (
  <Input
    size="sm"
    style={{ width: '20rem', alignSelf: 'center' }}
    placeholder="Filter"
    onChange={(value) => setFilterText(value.toLowerCase())}
  />
)

export default FilterForm
