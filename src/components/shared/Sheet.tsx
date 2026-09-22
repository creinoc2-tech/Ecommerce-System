import React, { useEffect, useRef } from 'react'
import { useGlobalStore } from '../../store/global.state'
import { Cart } from './Cart'
import { Search } from './Search'

export const Sheet = () => {
     const sheetContext = useGlobalStore(state => state.sheetContext)
     const closeSheet = useGlobalStore(state => state.closeSheet)

     const sheetRef = useRef<HTMLDivElement | null>(null);

     useEffect( () => {
        document.body.style.overflow = "hidden";
        const handleClickOutside = (event: MouseEvent) => {
            if(sheetRef.current &&  !sheetRef.current.contains(event.target as Node)) {
                closeSheet();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("mousedown", handleClickOutside);
        }

       
     }, [closeSheet])

     const renderContent = () => {
        switch(sheetContext) {
            case "cart":
                return <Cart />;
            case "search":
                return <Search />;
            default:
                return null;
        }
    }

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex justify-end'>
        <div ref={sheetRef} className='bg-white text-black h-screen w-[500px]
         shadow-lg'>
          {renderContent()}
        </div>
    </div>
  )
}
