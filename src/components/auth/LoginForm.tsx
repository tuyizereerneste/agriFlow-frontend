import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface LoginResponse {
  token: string;
}

interface DecodedToken {
  id: string;
  role?: string;
  type: string;
  exp: number;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>('http://localhost:5000/auth/login', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);

      const decoded = jwtDecode<DecodedToken>(token);
      console.log('Decoded token:', decoded);

      if (decoded.role === 'Admin') {
        console.log('Navigating to /admin/dashboard'); // Debugging line
        navigate('/admin/dashboard');
      } else if (decoded.type === 'company') {
        console.log('Navigating to /company/overview'); // Debugging line
        navigate('/company/overview');
      } else if (decoded.role === 'Volunteer') {
        console.log('Navigating to /volunteer'); // Debugging line
        navigate('/volunteer');
      } else {
        console.log('Navigating to /login'); // Debugging line
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({
        form: error.response?.data?.message || 'Invalid email or password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.form}</p>
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        name="email"
        id="email"
        autoComplete="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        leftIcon={<Mail size={18} />}
        required
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<Lock size={18} />}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 top-[36px] flex items-center text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Forgot your password?</a>
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;
