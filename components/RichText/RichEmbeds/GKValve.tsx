"use client"
import ValveRoutes from "@/data/GKValves.json"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { slugify } from "@/utils/functions"
import { useEffect, useState } from "react"

const locations = [
  'Armory',
  'Infirmary',
  'Department Store',
  'Supply Depot',
  'Dragon Command',
  'Tank Factory'
]

type valveRoutes = typeof ValveRoutes
interface Location {
  name: string
  value: number | null
}

export default function GKValve() {
  const [values, setValues] = useState({
    firstValue: '',
    secondValue: ''
  })
  const [currentLocations, setCurrentLocations] = useState<Location[]>([])

  useEffect(() => {
    const getRoute = () => {
      const searchString = `${values.firstValue} to ${values.secondValue}`
      const entries: Location[] = []
      for (const key in ValveRoutes) {
        if (searchString === key) {
          const route = ValveRoutes[key as keyof valveRoutes]
          const entry = Object.entries(route)
          entry.forEach(entry => {
            const [location, value] = entry
            entries.push({
              name: location,
              value: value
            })
          })
        }
      }

      setCurrentLocations(entries)
    }

    if (values.firstValue && values.secondValue) getRoute()
  }, [values])

  return (
    <section className="flex flex-col justify-center items-center gap-8">
      <div className="flex justify-between items-center gap-16 w-full">
        <Select onValueChange={ value => setValues(prevState => ({...prevState, firstValue: value })) }>
          <SelectTrigger className="text-green-700 dark:text-green-500">
            <SelectValue placeholder="Select Green Light Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              { locations.map(location => {
                if (location === values.secondValue) return null
                else return (
                  <SelectItem key={ slugify(location) } value={ location }>
                    { location }
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={ value => setValues(prevState => ({...prevState, secondValue: value })) }>
          <SelectTrigger className="text-pink-700 dark:text-pink-500">
            <SelectValue placeholder="Select Pink Cylinder Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              { locations.map(location => {
                if (location === values.firstValue) return null
                else return (
                  <SelectItem key={ slugify(location) } value={ location }>
                    { location }
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      { currentLocations.length > 0 && (
        <ul className="w-full">
          { currentLocations.map(location => (
            <li key={ location.name }>
              { location.value ? (
                <>
                  Set <strong>{ location.name }</strong> valve to <strong>{ location.value }</strong>
                </>
              ) : (
                <>
                  <strong>{ location.name }</strong> valve has your pink code cylinder 
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}