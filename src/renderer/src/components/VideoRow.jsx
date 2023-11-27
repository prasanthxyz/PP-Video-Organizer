import * as React from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { Check2, X } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'

export default function VideoRow({ videoPath, deleteVideo, index }) {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [fileExists, setFileExists] = React.useState(false)
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)

  const setFilesExist = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(videoPath))
    setFileExists(await mainAdapter.isFileExisting(videoPath))
  }

  React.useEffect(() => {
    setFilesExist()
  }, [])

  const handleGenerateTgp = async (regenerate = false) => {
    setIsGeneratingTgp(true)
    await mainAdapter.generateTgp(videoPath, regenerate)
    setTgpExists(true)
    setIsGeneratingTgp(false)
  }

  const videoPathComponents = videoPath.replace(/\\/g, '/').split('/')
  const videoName = videoPathComponents[videoPathComponents.length - 1]

  const fileNameView = fileExists ? (
    <Link to={`/video/${videoPath}`}>{videoName}</Link>
  ) : (
    <>{videoName}</>
  )
  const fileHealth = fileExists ? <Check2 color="green" /> : <X color="red" />
  const tgpHealth = !fileExists ? <></> : tgpExists ? <Check2 color="green" /> : <X color="red" />
  const genTgpButton = !fileExists ? (
    <></>
  ) : isGeneratingTgp ? (
    <Spinner />
  ) : (
    <Button
      size="sm"
      variant={tgpExists ? 'secondary' : 'success'}
      onClick={async () => await handleGenerateTgp(tgpExists)}
    >
      {tgpExists ? 'Regenerate' : 'Generate'} TGP
    </Button>
  )
  const delVideoButton = (
    <Button size="sm" variant="danger" onClick={async () => await deleteVideo(videoPath)}>
      Delete
    </Button>
  )

  return (
    <tr>
      <td className="col-1">
        <div className="text-end">{index + 1}</div>
      </td>
      <td className="col-7">{fileNameView}</td>
      <td>{genTgpButton}</td>
      <td>{delVideoButton}</td>
      {!fileExists ? (
        <td className="text-danger fw-bold">File missing!</td>
      ) : !tgpExists ? (
        <td className="text-warning fw-bold">TGP missing!</td>
      ) : (
        <td></td>
      )}
    </tr>
  )
}
