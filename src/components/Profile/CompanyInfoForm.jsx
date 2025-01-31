'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { 
    BuildingOffice2Icon,
    PhoneIcon, 
    EnvelopeIcon,
    MapPinIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

const CompanyInfoForm = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [formData, setFormData] = useState({
        company_name: '',
        email: '',
        mobile_1: '',
        mobile_2: '',
        gst_number: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        facebook_link: '',
        instagram_link: '',
        twitter_link: '',
        youtube_link: '',
        is_active: true
    });
    const [imageFiles, setImageFiles] = useState({
        logo: null,
        footer_bg_image: null,
        testimonial_bg_image: null
    });
    const [previews, setPreviews] = useState({
        logo_url: null,
        footer_bg_image_url: null,
        testimonial_bg_image_url: null
    });

    useEffect(() => {
        fetchCompanyInfo();
    }, []);

    const fetchCompanyInfo = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-info/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch company info');
            
            const data = await response.json();
            console.log('compnay info - ' , data)
            setCompanyInfo(data);
            setFormData({
                company_name: data.company_name || '',
                email: data.email || '',
                mobile_1: data.mobile_1 || '',
                mobile_2: data.mobile_2 || '',
                gst_number: data.gst_number || '',
                address_line1: data.address_line1 || '',
                address_line2: data.address_line2 || '',
                city: data.city || '',
                state: data.state || '',
                pincode: data.pincode || '',
                country: data.country || 'India',
                facebook_link: data.facebook_link || '',
                instagram_link: data.instagram_link || '',
                twitter_link: data.twitter_link || '',
                youtube_link: data.youtube_link || '',
                is_active: data.is_active
            });
            setPreviews({
                logo_url: data.logo_url || null,
                footer_bg_image_url: data.footer_bg_image_url || null,
                testimonial_bg_image_url: data.testimonial_bg_image_url || null
            });
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load company information');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            if (file) {
                setImageFiles(prev => ({
                    ...prev,
                    [name]: file
                }));
                // Create preview URL
                const previewUrl = URL.createObjectURL(file);
                setPreviews(prev => ({
                    ...prev,
                    [`${name}_url`]: previewUrl
                }));
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

            // Append image files if they exist
            Object.keys(imageFiles).forEach(key => {
                if (imageFiles[key]) {
                    form.append(key, imageFiles[key]);
                }
            });

            // Use the correct endpoint based on whether we're creating or updating
            let url = `${process.env.NEXT_PUBLIC_API_URL}/company-info/`;
            let method = 'POST';

            if (companyInfo && companyInfo.id) {
                url = `${process.env.NEXT_PUBLIC_API_URL}/company-info/${companyInfo.id}/`;
                method = 'PATCH';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });
            const data = await response.json();
            if (!response.ok){
                console.log(' update error - ' , data)
                throw new Error(data || 'Failed to save company info');
                }

            toast.success('Company information saved successfully');
            fetchCompanyInfo(); // Refresh data
        } catch (error) {
            console.log('Error:', error);
            toast.error(error.message || 'Failed to save company information');
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
            <h1 className="text-2xl font-bold mb-6">Company Information</h1>

            <form onSubmit={handleSubmit} className="space-y-6" >
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <BuildingOffice2Icon className="h-6 w-6 mr-2" />
                        Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Company Name *</label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Logo</label>
                            <input
                                type="file"
                                name="logo"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full"
                            />
                            {previews.logo_url && (
                                <div className="mt-2">
                                    <Image
                                        src={previews.logo_url}
                                        alt="Company Logo"
                                        width={100}
                                        height={100}
                                        className="rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">GST Number</label>
                            <input
                                type="text"
                                name="gst_number"
                                value={formData.gst_number}
                                onChange={handleChange}
                                placeholder="22AAAAA0000A1Z5"
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <PhoneIcon className="h-6 w-6 mr-2" />
                        Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Primary Mobile *</label>
                            <input
                                type="text"
                                name="mobile_1"
                                value={formData.mobile_1}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Secondary Mobile</label>
                            <input
                                type="text"
                                name="mobile_2"
                                value={formData.mobile_2}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <MapPinIcon className="h-6 w-6 mr-2" />
                        Address Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                            <input
                                type="text"
                                name="address_line1"
                                value={formData.address_line1}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Address Line 2</label>
                            <input
                                type="text"
                                name="address_line2"
                                value={formData.address_line2}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">City *</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">State *</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Pincode *</label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <EnvelopeIcon className="h-6 w-6 mr-2" />
                        Social Media Links
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Facebook</label>
                            <input
                                type="url"
                                name="facebook_link"
                                value={formData.facebook_link}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://facebook.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Instagram</label>
                            <input
                                type="url"
                                name="instagram_link"
                                value={formData.instagram_link}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Twitter</label>
                            <input
                                type="url"
                                name="twitter_link"
                                value={formData.twitter_link}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://twitter.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">YouTube</label>
                            <input
                                type="url"
                                name="youtube_link"
                                value={formData.youtube_link}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Website Images */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <DocumentTextIcon className="h-6 w-6 mr-2" />
                        Website Images
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Footer Background</label>
                            <input
                                type="file"
                                name="footer_bg_image"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full"
                            />
                            {previews.footer_bg_image_url && (
                                <div className="mt-2">
                                    <Image
                                        src={previews.footer_bg_image_url}
                                        alt="Footer Background"
                                        width={200}
                                        height={100}
                                        className="rounded-lg object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Testimonial Background</label>
                            <input
                                type="file"
                                name="testimonial_bg_image"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full"
                            />
                            {previews.testimonial_bg_image_url && (
                                <div className="mt-2">
                                    <Image
                                        src={previews.testimonial_bg_image_url}
                                        alt="Testimonial Background"
                                        width={200}
                                        height={100}
                                        className="rounded-lg object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

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
                        ) : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyInfoForm;