'use client'

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { Editor } from '@tinymce/tinymce-react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getTokens } from '@/utils/cookies';


const HomeSectionForm = ({ section = null, onClose, onSave }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sectionTypes, setSectionTypes] = useState([]);
    const { token } = getTokens()
    

    const [formData, setFormData] = useState({
        section_type: '',
        title: '',
        subtitle: '',
        description: '',
        is_active: true,
        display_order: 0
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const editorRef = useRef(null);

    const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/home-sections`;

    useEffect(() => {
        fetchSectionTypes();
        if (section) {
            setFormData({
                section_type: section.section_type,
                title: section.title,
                subtitle: section.subtitle || '',
                description: section.description || '',
                is_active: section.is_active,
                display_order: section.display_order
            });
            setImagePreview(section.image_url);
        }
        setLoading(false);
    }, [section]);

    const fetchSectionTypes = async () => {
        try {
            
            const response = await fetch(`${API_BASE_URL}/section_types/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch section types');
            
            const data = await response.json();
            setSectionTypes(data.types);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load section types');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            
            const form = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    form.append(key, formData[key]);
                }
            });

            // Append image if selected
            if (imageFile) {
                form.append('image', imageFile);
            }

            const url = section 
                ? `${API_BASE_URL}/${section.id}/`
                : API_BASE_URL + '/';

            const response = await fetch(url, {
                method: section ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: form
            });
            const data = await response.json();
            if (!response.ok) {
                
                throw new Error(data.detail || 'Failed to save section');
            }

            toast.success('Section saved successfully');
            if (onSave) onSave(data);
            if (onClose) onClose();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to save section');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
        open={true}
    >
        <div className="min-h-screen px-4 text-center">
            {/* <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" /> */}

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
            >
                &#8203;
            </span>

            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                    <DialogTitle
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                    >
                        {section ? 'Edit Section' : 'Create New Section'}
                    </DialogTitle>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Section Type *</label>
                        <select
                            name="section_type"
                            value={formData.section_type}
                            onChange={handleChange}
                            required
                            disabled={!!section}
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Type</option>
                            {sectionTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Subtitle</label>
                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
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
                        <label className="block text-sm font-medium mb-1">Image {!section && '*'}</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/*"
                            className="w-full mb-4"
                            required={!section}
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <Image
                                    src={imagePreview}
                                    alt="Section Image Preview"
                                    width={300}
                                    height={200}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Display Order</label>
                        <input
                            type="number"
                            name="display_order"
                            value={formData.display_order}
                            onChange={handleChange}
                            min="0"
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Active Status
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : section ? 'Update Section' : 'Create Section'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Dialog>
    );
};

export default HomeSectionForm;