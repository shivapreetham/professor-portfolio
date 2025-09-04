'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginForm({ onSwitchToRegister }) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(formData.email, formData.password)
    
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
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <p className="text-base-content/60">Sign in to your account</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="input input-bordered w-full pl-10 pr-10"
                placeholder="Enter your password"
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
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="divider">OR</div>

        <div className="text-center">
          <p className="text-base-content/60">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="link link-primary"
            >
              Sign up here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}