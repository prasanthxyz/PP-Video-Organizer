import * as React from 'react';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Table } from 'rsuite';
import { IGallery } from '../../types';
import { UseMutateFunction } from 'react-query';

const { Column, HeaderCell, Cell } = Table;

const GalleriesTable = ({
  dbGalleries,
  handleDeleteGallery,
  filterText,
}: {
  dbGalleries: IGallery[];
  handleDeleteGallery: UseMutateFunction<unknown, unknown, string, unknown>;
  filterText: string;
}) => (
  <Table
    autoHeight
    data={dbGalleries
      .filter((gallery: IGallery) =>
        gallery.galleryName.toLowerCase().includes(filterText),
      )
      .map((gallery: IGallery) => ({
        gallery: gallery.isAvailable ? (
          <Link to={`/gallery/${encodeURIComponent(gallery.galleryPath)}`}>
            {gallery.galleryName}
          </Link>
        ) : (
          gallery.galleryName
        ),
        isAvailable: gallery.isAvailable ? <FaCheck /> : <FaTimes />,
        delete: (
          <FaTrash
            color="red"
            onClick={async () => await handleDeleteGallery(gallery.galleryPath)}
          />
        ),
      }))}
  >
    <Column>
      <HeaderCell>Gallery</HeaderCell>
      <Cell dataKey="gallery" />
    </Column>
    <Column>
      <HeaderCell>Available?</HeaderCell>
      <Cell dataKey="isAvailable" />
    </Column>
    <Column>
      <HeaderCell>Delete</HeaderCell>
      <Cell dataKey="delete" />
    </Column>
  </Table>
);

export default GalleriesTable;
