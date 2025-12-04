import React from 'react';
import { Container } from '../components/SharedUI';
import '../components/SharedUI.css';
import '../components/Header.css';
import '../App.css';
import UploadWidget from '../components/gallery/UploadWidget';
import { usePhotos } from '../photos/PhotosContext';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Upload page at /gallery/upload that allows users to add a photo to the in-memory gallery.
 */
export default function UploadPhotoPage() {
  const { addPhoto } = usePhotos();
  const navigate = useNavigate();

  const handleSubmit = async ({ file, previewUrl, caption, location, isPublic, uploader }) => {
    await addPhoto({ file, previewUrl, caption, location, isPublic, uploader });
    navigate('/gallery');
  };

  return (
    <section role="region" aria-label="Upload a photo">
      <Container className="tg-section">
        <h1 className="tg-section__title">Upload a Photo</h1>
        <p className="tg-section__subtitle">Share your travel moments with the community. This demo stores photos locally for now.</p>
        <UploadWidget onSubmit={handleSubmit} />
      </Container>
    </section>
  );
}
