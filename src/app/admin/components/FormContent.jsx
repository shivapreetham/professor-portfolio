import React from 'react'
import BasicDetails from './BasicDetails'
import { useUser } from '../Provider'
const FormContent = () => {
  const userInfo = useUser()

  if (!userInfo) return (
    <div className="card w-full max-w-3xl mx-auto bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base mb-4 text-base-content/80">Personal Information</h2>
        <p>Loading...</p>
      </div>
    </div>
  )
  return (
    <div>
      <BasicDetails userInfo={userInfo} />
    </div>
  )
}

export default FormContent
