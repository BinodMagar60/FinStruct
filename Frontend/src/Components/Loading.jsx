import React from 'react'

const Loading = () => {
  return (
    <div class="flex gap-2 absolute z-100 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
    <div class='h-5 w-5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
	<div class='h-5 w-5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
	<div class='h-5 w-5 bg-black rounded-full animate-bounce'></div>
    <div class='h-5 w-5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
	
    </div>




  )
}

export default Loading