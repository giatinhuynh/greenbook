'use client'
import ClientDetails from '@/components/forms/client-details'
import CustomModal from '@/components/global/custom-modal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import { User } from '@prisma/client'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
  user: User
  className?: string
}

const CreateClientButton = ({ className, user }: Props) => {
  const { setOpen } = useModal()

  return (
    <Button
      className={twMerge('w-full flex gap-4', className)}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create a Client"
            subheading="Add a new client to your dashboard"
          >
            <ClientDetails
              user={user}
            />
          </CustomModal>
        )
      }}
    >
      <PlusCircleIcon size={15} />
      Create Client
    </Button>
  )
}

export default CreateClientButton