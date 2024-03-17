import * as React from 'react';
import { Nav } from 'rsuite';
import CheckBoxGroups from '../../components/CheckBoxGroups';
import ControlBar from '../../components/ControlBar';
import RPS from '../../components/RPS';

const HomeView = ({
  activeTab,
  availableItems,
  selection,
  saveSelection,
  combination,
  showVid,
  setShowVid,
  handleBack,
  handleNext,
  isVideoPlaying,
  setIsVideoPlaying,
  handleTabClick,
}: {
  activeTab: string;
  availableItems: { tags: string[]; galleries: string[]; videos: string[] };
  selection: { tags: Set<string>; videos: Set<string>; galleries: Set<string> };
  saveSelection: (
    videos: Set<string>,
    tags: Set<string>,
    galleries: Set<string>,
  ) => Promise<void>;
  combination: [string, string] | null;
  showVid: boolean;
  setShowVid: React.Dispatch<React.SetStateAction<boolean>>;
  handleBack: () => void;
  handleNext: () => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  handleTabClick: (newTab: string) => void;
}) => (
  <>
    <Nav
      activeKey={activeTab}
      onSelect={handleTabClick}
      appearance="subtle"
      className="tabs-nav"
    >
      <Nav.Item eventKey="watch" className="tab-header">
        Watch
      </Nav.Item>
      <Nav.Item eventKey="filter" className="tab-header">
        Config
      </Nav.Item>
    </Nav>
    {activeTab === 'watch' &&
      (combination === null ? (
        'No combination found!'
      ) : (
        <>
          <ControlBar
            showVid={showVid}
            setShowVid={setShowVid}
            videoPath={combination[0]}
            galleryPath={combination[1]}
            handleBack={handleBack}
            handleNext={handleNext}
          />
          <RPS
            combination={combination}
            showVid={showVid}
            isVideoPlaying={isVideoPlaying}
          />
        </>
      ))}
    {activeTab === 'filter' && (
      <CheckBoxGroups
        lists={[
          {
            heading: 'Galleries',
            allItems: availableItems.galleries,
            selectedItems: selection.galleries,
          },
          {
            heading: 'Tags',
            allItems: availableItems.tags,
            selectedItems: selection.tags,
          },
          {
            heading: 'Videos',
            allItems: availableItems.videos,
            selectedItems: selection.videos,
          },
        ]}
        saveHandlers={[
          async (_selectedItems: Set<string>): Promise<void> => {},
          async (_selectedItems: Set<string>): Promise<void> => {},
          async (_selectedItems: Set<string>): Promise<void> => {},
        ]}
        postSave={async ([galleries, tags, videos]) => {
          setShowVid(false);
          setIsVideoPlaying(false);
          await saveSelection(
            videos as Set<string>,
            tags as Set<string>,
            galleries as Set<string>,
          );
        }}
      />
    )}
  </>
);

export default HomeView;
