'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { setTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setTokens(data.token ,data.refresh )
        // Set cookies
        // Cookies.set('token', data.token, {
        //   secure: process.env.NODE_ENV === 'production',
        //   sameSite: 'strict',
        //   expires: 1 // 1 day
        // });
        // Cookies.set('refresh', data.refresh, {
        //   secure: process.env.NODE_ENV === 'production',
        //   sameSite: 'strict',
        //   expires: 7 // 7 days
        // });

        // Redirect based on role
        let redirectPath = '/';
        if (data.role === 'MLM_MEMBER') {
          redirectPath = '/mu/dashboard';
        } else if (data.role === 'ADMIN') {
          redirectPath = '/auth/dashboard';
        } else {
          toast.error('Please use phone number login for customer access');
          return;
        }

        toast.success('Login successful!');
        router.push(redirectPath);
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            src="/Images/aboutbg.png"
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
              src="/Images/logo.png"
              alt="Herbal Power Logo"
              width={80}
              height={80}
              className="h-20 w-auto"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-8">
            MLM Member/Admin Login
          </h1>

          {/* Customer Login Link */}
          <div className="text-center mb-6">
            <Link 
              href="/" 
              className="text-[#517B54] hover:text-[#446a47]"
            >
              Click here for Customer Login
            </Link>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
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
                href="/auth/forgot-password"
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-[#517B54] text-white rounded-md hover:bg-[#446a47] transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login Now'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-16 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Herbal Power © {new Date().getFullYear()} All rights reserved.
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