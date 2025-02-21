// 'use client'

// import { use } from 'react';
// import ProductUpdatePage from '@/components/Products/EditProduct'
// import ProductEditForm from '@/components/Products/ProductEditForm';


// // Page component that receives params
// export default function UpdateProductPage({ params }) {
//     // Use React.use to unwrap the params
//     const slug = use(params).slug;

//     return (
//         // <ProductUpdatePage productSlug={slug} />
//         <ProductEditForm />
//     );
// }

'use client'
import React, { useState, useEffect, useCallback, use } from 'react';
import { toast } from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/navigation';
import { getTokens } from '@/utils/cookies';
import Image from 'next/image';
import { XCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const ProductEditForm = ({ params }) => {
    // const { slug } = params;
    const slug = use(params).slug;
    const router = useRouter();
    const { token } = getTokens();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    // Main product data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        regular_price: '',
        selling_price: '',
        bp_value: 0,
        gst_percentage: 0,
        stock: 0,
        HSN_Code: '',
        is_featured: false,
        is_bestseller: false,
        is_new_arrival: false,
        is_trending: false,
        is_active: true,
        categories: []
    });

    // Meta tag data
    const [metaData, setMetaData] = useState({
        title: '',
        description: '',
        keywords: '',
        og_title: '',
        og_description: '',
        canonical_url: ''
    });

    // Images
    const [existingImages, setExistingImages] = useState([]);
    const [newFeatureImage, setNewFeatureImage] = useState(null);
    const [newGalleryImages, setNewGalleryImages] = useState([]);
    
    // Features and FAQs
    const [features, setFeatures] = useState([{ title: '', content: '' }]);
    const [faqs, setFaqs] = useState([{ title: '', content: '' }]);

    // Fetch product data
    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch product: ${response.status}`);
            }
            
            const product = await response.json();
            
            // Set form data
            setFormData({
                name: product.name || '',
                description: product.description || '',
                regular_price: product.regular_price || '',
                selling_price: product.selling_price || '',
                bp_value: product.bp_value || 0,
                gst_percentage: product.gst_percentage || 0,
                stock: product.stock || 0,
                HSN_Code: product.HSN_Code || '',
                is_featured: product.is_featured || false,
                is_bestseller: product.is_bestseller || false,
                is_new_arrival: product.is_new_arrival || false,
                is_trending: product.is_trending || false,
                is_active: product.is_active || true,
                categories: product.categories?.map(cat => cat) || []
            });
            
            // Set existing images
            if (product.images && product.images.length > 0) {
                setExistingImages(product.images);
            }
            
            // Set features
            if (product.features && product.features.length > 0) {
                setFeatures(product.features.map(f => ({
                    id: f.id,
                    title: f.title || '',
                    content: f.content || ''
                })));
            }
            
            // Set FAQs
            if (product.faq && product.faq.length > 0) {
                setFaqs(product.faq.map(f => ({
                    id: f.id,
                    title: f.title || '',
                    content: f.content || ''
                })));
            } else {
                setFaqs([{ title: '', content: '' }]);
            }
            
            // Fetch meta data if available
            try {
                const metaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meta-tags/?product=${product.id}`);
                if (metaResponse.ok) {
                    const metaDataResult = await metaResponse.json();
                    if (metaDataResult && metaDataResult.length > 0) {
                        const meta = metaDataResult[0];
                        setMetaData({
                            title: meta.title || '',
                            description: meta.description || '',
                            keywords: meta.keywords || '',
                            og_title: meta.og_title || '',
                            og_description: meta.og_description || '',
                            canonical_url: meta.canonical_url || ''
                        });
                    }
                }
            } catch (metaError) {
                console.error('Error fetching meta data:', metaError);
                // Continue without meta data
            }
            
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product data');
            router.push('/auth/dashboard/product');
        } finally {
            setLoading(false);
        }
    }, [slug, router]);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        }
    };

    // Load data on mount
    useEffect(() => {
        fetchCategories();
        fetchProduct();
    }, [fetchProduct]);

    // Editor content
    const handleEditorChange = (content) => {
        setFormData(prev => ({
            ...prev,
            description: content
        }));
    };

    // Handle main form data changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle meta data changes
    const handleMetaChange = (e) => {
        const { name, value } = e.target;
        setMetaData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle features
    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFeatures(newFeatures);
    };

    const addFeature = () => {
        setFeatures(prev => [...prev, { title: '', content: '' }]);
    };

    const removeFeature = (index) => {
        setFeatures(prev => prev.filter((_, i) => i !== index));
    };

    // Handle FAQs
    const handleFaqChange = (index, field, value) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setFaqs(newFaqs);
    };

    const addFaq = () => {
        setFaqs(prev => [...prev, { title: '', content: '' }]);
    };

    const removeFaq = (index) => {
        setFaqs(prev => prev.filter((_, i) => i !== index));
    };

    // Image handling
    const handleFeatureImageChange = (e) => {
        if (e.target.files[0]) {
            setNewFeatureImage(e.target.files[0]);
        }
    };

    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setNewGalleryImages(prev => [...prev, ...files]);
    };

    const removeNewGalleryImage = (index) => {
        setNewGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (imageId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/delete_image/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image_id: imageId })
            });

            if (response.ok) {
                toast.success('Image removed successfully');
                setExistingImages(prev => prev.filter(img => img.id !== imageId));
            } else {
                toast.error('Failed to remove image');
            }
        } catch (error) {
            console.error('Error removing image:', error);
            toast.error('Error removing image');
        }
    };

    const setFeatureImage = async (imageId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/set_feature_image/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image_id: imageId })
            });

            if (response.ok) {
                toast.success('Feature image set successfully');
                // Update the existing images to reflect the change
                setExistingImages(prev => prev.map(img => ({
                    ...img,
                    is_feature: img.id === imageId
                })));
            } else {
                toast.error('Failed to set feature image');
            }
        } catch (error) {
            console.error('Error setting feature image:', error);
            toast.error('Error setting feature image');
        }
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const form = new FormData();

        // Add main product data
        Object.keys(formData).forEach(key => {
            if (key === 'categories') {
                // Handle categories separately
                formData.categories.forEach(categoryId => {
                    form.append('categories', categoryId);
                });
            } else {
                if (typeof formData[key] === 'boolean') {
                    form.append(key, formData[key].toString());
                } else {
                    form.append(key, formData[key]);
                }
            }
        });

        // Add meta tag data
        Object.keys(metaData).forEach(key => {
            if (metaData[key]) {
                form.append(`meta_${key}`, metaData[key]);
            }
        });

        // Add new feature image
        if (newFeatureImage) {
            form.append('uploaded_images', newFeatureImage);
        }

        // Add new gallery images
        newGalleryImages.forEach(image => {
            form.append('uploaded_images', image);
        });

        // Handle features
        if (features.length > 0) {
            const featureList = features
                .filter(feature => feature.title.trim() || feature.content.trim())
                .map(feature => ({
                    title: feature.title.trim(),
                    content: feature.content.trim()
                }));

            if (featureList.length > 0) {
                form.append('feature_list', JSON.stringify(featureList));
            }
        }

        // Handle FAQs
        if (faqs.length > 0) {
            const faqList = faqs
                .filter(faq => faq.title.trim() || faq.content.trim())
                .map(faq => ({
                    title: faq.title.trim(),
                    content: faq.content.trim()
                }));

            if (faqList.length > 0) {
                form.append('faq_list', JSON.stringify(faqList));
            }
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });

            if (response.ok) {
                toast.success('Product updated successfully');
                router.push('/auth/dashboard/product');
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || 'Error updating product');
                console.error('Error updating product:', errorData);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Error updating product');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className='flex justify-between mb-5 align-middle'>
                <h1 className="text-2xl font-bold mb-6">Edit Product: {formData.name}</h1>
                <a href='/auth/dashboard/product' className="bg-gray-600 text-white rounded hover:bg-gray-700 pt-4 px-4">
                    Back to Products
                </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">HSN Code</label>
                            <input
                                type="text"
                                name="HSN_Code"
                                value={formData.HSN_Code}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className='mt-2'>
                            <label className="block mb-1">Description</label>
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
                                value={formData.description}
                                onEditorChange={handleEditorChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing and Stock */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Pricing and Stock</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1">Regular Price</label>
                            <input
                                type="number"
                                name="regular_price"
                                value={formData.regular_price}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Selling Price</label>
                            <input
                                type="number"
                                name="selling_price"
                                value={formData.selling_price}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">BP Value</label>
                            <input
                                type="number"
                                name="bp_value"
                                value={formData.bp_value}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">GST Percentage</label>
                            <input
                                type="number"
                                name="gst_percentage"
                                value={formData.gst_percentage}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                step="0.01"
                            />
                        </div>
                    </div>
                </div>

                {/* SEO Meta Tags */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">SEO Meta Tags</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Meta Title</label>
                            <input
                                type="text"
                                name="title"
                                value={metaData.title}
                                onChange={handleMetaChange}
                                className="w-full p-2 border rounded"
                                placeholder="SEO title (leave empty to use product name)"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Meta Description</label>
                            <textarea
                                name="description"
                                value={metaData.description}
                                onChange={handleMetaChange}
                                className="w-full p-2 border rounded"
                                rows="2"
                                placeholder="SEO description (recommended 150-160 characters)"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block mb-1">Keywords</label>
                            <input
                                type="text"
                                name="keywords"
                                value={metaData.keywords}
                                onChange={handleMetaChange}
                                className="w-full p-2 border rounded"
                                placeholder="Comma-separated keywords"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Canonical URL</label>
                            <input
                                type="text"
                                name="canonical_url"
                                value={metaData.canonical_url}
                                onChange={handleMetaChange}
                                className="w-full p-2 border rounded"
                                placeholder="https://example.com/product/..."
                            />
                        </div>
                        <div>
                            <label className="block mb-1">OG Title</label>
                            <input
                                type="text"
                                name="og_title"
                                value={metaData.og_title}
                                onChange={handleMetaChange}
                                className="w-full p-2 border rounded"
                                placeholder="Open Graph title for social sharing"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">OG Description</label>
                            <textarea
                                name="og_description"
                                value={metaData.og_description}
                                onChange={handleMetaChange}
                                className="w-full p-2 border rounded"
                                rows="2"
                                placeholder="Open Graph description for social sharing"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map(category => (
                            <label key={category.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.categories.includes(category.id)}
                                    onChange={(e) => {
                                        const newCategories = e.target.checked
                                            ? [...formData.categories, category.id]
                                            : formData.categories.filter(id => id !== category.id);
                                        setFormData(prev => ({ ...prev, categories: newCategories }));
                                    }}
                                />
                                <span>{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Display Options */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Display Options</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                            />
                            <span>Featured</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is_bestseller"
                                checked={formData.is_bestseller}
                                onChange={handleChange}
                            />
                            <span>Bestseller</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is_new_arrival"
                                checked={formData.is_new_arrival}
                                onChange={handleChange}
                            />
                            <span>New Arrival</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is_trending"
                                checked={formData.is_trending}
                                onChange={handleChange}
                            />
                            <span>Trending</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                            <span>Active</span>
                        </label>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Product Images</h2>
                    
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3">Current Images</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {existingImages.map((image) => (
                                    <div key={image.id} className="relative">
                                        <div className={`border-2 rounded-lg overflow-hidden ${image.is_feature ? 'border-green-500' : 'border-gray-300'}`}>
                                            <div className="relative h-40 w-full">
                                                <Image
                                                    src={image.image}
                                                    alt={image.alt_text || 'Product image'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-2 bg-white">
                                                <div className="flex justify-between items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFeatureImage(image.id)}
                                                        className={`text-xs px-2 py-1 rounded ${
                                                            image.is_feature 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {image.is_feature ? 'Featured' : 'Set as Featured'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(image.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* New Feature Image */}
                    <div className="mb-4">
                        <label className="block mb-1">Add New Feature Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFeatureImageChange}
                            className="w-full p-2 border rounded"
                        />
                        {newFeatureImage && (
                            <div className="mt-2">
                                <div className="relative w-32 h-32">
                                    <Image
                                        src={URL.createObjectURL(newFeatureImage)}
                                        alt="New Feature"
                                        fill
                                        className="object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setNewFeatureImage(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <XCircleIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                
                    {/* New Gallery Images */}
                    <div>
                        <label className="block mb-1">Add More Gallery Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleGalleryImagesChange}
                            className="w-full p-2 border rounded"
                        />
                        {newGalleryImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {newGalleryImages.map((file, index) => (
                                    <div key={index} className="relative">
                                        <div className="border rounded-lg overflow-hidden">
                                            <div className="relative h-40 w-full">
                                                <Image
                                                    src={URL.createObjectURL(file)}
                                                    alt={`New Gallery ${index}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeNewGalleryImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <XCircleIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Product Features</h2>
                    {features.map((feature, index) => (
                        <div key={index} className="mb-4 p-4 border rounded">
                            <div className="flex justify-between mb-2">
                                <h3>Feature {index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={feature.title}
                                    onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                    placeholder="Feature Title"
                                    className="w-full p-2 border rounded"
                                />
                                {/* <textarea
                                    value={feature.content}
                                    onChange={(e) => handleFeatureChange(index, 'content', e.target.value)}
                                    placeholder="Feature Content"
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                /> */}
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                    init={{
                                        height: 200,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 
                                            'charmap', 'preview', 'anchor', 'searchreplace', 
                                            'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic | alignleft aligncenter alignright | ' +
                                            'bullist numlist outdent indent | help'
                                    }}
                                    value={feature.content}
                                    onEditorChange={(content) => handleFeatureChange(index, 'content', content)}
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFeature}
                        className="w-full p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                        Add Feature
                    </button>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Product FAQs</h2>
                    {faqs.map((faq, index) => (
                        <div key={index} className="mb-4 p-4 border rounded">
                            <div className="flex justify-between mb-2">
                                <h3>FAQ {index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeFaq(index)}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={faq.title}
                                    onChange={(e) => handleFaqChange(index, 'title', e.target.value)}
                                    placeholder="Question"
                                    className="w-full p-2 border rounded"
                                />
                                {/* <textarea
                                    value={faq.content}
                                    onChange={(e) => handleFaqChange(index, 'content', e.target.value)}
                                    placeholder="Answer"
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                /> */}
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                    init={{
                                        height: 200,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 
                                            'charmap', 'preview', 'anchor', 'searchreplace', 
                                            'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic | alignleft aligncenter alignright | ' +
                                            'bullist numlist outdent indent | help'
                                    }}
                                    value={faq.content}
                                    onEditorChange={(content) => handleFaqChange(index, 'content', content)}
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFaq}
                        className="w-full p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                        Add FAQ
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => router.push('/auth/dashboard/product')}
                        className="p-3 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="p-3 px-6 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Updating...' : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductEditForm;