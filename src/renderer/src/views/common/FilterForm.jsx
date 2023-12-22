import * as React from 'react'

const FilterForm = ({ setFilterText }) => (
  <div className="center-flex filter-form-container">
    <input
      id="filter-form-input"
      placeholder="Filter"
      onChange={(e) => setFilterText(e.target.value.toLowerCase())}
    />
  </div>
)

export default FilterForm
