'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function RegisterForm({ onSwitchToLogin }) {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    const result = await register(formData.name, formData.email, formData.password)
    
    if (result.success) {
      // Redirect will be handled by parent component
    }
    
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <p className="text-base-content/60">Sign up to build your portfolio</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input input-bordered w-full pl-10 ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter your full name"
                required
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
            </div>
            {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full pl-10"
                placeholder="Enter your email"
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input input-bordered w-full pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                placeholder="Create a password"
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input input-bordered w-full pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Confirm your password"
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="divider">OR</div>

        <div className="text-center">
          <p className="text-base-content/60">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="link link-primary"
            >
              Sign in here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}