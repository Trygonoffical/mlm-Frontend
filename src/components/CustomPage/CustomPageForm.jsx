'use client'

import React, { useState, useRef } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Editor } from '@tinymce/tinymce-react';
import { getTokens } from '@/utils/cookies';

const CustomPageForm = ({ page, setRefreshKey, onClose }) => {
    const [isOpen, setIsOpen] = useState(!!page);
    const [loading, setLoading] = useState(false);
    const editorRef = useRef(null);
    const {token } = getTokens()
    const [formData, setFormData] = useState({
        title: page?.title || '',
        slug: page?.slug || '',
        content: page?.content || '',
        show_in_footer: page?.show_in_footer || false,
        show_in_header: page?.show_in_header || false,
        order: page?.order || 0,
        is_active: page?.is_active ?? true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            
            const url = page
                ? `${process.env.NEXT_PUBLIC_API_URL}/custom-pages/${page.id}/`
                : `${process.env.NEXT_PUBLIC_API_URL}/custom-pages/`;

            const response = await fetch(url, {
                method: page ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success(`Page ${page ? 'updated' : 'created'} successfully`);
                setRefreshKey(old => old + 1);
                setIsOpen(false);
                if (onClose) onClose();
            } else {
                const data = await response.json();
                toast.error(data.message || `Error ${page ? 'updating' : 'creating'} page`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(`Error ${page ? 'updating' : 'creating'} page`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // TinyMCE configuration
    const editorConfig = {
        height: 500,
        menubar: true,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    };

    return (
        <>
            {!page && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Page
                </button>
            )}
  
            <Dialog 
                open={isOpen} 
                onClose={() => {
                    setIsOpen(false);
                    if (onClose) onClose();
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-start p-4 ">
                    <DialogPanel className="mx-auto my-8 max-h-[750px] max-w-3xl rounded bg-white p-6 w-full overflow-y-auto" >
                        <div className="flex justify-between items-center mb-4">
                            <DialogTitle className="text-lg font-medium">
                                {page ? 'Edit' : 'Add'} Page
                            </DialogTitle>
                            <button 
                                onClick={() => {
                                    setIsOpen(false);
                                    if (onClose) onClose();
                                }}
                            >
                                <XMarkIcon className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                    onInit={(evt, editor) => editorRef.current = editor}
                                    initialValue={formData.content}
                                    init={editorConfig}
                                    onEditorChange={(content) => {
                                        setFormData(prev => ({ ...prev, content }));
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Order</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="show_in_header"
                                        checked={formData.show_in_header}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                        Show in Header
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="show_in_footer"
                                        checked={formData.show_in_footer}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                        Show in Footer
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                        Active
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false);
                                        if (onClose) onClose();
                                    }}
                                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : page ? 'Update Page' : 'Create Page'}
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default CustomPageForm;