import { UseMutateFunction } from 'react-query'
import { IDiffObj, ITagFull, IVideoFull } from '../../../../types'
import CheckBoxGroups from '../../components/CheckBoxGroups'

const TagView = ({
  tag,
  allVideos,
  selectedVideos,
  setSelectedVideos,
  updateTagVideos
}: {
  tag: ITagFull
  allVideos: IVideoFull[]
  selectedVideos: Set<string>
  setSelectedVideos: React.Dispatch<React.SetStateAction<Set<string>>>
  updateTagVideos: UseMutateFunction<unknown, unknown, [string, IDiffObj], unknown>
}): JSX.Element => (
  <>
    <h3 style={{ textAlign: 'center' }}>{tag.title}</h3>
    <CheckBoxGroups
      lists={[
        {
          heading: 'Videos',
          allItems: allVideos.map((v: IVideoFull) => v.id),
          selectedItems: selectedVideos
        }
      ]}
      saveHandlers={[async (sv: Set<string>): Promise<void> => setSelectedVideos(sv)]}
      postSave={async ([videosDiffObj]) => {
        await updateTagVideos([tag.title, videosDiffObj as IDiffObj])
      }}
      useDiffObj={true}
    />
  </>
)

export default TagView
