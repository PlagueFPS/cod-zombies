"use client"
import { Button } from "./ui/button"
import { updateData } from "@/utils/actions"

export default function TempButton() { // TEMP BUTTON FOR DEVELOPMENT DATA REVALIDATION
  return (
    <Button onClick={ async () => updateData() } variant="destructive">
      Revalidate Data
    </Button>
  )
}
