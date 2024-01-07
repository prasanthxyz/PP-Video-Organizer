import * as React from 'react'
import { Stack, Table } from 'rsuite'

const { Column, HeaderCell, Cell } = Table

export default function MissingExecutables({ packagesToInstall }) {
  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ width: '100%', height: '80vh' }}
    >
      <h5 style={{ marginBottom: '1rem' }}>
        Please ensure these are installed and available in PATH
      </h5>
      <Table
        style={{ width: '32rem', marginLeft: '10rem' }}
        autoHeight
        data={packagesToInstall.map(([name, instr, type]) => ({
          name: name,
          instruction:
            type === 'code' ? (
              <code style={{ color: 'red' }}>{instr}</code>
            ) : (
              <a href={instr}>{instr}</a>
            )
        }))}
      >
        <Column flexGrow={1}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={4}>
          <HeaderCell>Instructions</HeaderCell>
          <Cell dataKey="instruction" />
        </Column>
      </Table>
    </Stack>
  )
}
