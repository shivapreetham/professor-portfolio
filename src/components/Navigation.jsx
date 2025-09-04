'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut, Settings, User, Share2, Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Navigation() {
  const { user, logout } = useAuth()
  const [copying, setCopying] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const copyPortfolioLink = async () => {
    if (!user?.id) return
    
    setCopying(true)
    try {
      const portfolioUrl = `${window.location.origin}/portfolio/${user.id}`
      await navigator.clipboard.writeText(portfolioUrl)
      toast.success('Portfolio link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    } finally {
      setCopying(false)
    }
  }

  const sharePortfolio = async () => {
    if (!user?.id) return
    
    const portfolioUrl = `${window.location.origin}/portfolio/${user.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.name}'s Portfolio`,
          text: `Check out ${user.name}'s academic portfolio`,
          url: portfolioUrl,
        })
      } catch (error) {
        // User cancelled the share
      }
    } else {
      // Fallback to copying
      copyPortfolioLink()
    }
  }

  if (!user) return null

  return (
    <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        <div className="text-xl font-bold text-primary">Portfolio Hub</div>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <div className="menu menu-horizontal px-1">
          <li><a href="/#projects" className="text-base-content/70 hover:text-base-content">Projects</a></li>
          <li><a href="/#publications" className="text-base-content/70 hover:text-base-content">Publications</a></li>
          <li><a href="/#achievements" className="text-base-content/70 hover:text-base-content">Achievements</a></li>
        </div>
      </div>

      <div className="navbar-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 hidden sm:flex" 
          onClick={sharePortfolio}
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 hidden sm:flex" 
          onClick={copyPortfolioLink}
          disabled={copying}
        >
          <Copy className="w-4 h-4" />
          {copying ? 'Copying...' : 'Copy Link'}
        </Button>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            {user.profileImage ? (
              <div className="w-8 rounded-full">
                <img 
                  src={user.profileImage} 
                  alt={user.name}
                  className="rounded-full"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">
                {user.name[0]}
              </div>
            )}
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-300">
            <li className="menu-title px-4 py-2">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-base-content/60">{user.email}</span>
            </li>
            <div className="divider m-0"></div>
            <li>
              <a href="/admin" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Admin Dashboard
              </a>
            </li>
            <li>
              <a href={`/portfolio/${user.id}`} target="_blank" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                View Public Portfolio
              </a>
            </li>
            <li className="sm:hidden">
              <button onClick={sharePortfolio} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Portfolio
              </button>
            </li>
            <div className="divider m-0"></div>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-2 text-error">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}