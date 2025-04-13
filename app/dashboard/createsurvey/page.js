import React from 'react'
import Question from '@/app/components/Question'
import InputQuestion from '@/app/components/InputQuestion'
import AudioRecorder from '@/app/components/AudioRecorder'

export default function Dashboard() {
  return (
    <div className='p-4 md:p-6 flex flex-col gap-4'>
      <Question/>
      <InputQuestion/>
      <AudioRecorder/>
    </div>
  )
}
