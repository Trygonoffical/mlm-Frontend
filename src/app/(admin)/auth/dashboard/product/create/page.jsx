'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/navigation';


const ProductForm = () => {
    // Main product data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        regular_price: '',
        selling_price: '',
        bp_value: 0,
        gst_percentage: 0,
        stock: 0,
        is_featured: false,
        is_bestseller: false,
        is_new_arrival: false,
        is_trending: false,
        is_active: true,
        categories: []
    });

    const router = useRouter();

    // Images and features
    const [featureImage, setFeatureImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [features, setFeatures] = useState([{ title: '', content: '' }]);
    const [categories, setCategories] = useState([]);


    // Editor content
    const handleEditorChange = (content) => {
        setFormData(prev => ({
            ...prev,
            description: content
        }));
    };


    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            toast.error('Error fetching categories');
        }
    };

    // Handle main form data changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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

    // Image handling
    const handleFeatureImageChange = (e) => {
        if (e.target.files[0]) {
            setFeatureImage(e.target.files[0]);
        }
    };

    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setGalleryImages(prev => [...prev, ...files]);
    };

    const removeGalleryImage = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };


    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

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

        // Add categories
        // formData.categories.forEach(catId => {
        //     form.append('categories', catId);
        // });

        // Add feature image
        if (featureImage) {
            form.append('uploaded_images', featureImage);
        }

        // Add gallery images
        galleryImages.forEach(image => {
            form.append('uploaded_images', image);
        });

        // Handle features - send as array of objects
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

        // if (features.length > 0) {
        //     features.forEach((feature, index) => {
        //         form.append(`feature_list[${index}][title]`, feature.title);
        //         form.append(`feature_list[${index}][content]`, feature.content);
        //     });
        // }

        // Debug logs
        console.log('Feature Image:', featureImage);
        console.log('Gallery Images:', galleryImages);
        console.log('Features:', features);

        try {
            const token = Cookies.get('token');
            console.log('Sending form data:', Object.fromEntries(form));
            console.log('ropeo' , token )
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });
            const responseData = await response.json();

        if (response.ok) {
            toast.success('Product created successfully');
            console.log('Created product:', responseData);
            
            // Reset form
            setFormData({
                name: '',
                description: '',
                regular_price: '',
                selling_price: '',
                bp_value: 0,
                gst_percentage: 0,
                stock: 0,
                is_featured: false,
                is_bestseller: false,
                is_new_arrival: false,
                is_trending: false,
                is_active: true,
                categories: []
            });
            setFeatureImage(null);
            setGalleryImages([]);
            setFeatures([{ title: '', content: '' }]);
            router.push('/auth/dashboard/product')
        } else {
            console.log('Error response:', responseData);
            toast.error(responseData.error || 'Error creating product');
        }
    } catch (error) {
        console.log('Submit error:', error);
        toast.error('Error creating product');
    }
    };

    return (
        <div className="p-6">
            <div className='flex justify-between mb-5 align-middle '>
                <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
                <a href='/auth/dashboard/product' className="bg-green-600 text-white rounded hover:bg-green-700 pt-4 px-4"  >All Products</a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                    <div className="">
                        <div>
                            <label className="block mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
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
                    </div>
                </div>



                {/* Images */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Product Images</h2>
                    
                    {/* Feature Image */}
                    <div className="mb-4">
                        <label className="block mb-1">Feature Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFeatureImageChange}
                            className="w-full p-2 border rounded"
                        />
                        {featureImage && (
                            <div className="mt-2">
                                <img
                                    src={URL.createObjectURL(featureImage)}
                                    alt="Feature"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            </div>
                        )}
                    </div>
                
                {/* Gallery Images */}
                <div>
                        <label className="block mb-1">Gallery Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleGalleryImagesChange}
                            className="w-full p-2 border rounded"
                        />
                        {galleryImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-4">
                                {galleryImages.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Gallery ${index}`}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            ×
                                        </button>
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
                                <textarea
                                    value={feature.content}
                                    onChange={(e) => handleFeatureChange(index, 'content', e.target.value)}
                                    placeholder="Feature Content"
                                    className="w-full p-2 border rounded"
                                />
                                 {/* <Editor
                                apiKey="your-tinymce-api-key"
                                init={{
                                    height: 400,
                                    menubar: true,
                                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help'
                                }}
                                value={feature.content}
                                onEditorChange={(e) => handleFeatureChange(index, 'content', e.target.value)}
                            /> */}
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

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Create Product
                </button>
            </form>
        </div>
    );
};

export default ProductForm;