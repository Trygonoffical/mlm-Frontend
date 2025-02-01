'use client'

import React, { useState, useEffect , useRef } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { Editor } from '@tinymce/tinymce-react';
import {  EyeIcon, PhotoIcon, RocketLaunchIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { TargetIcon } from 'lucide-react';


const AboutForm = ({ type = 'MAIN' }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [about, setAbout] = useState(null);
    const [formData, setFormData] = useState({
        type: type,
        title: '',
        content: '',
        feature_content: '',
        vision_description: '',
        mission_description: '',
        objective_content: '',
        is_active: true
    });
    const [leftImage, setLeftImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    // Add refs for each editor
    const contentEditorRef = useRef(null);
    const featureEditorRef = useRef(null);
    const visionEditorRef = useRef(null);
    const missionEditorRef = useRef(null);
    const objectiveEditorRef = useRef(null);


    const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/about`;

    useEffect(() => {
        fetchAbout();
    }, [type]);


    const handleEditorChange = (editorName, content) => {
        setFormData(prev => ({
            ...prev,
            [editorName]: content
        }));
    };

    // TinyMCE configuration
    const editorConfig = {
        height: 300,
        menubar: true,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    };



    const fetchAbout = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${API_BASE_URL}/?type=${type}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch about content');
            
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setAbout(data[0]);
                setFormData({
                    type: data[0].type,
                    title: data[0].title || '',
                    content: data[0].content || '',
                    feature_content: data[0].feature_content || '',
                    vision_description: data[0].vision_description || '',
                    mission_description: data[0].mission_description || '',
                    objective_content: data[0].objective_content || '',
                    is_active: data[0].is_active
                });
                setImagePreview(data[0].left_image_url);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load about content');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            if (file) {
                setLeftImage(file);
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
            const token = Cookies.get('token');
            const form = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    form.append(key, formData[key]);
                }
            });

            // Append image if selected
            if (leftImage) {
                form.append('left_image', leftImage);
            }

            const url = about 
                ? `${API_BASE_URL}/${about.id}/`
                : API_BASE_URL + '/';

            const response = await fetch(url, {
                method: about ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: form
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to save about content');
            }

            toast.success('About content saved successfully');
            await fetchAbout();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to save about content');
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
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">
                {type === 'HOME' ? 'Homepage About Content' : 'Main About Page Content'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <DocumentTextIcon className="h-6 w-6 mr-2" />
                        Basic Information
                    </h2>

                    <div className="space-y-4">
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
                            <label className="block text-sm font-medium mb-1">Content *</label>
                            <Editor
                                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                onInit={(evt, editor) => contentEditorRef.current = editor}
                                value={formData.content}
                                init={editorConfig}
                                onEditorChange={(content) => handleEditorChange('content', content)}
                            />
                        </div>

                        {/* Feature Content Editor */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Feature Content</label>
                            <Editor
                                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                onInit={(evt, editor) => featureEditorRef.current = editor}
                                value={formData.feature_content}
                                init={editorConfig}
                                onEditorChange={(content) => handleEditorChange('feature_content', content)}
                            />
                        </div>
                    </div>
                </div>

                {/* Image Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <PhotoIcon className="h-6 w-6 mr-2" />
                        Left Image
                    </h2>

                    <div>
                        <input
                            type="file"
                            name="left_image"
                            onChange={handleChange}
                            accept="image/*"
                            className="w-full mb-4"
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <Image
                                    src={imagePreview}
                                    alt="Left Image Preview"
                                    width={300}
                                    height={200}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>

                

                {/* Vision, Mission, Objectives - Only show for MAIN type */}
                {type === 'MAIN' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <EyeIcon className="h-6 w-6 mr-2" />
                            Vision, Mission & Objectives
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className=" text-sm font-medium mb-1 flex items-center">
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    Vision
                                </label>
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                    onInit={(evt, editor) => visionEditorRef.current = editor}
                                    value={formData.vision_description}
                                    init={editorConfig}
                                    onEditorChange={(content) => handleEditorChange('vision_description', content)}
                                />
                            </div>

                            <div>
                                <label className=" text-sm font-medium mb-1 flex items-center">
                                    <RocketLaunchIcon className="h-4 w-4 mr-1" />
                                    Mission
                                </label>
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                    onInit={(evt, editor) => missionEditorRef.current = editor}
                                    value={formData.mission_description}
                                    init={editorConfig}
                                    onEditorChange={(content) => handleEditorChange('mission_description', content)}
                                />
                            </div>

                            <div>
                                <label className=" text-sm font-medium mb-1 flex items-center">
                                    <TargetIcon className="h-4 w-4 mr-1" />
                                    Objectives
                                </label>
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                    onInit={(evt, editor) => objectiveEditorRef.current = editor}
                                    value={formData.objective_content}
                                    init={editorConfig}
                                    onEditorChange={(content) => handleEditorChange('objective_content', content)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Status */}
                <div className="bg-white rounded-lg shadow p-6">
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
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                                 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        {saving ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : about ? 'Update Content' : 'Create Content'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AboutForm;