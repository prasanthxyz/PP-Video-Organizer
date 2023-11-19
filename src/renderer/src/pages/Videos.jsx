import { Button, Spinner, VStack } from '@chakra-ui/react'
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
    const videoObjects = await mainAdapter.getDbVideos()
    setDbVideos(
      videoObjects.map((videoPath) => {
        return <VideoRow videoPath={videoPath.filePath} key={videoPath.filePath} />
      })
    )
  }

  const handleGenerateMissingTgps = async () => {
    setIsGeneratingTgps(true)
    await mainAdapter.generateMissingTgps()
    setIsGeneratingTgps(false)
  }

  React.useEffect(() => {
    loadVideos()
  }, [])

  const addVideoForm = (
    <div>
      <input id="filesInput" type="file" multiple="multiple" onChange={updateVideoInputData} />
      {isUploading ? (
        <>
          <Spinner /> Generating TGPs...
        </>
      ) : (
        <input type="button" value="submit" onClick={handleCreateVideos} />
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
        {dbVideos.length > 0 && dbVideos}
        {addVideoForm}
      </VStack>
    </div>
  )
}
