'use client'

import { useAdminActions } from '@/hooks/useAdminActions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import IframeRefresh from '@/components/admin/IframeRefresh'

export default function TestSyncPage() {
  const { triggerRefresh, refreshDataType } = useAdminActions()

  const testRefresh = () => {
    console.log('Triggering manual refresh...')
    triggerRefresh()
  }

  const testProjectRefresh = () => {
    console.log('Triggering project-specific refresh...')
    refreshDataType('projects')
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Real-time Sync Test</CardTitle>
          <p className="text-base-content/70">
            Test the real-time synchronization between admin panel and portfolio view
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testRefresh} variant="primary">
              Trigger Full Refresh
            </Button>
            <Button onClick={testProjectRefresh} variant="secondary">
              Refresh Projects Only
            </Button>
          </div>
          
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>
              Click these buttons to test if the iframe below refreshes automatically. 
              In the actual admin panel, these refreshes happen automatically when you save data.
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Preview (iframe)</CardTitle>
          <p className="text-base-content/70">
            This iframe should automatically refresh when you trigger updates above
          </p>
        </CardHeader>
        <CardContent>
          <div className="border border-base-300 rounded-lg overflow-hidden">
            <IframeRefresh
              src="/"
              className="w-full h-[600px] border-0"
              title="Portfolio Preview"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <h4>Real-time Synchronization Flow:</h4>
          <ol>
            <li><strong>Admin Action:</strong> User edits data in admin panel</li>
            <li><strong>Save & Trigger:</strong> Data is saved to database and refresh is triggered</li>
            <li><strong>Context Update:</strong> DataSyncContext notifies all registered callbacks</li>
            <li><strong>Iframe Refresh:</strong> Portfolio iframe automatically reloads to show new data</li>
            <li><strong>User Sees Changes:</strong> Admin panel and portfolio stay in sync</li>
          </ol>
          
          <h4>Components Involved:</h4>
          <ul>
            <li><code>DataSyncContext</code> - Manages refresh state and callbacks</li>
            <li><code>useAdminActions</code> - Hook for admin components to trigger refreshes</li>
            <li><code>IframeRefresh</code> - Smart iframe component that listens for refresh signals</li>
            <li><code>Provider</code> - Updated to listen for refresh signals</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}