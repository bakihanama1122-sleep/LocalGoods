import React from 'react'

const QuickActionCard = ({Icon,title,description,comingSoon = false}:any) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
      comingSoon 
        ? 'opacity-60 cursor-not-allowed' 
        : 'cursor-pointer'
    }`}>
        {comingSoon && (
          <div className='bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 text-center'>
            Coming Soon
          </div>
        )}
        <div className='p-4 flex items-start gap-3'>
            <Icon className={`w-5 h-5 mt-1 ${
              comingSoon 
                ? 'text-gray-400' 
                : 'text-amber-600'
            }`}/>
            <div className='flex-1'>
                <h4 className={`text-sm font-semibold mb-1 ${
                  comingSoon 
                    ? 'text-gray-500' 
                    : 'text-gray-900'
                }`}>
                    {title}
                </h4>
                <p className={`text-xs ${
                  comingSoon 
                    ? 'text-gray-400' 
                    : 'text-gray-600'
                }`}>
                    {description}
                </p>
            </div>
        </div>
    </div>
  )
}

export default QuickActionCard