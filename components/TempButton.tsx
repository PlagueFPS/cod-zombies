"use client"

import { Button } from "./ui/button"

export default function TempButton() {
  const onClick = async () => {
    try {
      await fetch('http://localhost:3000/api/revalidate', {
        method: 'POST'
      })
    }
    catch(e) {
      console.error(e)
    }
  }

  return (
    <Button onClick={ onClick } className="mt-8">
      Revalidate Data
    </Button>
  )
}
