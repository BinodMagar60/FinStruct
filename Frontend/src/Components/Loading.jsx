import React from 'react'

const Loading = () => {
  return (
    <div className='absolute z-10 w-full h-screen bg-transparent'>
      <div class="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-black absolute z-99 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"></div>
    </div>
  )
}

export default Loading