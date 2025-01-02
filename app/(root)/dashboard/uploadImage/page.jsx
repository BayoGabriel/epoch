"use client"
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.secure_url); // Get the Cloudinary image URL
  };

  return (
    <div>
      <h1>Upload Image to Cloudinary</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*"
        />
        <button type="submit">Upload Image</button>
      </form>

      {imageUrl && (
        <div>
          <h3>Uploaded Image</h3>
          <Image src={imageUrl} alt="Uploaded" width="300" />
        </div>
      )}
    </div>
  );
}
