import * as React from 'react';
import { Input } from 'rsuite';

const FilterForm = ({
  setFilterText,
}: {
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <Input
    size="xs"
    style={{ width: '20rem', marginBottom: '0.3rem', marginTop: '0.3rem' }}
    placeholder="Filter"
    onChange={(value) => setFilterText(value.toLowerCase())}
  />
);

export default FilterForm;
