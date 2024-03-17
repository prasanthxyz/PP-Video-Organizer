import { UseMutateFunction } from 'react-query';
import CheckBoxGroups from '../../components/CheckBoxGroups';
import { IDiffObj, ITagFull, IVideoFull } from '../../types';

const TagView = ({
  tag,
  allVideos,
  selectedVideos,
  setSelectedVideos,
  updateTagVideos,
}: {
  tag: ITagFull;
  allVideos: IVideoFull[];
  selectedVideos: Set<string>;
  setSelectedVideos: React.Dispatch<React.SetStateAction<Set<string>>>;
  updateTagVideos: UseMutateFunction<
    unknown,
    unknown,
    [string, IDiffObj],
    unknown
  >;
}) => (
  <>
    <h3 style={{ textAlign: 'center' }}>{tag.title}</h3>
    <CheckBoxGroups
      lists={[
        {
          heading: 'Videos',
          allItems: allVideos.map((v: IVideoFull) => v.id),
          selectedItems: selectedVideos,
        },
      ]}
      saveHandlers={[async (sv: Set<string>) => setSelectedVideos(sv)]}
      postSave={async ([videosDiffObj]) => {
        await updateTagVideos([tag.title, videosDiffObj as IDiffObj]);
      }}
      useDiffObj={true}
    />
  </>
);

export default TagView;
