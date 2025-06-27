"use client"
import { useState } from "react"
import { TerminusCodeSchema } from "@/utils/validation-schemas"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TerminusCode() {
  const [values, setValues] = useState({ x: '', y: '', z: '' })

  const solveEquations = (values: { x: string, y: string, z: string }) => {
    const validValues = TerminusCodeSchema.safeParse(values)
    if (!validValues.success) {
      console.error(validValues.error.flatten().fieldErrors)
      toast.error(`Invalid Values. Only positive, single digit, or double digit numbers are allowed.`)
      return
    }

    const { x, y, z } = validValues.data
    const firstEquation = (2 * x) + 11
    const secondEquation = (2 * z + y) - 5
    const thirdEquation = Math.abs((y + z) - x)
    
    return `${firstEquation}, ${secondEquation}, ${thirdEquation}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({...prev, [name]: value }))
  }

  return (
    <Card className="flex flex-col justify-center items-center bg-transparent shadow-lg dark:shadow-none w-full max-w-[360px] pt-4 mx-auto">
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {['x', 'y', 'z'].map((letter, index) => (
            <div key={ `${letter}_${index}` } className="flex flex-col items-center">
              <Label htmlFor={ letter } className="text-sm mb-1 capitalize">
                { letter }
              </Label>
              <Input
                type="text"
                id={ letter }
                name={ letter }
                value={ values[letter as keyof typeof values] }
                onChange={ handleInputChange }
                placeholder="00"
                className="text-center w-16 h-12 text-lg"
                maxLength={ 2 }
              />
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-base">
          { Object.values(values).every(Boolean) ? (
            <>
              <span>Your Code:</span>
              <span className="ml-1 font-bold">
                { solveEquations(values) }
              </span>
            </>
            ) : "Enter your values" }
        </div>
      </CardContent>
    </Card>
  )
}
