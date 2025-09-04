'use client'

import { useDataSync } from '@/contexts/DataSyncContext'
import { toast } from 'react-hot-toast'

export const useAdminActions = () => {
  const { triggerRefresh, refreshDataType } = useDataSync()

  const executeWithRefresh = async (action, options = {}) => {
    const { 
      successMessage = 'Changes saved successfully!',
      errorMessage = 'Failed to save changes',
      dataType = null,
      showToast = true 
    } = options

    try {
      const result = await action()
      
      if (showToast) {
        toast.success(successMessage)
      }

      // Trigger refresh
      if (dataType) {
        refreshDataType(dataType)
      } else {
        triggerRefresh()
      }

      return result
    } catch (error) {
      console.error('Admin action error:', error)
      
      if (showToast) {
        toast.error(errorMessage)
      }
      
      throw error
    }
  }

  // Specific methods for different data types
  const saveProject = (projectAction) => 
    executeWithRefresh(projectAction, {
      successMessage: 'Project saved successfully!',
      errorMessage: 'Failed to save project',
      dataType: 'projects'
    })

  const saveResearchPaper = (paperAction) => 
    executeWithRefresh(paperAction, {
      successMessage: 'Research paper saved successfully!',
      errorMessage: 'Failed to save research paper',
      dataType: 'researchPapers'
    })

  const saveConference = (conferenceAction) => 
    executeWithRefresh(conferenceAction, {
      successMessage: 'Conference saved successfully!',
      errorMessage: 'Failed to save conference',
      dataType: 'conferences'
    })

  const saveAchievement = (achievementAction) => 
    executeWithRefresh(achievementAction, {
      successMessage: 'Achievement saved successfully!',
      errorMessage: 'Failed to save achievement',
      dataType: 'achievements'
    })

  const saveBlogPost = (blogAction) => 
    executeWithRefresh(blogAction, {
      successMessage: 'Blog post saved successfully!',
      errorMessage: 'Failed to save blog post',
      dataType: 'blogPosts'
    })

  const saveAward = (awardAction) => 
    executeWithRefresh(awardAction, {
      successMessage: 'Award saved successfully!',
      errorMessage: 'Failed to save award',
      dataType: 'awards'
    })

  const saveUserProfile = (profileAction) => 
    executeWithRefresh(profileAction, {
      successMessage: 'Profile updated successfully!',
      errorMessage: 'Failed to update profile',
      dataType: 'user'
    })

  const deleteItem = (deleteAction, itemType) => 
    executeWithRefresh(deleteAction, {
      successMessage: `${itemType} deleted successfully!`,
      errorMessage: `Failed to delete ${itemType.toLowerCase()}`,
    })

  return {
    executeWithRefresh,
    saveProject,
    saveResearchPaper,
    saveConference,
    saveAchievement,
    saveBlogPost,
    saveAward,
    saveUserProfile,
    deleteItem,
    triggerRefresh,
    refreshDataType
  }
}