import { Stack } from 'rsuite'

export default function CenterMessage({ msg }) {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      style={{ width: '100%', height: '80vh', textAlign: 'center' }}
    >
      <h4>{msg}</h4>
    </Stack>
  )
}
