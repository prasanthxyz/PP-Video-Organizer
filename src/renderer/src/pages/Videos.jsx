import {
  Button,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack
} from '@chakra-ui/react'
import * as React from 'react'
import mainAdapter from '../../../mainAdapter.js'
import VideoRow from '../components/VideoRow.jsx'

export default function Videos() {
  const [dbVideos, setDbVideos] = React.useState([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [isGeneratingTgps, setIsGeneratingTgps] = React.useState(false)
  const [videoInputData, setVideoInputData] = React.useState({})

  const updateVideoInputData = (e) => {
    setVideoInputData(e.target.files)
  }

  const handleDeleteVideo = async (videoPathToRemove) => {
    await mainAdapter.deleteDbVideo(videoPathToRemove)
    setDbVideos(dbVideos.filter((videoPath) => videoPath.filePath !== videoPathToRemove))
  }

  const handleCreateVideos = async (e) => {
    setIsUploading(true)
    const videoPaths = Array.from(videoInputData).map((video) => video.path)
    await mainAdapter.createDbVideos(videoPaths)
    for (const videoPath of videoPaths) {
      await mainAdapter.generateTgp(videoPath)
    }
    setIsUploading(false)
    document.getElementById('filesInput').value = ''
    await loadVideos()
  }

  const loadVideos = async () => {
    setDbVideos(await mainAdapter.getDbVideos())
  }

  const handleGenerateMissingTgps = async () => {
    setIsGeneratingTgps(true)
    await mainAdapter.generateMissingTgps()
    setDbVideos([])
    await loadVideos()
    setIsGeneratingTgps(false)
  }

  React.useEffect(() => {
    loadVideos()
  }, [])

  const videosTable = (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>File</Th>
            <Th>TGP</Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {dbVideos.map((videoPath) => (
            <VideoRow
              videoPath={videoPath.filePath}
              deleteVideo={handleDeleteVideo}
              key={videoPath.filePath}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )

  const addVideoForm = (
    <div>
      <Input id="filesInput" type="file" multiple="multiple" onChange={updateVideoInputData} />
      {isUploading ? (
        <>
          <Spinner /> Generating TGPs...
        </>
      ) : (
        <Button onClick={handleCreateVideos}>Add</Button>
      )}
    </div>
  )
  return (
    <div>
      <VStack>
        {isGeneratingTgps ? (
          <>
            <Spinner /> Generating TGPs...
          </>
        ) : (
          <Button onClick={handleGenerateMissingTgps}>Generate Missing TGPs</Button>
        )}
        {dbVideos.length > 0 && videosTable}
        {addVideoForm}
      </VStack>
    </div>
  )
}
