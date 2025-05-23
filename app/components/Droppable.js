import React from 'react'
import {useDroppable} from '@dnd-kit/core';

export default function Droppable({ children, id }) {
    const {isOver, setNodeRef} = useDroppable({
        id: id || 'droppable',
    });

    const style = {
        color: isOver ? 'green' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className='border-2 border-slate-200 border-dashed hover:border-blue-500'>
            <div className='flex flex-col items-center w-full justify-center h-full p-4'>
                <h2 className='text-lg font-bold'>Buraya bırakın</h2>
                <p className='text-sm text-gray-500'>Sürükleyip bırakmak için burayı kullanın</p>
                <div className='flex flex-col gap-4'>
                    {children}
                </div>
            </div>
        </div>
    );
}
