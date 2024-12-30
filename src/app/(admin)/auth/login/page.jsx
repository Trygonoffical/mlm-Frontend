'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 bg-[#517B54]">
        <div className="relative w-full h-full min-h-[200px] md:min-h-screen">
          <Image
            src="/images/aboutbg.png"
            alt="Login Background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="opacity-50"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
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
            Sign in to your account
          </h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="UserID"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                required
              />
            </div>

            <div className="text-right">
              <Link 
                href="/forgot-password"
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#517B54] text-white rounded-md hover:bg-[#446a47] transition-colors duration-200"
            >
              Login Now
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                New to Herbal Power?{' '}
                <Link 
                  href="/register"
                  className="text-[#517B54] hover:text-[#446a47] font-medium"
                >
                  Create new account
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

export default LoginPage;