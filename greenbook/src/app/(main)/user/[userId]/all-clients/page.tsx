import { AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { getAuthUserDetails } from '@/lib/queries'
import { Role } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import DeleteButton from './_components/delete-button'
import CreateClientButton from './_components/create-client-btn'

type Props = {
  params: { userId: string }
}

const AllClientsPage = async ({ params }: Props) => {
  const user = await getAuthUserDetails()
  if (!user) return

  // For ADMIN and USER roles, get all clients
  // For GUEST role, only get their assigned clients
  const accessibleClients = user.role === Role.GUEST
    ? user.clientUsers.map(cu => ({
        ...cu.client,
        role: cu.role
      }))
    : [
        ...user.clients.map(client => ({
          ...client,
          role: 'ADMIN' as Role
        })),
        ...user.clientUsers.map(cu => ({
          ...cu.client,
          role: cu.role
        }))
      ].reduce((unique, client) => {
        const exists = unique.find(u => u.id === client.id)
        if (!exists) {
          unique.push(client)
        }
        return unique
      }, [] as any[])

  return (
    <AlertDialog>
      <div className="flex flex-col">
        <CreateClientButton
          user={user}
          className="w-[200px] self-end m-20"
        />
        <Command className="rounded-lg bg-transparent">
          <CommandInput placeholder="Search Clients..." />
          <CommandList>
            <CommandEmpty>No Results Found.</CommandEmpty>
            <CommandGroup heading="Clients">
              {accessibleClients.length > 0 ? (
                accessibleClients.map((client) => (
                  <CommandItem
                    key={client.id}
                    className="h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                  >
                    <Link
                      href={`/client/${client.id}`}
                      className="flex gap-4 w-full h-full"
                    >
                      <div className="relative w-32">
                        <Image
                          src={client.companyLogo || '/assets/default-company.svg'}
                          alt="client logo"
                          fill
                          className="rounded-md object-contain bg-muted/50 p-4"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                          <p className="font-semibold">{client.companyName}</p>
                          <p className="text-muted-foreground text-xs">
                            {client.address}
                          </p>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Role: {client.role}
                        </p>
                      </div>
                    </Link>
                    {(user.role === Role.ADMIN || client.role === Role.USER) && (
                      <AlertDialogTrigger asChild>
                        <Button
                          size={'sm'}
                          variant={'destructive'}
                          className="w-20 hover:bg-red-600 hover:text-white !text-white"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                    )}
                    {(user.role === Role.ADMIN || client.role === Role.USER) && (
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-left">
                            Are your absolutely sure
                          </AlertDialogTitle>
                          <AlertDescription className="text-left">
                            This action cannot be undone. This will delete the
                            client and all data related to the client.
                          </AlertDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex items-center">
                          <AlertDialogCancel className="mb-2">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive hover:bg-destructive">
                            <DeleteButton clientId={client.id} clientName={client.companyName} />
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    )}
                  </CommandItem>
                ))
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  No Clients
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  )
}

export default AllClientsPage
