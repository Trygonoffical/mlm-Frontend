
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { getTokens } from '@/utils/cookies';
import { Editor } from '@tinymce/tinymce-react';
const HomeSectionForm = ({ section, onClose, onSave }) => {

const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    section_type: '',
    is_active: true,
    display_order: 0,
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [sectionTypes, setSectionTypes] = useState([]);
  const { token } = getTokens();

  useEffect(() => {
    if (section) {
      setFormData({
        title: section.title || '',
        subtitle: section.subtitle || '',
        description: section.description || '',
        section_type: section.section_type || '',
        is_active: section.is_active !== undefined ? section.is_active : true,
        display_order: section.display_order || 0,
        image: null // We don't set the image from existing section
      });
    }
    fetchSectionTypes();
  }, [section]);

  const fetchSectionTypes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home-sections/section_types/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch section types');
      const data = await response.json();
      setSectionTypes(data.types || []);
    } catch (error) {
      console.error('Error fetching section types:', error);
      toast.error('Failed to load section types');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'file' ? files[0] : 
              type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          if (key === 'image' && formData[key]) {
            formDataToSend.append('image', formData[key]);
          } else if (key !== 'image') {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      const url = section
        ? `${process.env.NEXT_PUBLIC_API_URL}/home-sections/${section.id}/`
        : `${process.env.NEXT_PUBLIC_API_URL}/home-sections/`;

      const response = await fetch(url, {
        method: section ? 'PATCH' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to save section');
      }

      toast.success(section ? 'Section updated successfully' : 'Section created successfully');
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        section_type: '',
        is_active: true,
        display_order: 0,
        image: null
      })
      onSave();
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error(error.message || 'Failed to save section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {section ? 'Edit Section' : 'Create New Section'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Section Type
            </label>
            <select
              name="section_type"
              value={formData.section_type}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a type</option>
              {sectionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            {/* <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            /> */}
            <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                onInit={(evt, editor) => editorRef.current = editor}
                value={formData.description}
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onEditorChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image  <span className='text-xs text-red-500'>1080 * 1080 pixel</span>
            </label>
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              accept="image/*"
              className="mt-1 block w-full"
              {...(!section && { required: true })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Display Order
            </label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : (section ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomeSectionForm;