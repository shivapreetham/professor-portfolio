'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Briefcase, Award, BookOpen, Users, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation */}
      <nav className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="text-2xl font-bold text-primary">Portfolio Hub</div>
        </div>
        <div className="navbar-end gap-2">
          <Button variant="ghost" onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
          <Button variant="primary" onClick={() => window.location.href = '/auth'}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero min-h-[80vh] hero-gradient text-primary-content relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="hero-content text-center max-w-4xl relative z-10">
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
              Build Your Academic Portfolio
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Showcase your research, publications, awards, and achievements in a stunning, professional portfolio. 
              Perfect for academics, researchers, and professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90"
                onClick={() => window.location.href = '/auth'}
              >
                Create Your Portfolio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything You Need</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Create a comprehensive portfolio that highlights all aspects of your academic and professional journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Research Projects */}
            <Card className="hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Research Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base-content/70 text-center">
                  Showcase your research projects with descriptions, banners, video demos, and collaborator information.
                </p>
              </CardContent>
            </Card>

            {/* Publications */}
            <Card className="hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle>Publications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base-content/70 text-center">
                  Display your research papers, abstracts, publication dates, and downloadable PDFs.
                </p>
              </CardContent>
            </Card>

            {/* Awards & Achievements */}
            <Card className="hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-accent" />
                </div>
                <CardTitle>Awards & Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base-content/70 text-center">
                  Highlight your awards, achievements, and recognitions with dates and organizations.
                </p>
              </CardContent>
            </Card>

            {/* Conference Presentations */}
            <Card className="hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-info/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-info" />
                </div>
                <CardTitle>Conference Talks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base-content/70 text-center">
                  Document your conference presentations, speaking engagements, and paper presentations.
                </p>
              </CardContent>
            </Card>

            {/* Blog & Insights */}
            <Card className="hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-warning/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-warning" />
                </div>
                <CardTitle>Blog & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base-content/70 text-center">
                  Share your thoughts, insights, and updates through integrated blog posts.
                </p>
              </CardContent>
            </Card>

            {/* Professional Profile */}
            <Card className="hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-success" />
                </div>
                <CardTitle>Professional Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base-content/70 text-center">
                  Create a comprehensive profile with bio, contact information, and social links.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-base-content/70 mb-12">
              Join researchers and academics who are showcasing their work with Portfolio Hub.
              Create your professional portfolio in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="primary"
                className="text-lg px-12 py-4"
                onClick={() => window.location.href = '/auth'}
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content">
        <div>
          <div className="text-2xl font-bold text-primary mb-2">Portfolio Hub</div>
          <p className="text-base-content/60">
            Professional portfolios for academics and researchers
          </p>
          <p className="text-base-content/60 text-sm">
            © 2024 Portfolio Hub. Built with Next.js and DaisyUI.
          </p>
        </div>
      </footer>
    </div>
  )
}