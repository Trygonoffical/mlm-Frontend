'use client'

import React, { useState , useRef } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Editor } from '@tinymce/tinymce-react';
import { getTokens } from '@/utils/cookies';

const BlogForm = ({ blog, onSuccess, onClose }) => {
    const [open, setOpen] = useState(!!blog);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: blog?.title || '',
        content: blog?.content || '',
        feature_image: null,
        is_active: blog?.is_active ?? true,
        show_in_slider: blog?.show_in_slider ?? false,
        order: blog?.order || 0
    });
    const [previewUrl, setPreviewUrl] = useState(blog?.feature_image_url || null);
    const { token } = getTokens()
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'feature_image' && formData[key]) {
                form.append('feature_image', formData[key]);
            } else if (formData[key] !== null) {
                form.append(key, formData[key]);
            }
        });

        try {
            
            const url = blog
                ? `${process.env.NEXT_PUBLIC_API_URL}/blogs/${blog.id}/`
                : `${process.env.NEXT_PUBLIC_API_URL}/blogs/`;

            const response = await fetch(url, {
                method: blog ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });

            if (response.ok) {
                toast.success(`Blog ${blog ? 'updated' : 'created'} successfully`);
                onSuccess?.();
                handleClose();
            } else {
                const error = await response.json();
                throw new Error(error.message || `Error ${blog ? 'updating' : 'creating'} blog`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        onClose?.();
    };

    // Add ref for editor
    const editorRef = useRef(null);

    // Add TinyMCE initialization handler
    const handleEditorInit = (evt, editor) => {
        editorRef.current = editor;
    };

    // Modify handleChange to handle both regular inputs and editor
    const handleChange = (e) => {
        if (typeof e === 'string') {
            // This is from TinyMCE
            setFormData(prev => ({
                ...prev,
                content: e
            }));
        } else {
            // This is from regular inputs
            const { name, type, checked, files, value } = e.target;
            
            if (type === 'file' && files[0]) {
                setFormData(prev => ({
                    ...prev,
                    [name]: files[0]
                }));
                setPreviewUrl(URL.createObjectURL(files[0]));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: type === 'checkbox' ? checked : value
                }));
            }
        }
    };

    return (
        <>
            {!blog && (
                <button
                    onClick={() => setOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Blog
                </button>
            )}

            <Dialog 
                open={open} 
                onClose={handleClose}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="mx-auto max-w-3xl max-h-[750px] w-full rounded bg-white p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <DialogTitle className="text-lg font-medium">
                                {blog ? 'Edit' : 'Add'} Blog
                            </DialogTitle>
                            <button 
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                {/* <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={6}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                /> */}
                                <Editor
                                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                        init={{
                                            height: 400,
                                            menubar: true,
                                            plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help'
                                        }}
                                        value={formData.content}
                                        onEditorChange={handleChange}
                                    />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Feature Image
                                </label>
                                <input
                                    type="file"
                                    name="feature_image"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="mt-1 block w-full"
                                />
                                {previewUrl && (
                                    <div className="mt-2">
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            width={200}
                                            height={150}
                                            className="rounded object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    min="0"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Active</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="show_in_slider"
                                        checked={formData.show_in_slider}
                                        onChange={handleChange}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Show in Slider</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 
                                        `${blog ? 'Updating...' : 'Creating...'}` : 
                                        `${blog ? 'Update' : 'Create'} Blog`
                                    }
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default BlogForm;