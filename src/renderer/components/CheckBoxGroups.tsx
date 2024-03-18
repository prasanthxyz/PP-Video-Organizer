import * as React from 'react';
import { IDiffObj } from '../types';
import CheckBoxGroupsView from '../views/common/CheckBoxGroupsView';

export default function CheckBoxGroups({
  lists,
  saveHandlers,
  useDiffObj = false,
  postSave,
}: {
  lists: {
    heading: string;
    allItems: string[];
    selectedItems: Set<string>;
  }[];
  saveHandlers: ((selectedItems: Set<string>) => Promise<void>)[];
  useDiffObj?: boolean;
  postSave: (saveObjs: IDiffObj[] | Set<string>[]) => Promise<void>;
}) {
  const [prevSelectedItems, setPrevSelectedItems] = React.useState<
    Set<string>[]
  >([]);
  const [selectedItems, setSelectedItems] = React.useState<Set<string>[]>([]);
  const [filterTexts, setFilterTexts] = React.useState<string[]>([]);

  React.useEffect(() => {
    const selectedItems = lists.map((list) => list.selectedItems);
    setSelectedItems(selectedItems);
    setPrevSelectedItems(selectedItems);
    setFilterTexts(lists.map(() => ''));
  }, [lists]);

  if (selectedItems.length === 0) return <></>;

  const handleChange = (
    listIndex: number,
    _itemIndex: number,
    element: { checked: boolean; value: string },
  ) => {
    const newSet = new Set(selectedItems[listIndex]);
    if (element.checked) {
      newSet.add(element.value);
    } else {
      newSet.delete(element.value);
    }

    const newSelectedItems = [...selectedItems];
    newSelectedItems[listIndex] = newSet;
    setSelectedItems(newSelectedItems);
  };

  const handleSelectAll = (listIndex: number, checked: boolean) => {
    const newSet: Set<string> = checked
      ? new Set(lists[listIndex].allItems)
      : new Set();
    const newSelectedItems: Set<string>[] = [...selectedItems];
    newSelectedItems[listIndex] = newSet;
    setSelectedItems(newSelectedItems);
  };

  const handleSave = async () => {
    for (let i = 0; i < lists.length; i++)
      await saveHandlers[i](selectedItems[i]);

    const saveObjs = useDiffObj
      ? [...Array(lists.length).keys()].map((i) =>
          getDiffObj(prevSelectedItems[i], selectedItems[i]),
        )
      : selectedItems;
    if (postSave !== null) await postSave(saveObjs);
  };

  return (
    <CheckBoxGroupsView
      lists={lists}
      selectedItems={selectedItems}
      handleSelectAll={handleSelectAll}
      filterTexts={filterTexts}
      setFilterTexts={setFilterTexts}
      handleChange={handleChange}
      prevSelectedItems={prevSelectedItems}
      handleSave={handleSave}
    />
  );
}

const getDiffObj = (
  prevItems: Set<string>,
  curItems: Set<string>,
): IDiffObj => {
  const diffObj: { add: string[]; remove: string[] } = { add: [], remove: [] };
  for (const item of curItems) {
    if (!prevItems.has(item)) {
      diffObj['add'].push(item);
    }
  }
  for (const item of prevItems) {
    if (!curItems.has(item)) {
      diffObj['remove'].push(item);
    }
  }
  return diffObj;
};
