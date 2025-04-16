import { draftMode } from 'next/headers'
import DraftModeButton from './DraftMode.client'

export default async function DraftMode() {
  const { isEnabled } = await draftMode()
  return (
    <DraftModeButton draftMode={ isEnabled } /> 
  )
}
