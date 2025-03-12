import React from 'react'
import {Link} from 'react-router-dom'

const NotFound = () => {
  return (
    <div>
        <section className="flex justify-center items-center h-screen p-16 bg-gray-50 ">
        <div className="container flex flex-col items-center ">
        <div className="flex flex-col gap-6 max-w-md text-center">
            <h2 className="font-extrabold text-9xl text-black relative">
                <span className="sr-only">Error</span>404
                <span className='w-7 h-7 bg-white  absolute rounded-full top-2 left-[220px]'></span>
            </h2>
            <p className="text-2xl md:text-3xl ">Sorry, we couldn't find this page.</p>
           <Link to='/'><div className="px-8 py-4 text-xl font-semibold rounded bg-black text-gray-50 hover:text-gray-200 cursor-pointer">Back to Login</div></Link>
        </div>
    </div>
</section>
    </div>
  )
}

export default NotFound