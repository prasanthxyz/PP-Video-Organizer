import { Flex, Input } from 'antd'
import * as React from 'react'

const FilterForm = ({ setFilterText }) => (
  <Flex justify="center" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
    <Input
      style={{ width: '20rem' }}
      placeholder="Filter"
      onChange={(e) => setFilterText(e.target.value.toLowerCase())}
    />
  </Flex>
)

export default FilterForm
