'use client'

import { use } from 'react';
import ProductUpdatePage from '@/components/Products/EditProduct'


// Page component that receives params
export default function UpdateProductPage({ params }) {
    // Use React.use to unwrap the params
    const slug = use(params).slug;

    return (
        <ProductUpdatePage productSlug={slug} />
    );
}