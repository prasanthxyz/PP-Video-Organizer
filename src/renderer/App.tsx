import _ from 'lodash';
import * as React from 'react';
import { UseQueryResult, useQueryClient } from 'react-query';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useAvailableGalleries } from './hooks/galleries';
import { useAvailableTags } from './hooks/tags';
import { useAvailableVideos } from './hooks/videos';
import Galleries from './pages/Galleries';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Tag from './pages/Tag';
import Tags from './pages/Tags';
import Video from './pages/Video';
import Videos from './pages/Videos';
import { getExecutablesStatus } from './utils';
import CenterMessage from './views/app/CenterMessage';
import MissingExecutables from './views/app/MissingExecutables';

export const AppContext = React.createContext(null);

function checkIsBigScreen() {
  return typeof window === 'undefined' || window.innerWidth >= 768;
}

export default function App() {
  const [isBigScreen, setIsBigScreen] = React.useState(checkIsBigScreen);

  const [isCheckingExecutables, setIsCheckingExecutables] =
    React.useState(true);
  const [executablesStatus, setExecutablesStatus] = React.useState<boolean[]>(
    [],
  );

  const [isGeneratingCombinations, setIsGeneratingCombinations] =
    React.useState(false);
  const [selection, setSelection] = React.useState({
    tags: new Set<string>(),
    videos: new Set<string>(),
    galleries: new Set<string>(),
  });
  const [combinations, setCombinations] = React.useState<[string, string][]>(
    [],
  );
  const [combinationIndex, setCombinationIndex] = React.useState(0);

  const queryClient = useQueryClient();
  const availableVideos: UseQueryResult<string[], unknown> =
    useAvailableVideos();
  const availableTags = useAvailableTags();
  const availableGalleries = useAvailableGalleries();

  async function generateCombinations(
    videos: Set<string>,
    tags: Set<string>,
    galleries: Set<string>,
  ) {
    setIsGeneratingCombinations(true);
    setCombinations(
      _.shuffle(
        (await window.api.getCombinationsData(videos, tags, galleries)) as [
          string,
          string,
        ][],
      ),
    );
    setCombinationIndex(0);
    setIsGeneratingCombinations(false);
  }

  async function saveSelection(
    videos: Set<string>,
    tags: Set<string>,
    galleries: Set<string>,
  ) {
    setSelection({
      tags,
      videos,
      galleries,
    });
    await generateCombinations(videos, tags, galleries);
  }

  async function refreshCombinations(): Promise<void> {
    queryClient.invalidateQueries(['availableVideos']);
    queryClient.invalidateQueries(['allVideos']);
    queryClient.invalidateQueries(['availableGalleries']);
    queryClient.invalidateQueries(['allGalleries']);
    queryClient.invalidateQueries(['availableTags']);
    queryClient.invalidateQueries(['allTags']);

    await availableTags.refetch();
    const videos = new Set((await availableVideos.refetch()).data);
    const galleries = new Set((await availableGalleries.refetch()).data);
    await saveSelection(videos, new Set(), galleries);
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    function autoResize() {
      setIsBigScreen(checkIsBigScreen());
    }
    window.addEventListener('resize', autoResize);
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('resize', autoResize);
  }, []);

  React.useEffect(() => {
    if (
      availableVideos.isSuccess &&
      availableTags.isSuccess &&
      availableGalleries.isSuccess
    ) {
      saveSelection(
        new Set(availableVideos.data),
        new Set(),
        new Set(availableGalleries.data),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    availableVideos.isSuccess,
    availableTags.isSuccess,
    availableGalleries.isSuccess,
  ]);

  const checkExecutables = async () => {
    setExecutablesStatus(await getExecutablesStatus());
    setIsCheckingExecutables(false);
  };

  if (!isBigScreen) {
    return (
      <CenterMessage
        msg={
          <div>
            This app is optimized for bigger screen sizes
            <br />
            Please use a bigger screen and/or maximize the window
          </div>
        }
      />
    );
  }

  if (isCheckingExecutables) {
    checkExecutables();
    return <CenterMessage msg="Checking Executables..." />;
  }

  if (executablesStatus.includes(false)) {
    const packagesToInstall = [
      ['ffmpeg', 'https://ffmpeg.org/', 'link'],
      ['python', 'https://www.python.org/', 'link'],
      ['pip', 'https://pip.pypa.io/en/stable/installation/', 'link'],
      ['vcsi', 'python -m pip install vcsi', 'code'],
    ].filter((_item, index) => !executablesStatus[index]);

    return <MissingExecutables packagesToInstall={packagesToInstall} />;
  }

  if (
    availableVideos.isLoading ||
    availableTags.isLoading ||
    availableGalleries.isLoading
  ) {
    return <CenterMessage msg="Loading..." />;
  }

  return (
    <HashRouter basename="/">
      <Routes>
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route element={<Layout refreshCombinations={refreshCombinations} />}>
          <Route
            path="/"
            element={
              <Home
                selection={selection}
                saveSelection={saveSelection}
                combinations={combinations}
                combinationIndex={combinationIndex}
                setCombinationIndex={setCombinationIndex}
                isGeneratingCombinations={isGeneratingCombinations}
              />
            }
          />
          <Route path="/video/:videoPath" element={<Video />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/gallery/:galleryPath" element={<Gallery />} />
          <Route path="/galleries" element={<Galleries />} />
          <Route path="/tag/:tagTitle" element={<Tag />} />
          <Route path="/tags" element={<Tags />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
