import * as React from 'react';
import {
  useAllGalleries,
  useCreateGallery,
  useDeleteGallery,
  useDeleteMissingGalleries,
} from '../hooks/galleries';
import CenterMessage from '../views/app/CenterMessage';
import FilterForm from '../views/common/FilterForm';
import GalleriesTable from '../views/galleries/GalleriesTable';
import Operations from '../views/galleries/Operations';

export default function Galleries() {
  const [filterText, setFilterText] = React.useState('');
  const [galleryInput, setGalleryInput] = React.useState('');

  const dbGalleries = useAllGalleries();
  const [createGallery, isCreating] = useCreateGallery();
  const deleteGallery = useDeleteGallery();
  const [deleteMissingGalleries, isDeletingGalleries] =
    useDeleteMissingGalleries();

  const handleCreateGallery = async () => {
    await createGallery(galleryInput);
    setGalleryInput('');
  };

  const getGalleryPathInput = async () => {
    setGalleryInput(await window.api.chooseDirectory());
  };

  if (dbGalleries.isLoading) return <CenterMessage msg="Loading..." />;

  return (
    <>
      <Operations
        isCreating={isCreating as boolean}
        galleryInput={galleryInput}
        getGalleryPathInput={getGalleryPathInput}
        handleCreateGallery={handleCreateGallery}
        isDeletingGalleries={isDeletingGalleries}
        handleDeleteMissingGalleries={deleteMissingGalleries}
      />
      <FilterForm setFilterText={setFilterText} />
      <GalleriesTable
        dbGalleries={dbGalleries.data ? dbGalleries.data : []}
        handleDeleteGallery={deleteGallery}
        filterText={filterText}
      />
    </>
  );
}
