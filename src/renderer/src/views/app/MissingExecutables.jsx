import { Flex, Table } from 'antd'
import Typography from 'antd/es/typography/Typography'
import * as React from 'react'

export default function MissingExecutables({ packagesToInstall }) {
  return (
    <Flex justify="center" align="center" style={{ width: '100%', height: '80vh' }} vertical>
      <Typography.Title level={4}>
        Please ensure these are installed and available in PATH
      </Typography.Title>
      <Table
        dataSource={packagesToInstall.map(([name, instr, type]) => ({
          key: name,
          dataIndex: name,
          name: name,
          instruction:
            type === 'code' ? (
              <code style={{ color: 'red' }}>{instr}</code>
            ) : (
              <a href={instr}>{instr}</a>
            )
        }))}
        showHeader={false}
        pagination={false}
        columns={[
          {
            title: '',
            dataIndex: 'name'
          },
          { title: '', dataIndex: 'instruction' }
        ]}
      />
    </Flex>
  )
}
