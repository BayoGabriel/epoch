'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import opp from '@/public/opp.svg';

export default function EditOpportunity({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    institution: '',
    position: '',
    applicationDeadline: '',
    applyLink: '',
    imageUrl: '',
    status: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      if (status === 'loading') return;
      
      if (!session?.user?.role || session.user.role !== 'admin') {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`/api/opportunities/${params.id}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch opportunity');
        }
        const data = await response.json();
        
        // Format the date for the input field
        const formattedDate = data.applicationDeadline 
          ? format(new Date(data.applicationDeadline), "yyyy-MM-dd")
          : '';

        setFormData({
          ...data,
          applicationDeadline: formattedDate
        });
        setImagePreview(data.imageUrl);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetch();
  }, [session, status, router, params.id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if selected
      if (imageFile) {
        const imageData = new FormData();
        imageData.append('file', imageFile);
        imageData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        // If there's an existing image, extract its public_id
        if (formData.imageUrl) {
          try {
            // Extract the folder path and public ID
            const urlParts = formData.imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const folderPath = urlParts[urlParts.length - 2];
            const publicId = `${folderPath}/${fileName.split('.')[0]}`;

            await fetch('/api/cloudinary/delete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ publicId }),
            });
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }

        // Upload new image
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: imageData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
      }

      // Update opportunity
      const response = await fetch(`/api/opportunities/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          applicationDeadline: new Date(formData.applicationDeadline).toISOString()
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update opportunity');
      }

      router.push('/admin');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not admin
  if (!session?.user?.role || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[83px]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Opportunity</h1>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="internship">Internship</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="job">Job</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="ambassadorship">Ambassadorship</option>
                  <option value="training">Training</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Application Link</label>
              <input
                type="url"
                value={formData.applyLink}
                onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <div className="mt-1 flex items-center gap-4">
                <Image
                  src={imagePreview || opp}
                  alt="Opportunity"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
