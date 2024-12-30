'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    refId: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.refId.trim()) {
      newErrors.refId = 'Reference ID is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Registration data:', formData);
        // Handle successful registration
      } catch (error) {
        console.error('Registration error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 bg-[#517B54]">
        <div className="relative w-full h-full min-h-[200px] md:min-h-screen">
          <Image
            src="/images/aboutbg.png"
            alt="Registration Background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="opacity-50"
          />
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full md:w-1/2 bg-gray-100 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo.png"
              alt="Herbal Power Logo"
              width={80}
              height={80}
              className="h-20 w-auto"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-8">
            Sign Up to Herbal Power
          </h1>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="refId"
                value={formData.refId}
                onChange={handleChange}
                placeholder="Ref ID"
                className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${
                  errors.refId ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.refId && (
                <p className="text-red-500 text-sm mt-1">{errors.refId}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone No"
                className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#517B54] text-white rounded-md hover:bg-[#446a47] transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Now'}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/login"
                  className="text-[#517B54] hover:text-[#446a47] font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-16 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Herbal Power © 2023 All rights reserved.
            </p>
            <div className="text-xs text-gray-500 space-x-2">
              <Link href="/privacy-policy" className="hover:text-gray-700">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms" className="hover:text-gray-700">
                T&C
              </Link>
              <span>|</span>
              <Link href="/return-policy" className="hover:text-gray-700">
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;