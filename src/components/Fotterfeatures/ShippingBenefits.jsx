import React from 'react'
import { Truck, ShieldCheck, Award, HeadphonesIcon } from 'lucide-react';

const ShippingBenefits = () => {
    const shippingBenefits = [
        { 
            id: 1, 
            title: "Free Shipping", 
            description: "Free delivery across India on all orders",
            icon: <Truck className="w-6 h-6" />
        },
        { 
            id: 2, 
            title: "Secure Payment", 
            description: "Multiple secure payment options available",
            icon: <ShieldCheck className="w-6 h-6" />
        },
        { 
            id: 3, 
            title: "FSSAI Approved", 
            description: "All products are FSSAI certified and safe",
            icon: <Award className="w-6 h-6" />
        },
        { 
            id: 4, 
            title: "24/7 Support", 
            description: "Customer support available round the clock",
            icon: <HeadphonesIcon className="w-6 h-6" />
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8" >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                {shippingBenefits.map((benefit) => (
                    <div
                        key={benefit.id}
                        className="bg-green-600 text-white p-6 rounded-xl flex items-center gap-4 hover:bg-green-700 transition-colors"
                    >
                        <div className="bg-white/20 p-3 rounded-full">
                            {benefit.icon}
                        </div>
                        <div>
                            <h4 className="font-semibold">{benefit.title}</h4>
                            <p className="text-sm text-white/80">{benefit.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ShippingBenefits