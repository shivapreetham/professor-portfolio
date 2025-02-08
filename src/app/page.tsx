// src/app/page.tsx
import { AboutSection } from '@/components/sections/about'
import { ProjectsSection } from '@/components/sections/projects'
import { PapersSection } from '@/components/sections/papers'
import { ConferencesSection } from '@/components/sections/conferences'
import { AchievementsSection } from '@/components/sections/achievements'
import { BlogSection } from '@/components/sections/blog'
import { TeachingSection } from '@/components/sections/teaching'
import { AwardsSection } from '@/components/sections/awards'
import { CollaborationsSection } from '@/components/sections/collaborations'

export default function Home() {
  return (
    <main className="min-h-screen">
      <AboutSection />
      <ProjectsSection />
      <PapersSection />
      <ConferencesSection />
      <AchievementsSection />
      <BlogSection />
      <TeachingSection />
      <AwardsSection />
      <CollaborationsSection />
    </main>
  )
}