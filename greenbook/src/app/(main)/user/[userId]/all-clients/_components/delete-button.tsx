'use client'
import { deleteClient } from '@/lib/queries'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  clientId: string
  clientName: string
}

const DeleteButton = ({ clientId, clientName }: Props) => {
  const router = useRouter()

  return (
    <div
      className="text-white"
      onClick={async () => {
        await deleteClient(clientId)
        router.refresh()
      }}
    >
      Delete Client
    </div>
  )
}

export default DeleteButton
