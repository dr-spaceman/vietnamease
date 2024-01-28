'use client'

import { Button, CommonButtonProps } from 'matterial'
import { useFormStatus } from 'react-dom'

export function SubmitButton(props: CommonButtonProps) {
  const { pending } = useFormStatus()

  return <Button {...props} type="submit" loading={pending} />
}
