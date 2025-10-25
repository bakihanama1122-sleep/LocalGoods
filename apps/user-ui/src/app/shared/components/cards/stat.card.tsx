import React from 'react'

const StatCard = ({title,count,Icon}:any) => {
  return (
    <div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow'>
        <div>
            <h3 className='text-sm text-gray-500 font-medium mb-1'>
                {title}
            </h3>
            <p className='text-2xl font-bold text-gray-900'>
              {count}  
            </p>
        </div>
        <div className='p-3 bg-amber-50 rounded-lg'>
            <Icon className="w-8 h-8 text-amber-600" />
        </div>
    </div>
  );
};

export default StatCard