import { useState, useEffect } from 'react'
/**
 * 
 * @param breakpoint number used to define a custom breakpoint at which `isDesktop` becomes true. Defaults to 1280
 */
export const useMediaQuery = (breakpoint?: number) => {
  const [isDesktop, setDesktop] = useState(false)

  useEffect(() => {
    const handleWindowResize = () => {
      if (breakpoint) {
        if (window.innerWidth >= breakpoint) setDesktop(true)
        else setDesktop(false)
      } else {
        if (window.innerWidth >= 1280) setDesktop(true)
        else setDesktop(false)
      }
    }

    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [breakpoint])

  return { isDesktop }
}
