import { Flex, Typography } from 'antd'

export default function CenterMessage({ msg }) {
  return (
    <Flex justify="center" align="center" style={{ width: '100%', height: '80vh' }}>
      <Typography.Title level={4}>{msg}</Typography.Title>
    </Flex>
  )
}
