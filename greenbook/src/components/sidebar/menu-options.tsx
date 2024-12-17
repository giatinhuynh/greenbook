'use client'

import {
  Agency,
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
} from '@prisma/client'
import React, { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from 'lucide-react'
import clsx from 'clsx'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import Link from 'next/link'
import { Separator } from '../ui/separator'
import { icons } from '@/lib/constants'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '../global/custom-modal'
import SubAccountDetails from '../forms/subaccount-details'

type Props = {
  defaultOpen?: boolean
  subAccounts: SubAccount[]
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[]
  sidebarLogo: string
  details: any
  user: any
}

const MenuOptions = ({
  details,
  sidebarLogo,
  sidebarOpt,
  subAccounts,
  user,
  defaultOpen,
}: Props) => {
  const { setOpen } = useModal()
  const [isMounted, setIsMounted] = useState(false)

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Sheet modal={false} {...openState}>
      {/* Sheet Trigger */}
      <SheetTrigger asChild>
        <div className="absolute left-4 top-4 z-[100] md:hidden flex">
          <Button variant="outline" size="icon">
            <Menu />
          </Button>
        </div>
      </SheetTrigger>

      {/* Sheet Content */}
      <SheetContent
        showX={!defaultOpen}
        side="left"
        className={clsx(
          'bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6',
          {
            'hidden md:inline-block z-0 w-[300px]': defaultOpen,
            'inline-block md:hidden z-[100] w-full': !defaultOpen,
          }
        )}
      >
        {/* Sidebar Logo */}
        <AspectRatio ratio={16 / 5}>
          <Image
            src={sidebarLogo}
            alt="Sidebar Logo"
            fill
            className="rounded-md object-contain"
          />
        </AspectRatio>

        {/* Popover for Agency Details */}
        <Popover>
          <PopoverTrigger>
            <div className="w-full my-4 flex items-center justify-between cursor-pointer py-8">
              <div className="flex items-center text-left gap-2">
                <Compass />
                <div className="flex flex-col">
                  {details.name}
                  <span className="text-muted-foreground">{details.address}</span>
                </div>
              </div>
              <ChevronsUpDown size={16} className="text-muted-foreground" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 h-80 mt-4 z-[200]">
            <Command className="rounded-lg">
              <CommandInput placeholder="Search Accounts..." />
              <CommandList className="pb-16">
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup heading="Agency">
                  <CommandItem>
                    <Link href={`/agency/${user?.Agency?.id}`} className="flex gap-4">
                      <Image
                        src={user?.Agency?.agencyLogo}
                        alt="Agency Logo"
                        width={64}
                        height={64}
                        className="rounded-md object-contain"
                      />
                      <div>
                        {user?.Agency?.name}
                        <span className="text-muted-foreground">{user?.Agency?.address}</span>
                      </div>
                    </Link>
                  </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Accounts">
                  {subAccounts.map((subaccount) => (
                    <CommandItem key={subaccount.id}>
                      <Link
                        href={`/subaccount/${subaccount.id}`}
                        className="flex items-center gap-4"
                      >
                        <Image
                          src={subaccount.subAccountLogo}
                          alt="Subaccount Logo"
                          width={64}
                          height={64}
                          className="rounded-md object-contain"
                        />
                        <div>
                          {subaccount.name}
                          <span className="text-muted-foreground">{subaccount.address}</span>
                        </div>
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <Button
                className="w-full mt-4 flex gap-2"
                onClick={() =>
                  setOpen(
                    <CustomModal
                      title="Create A Subaccount"
                      subheading="You can switch between your agency account and the subaccount from the sidebar"
                    >
                      <SubAccountDetails
                        agencyDetails={user?.Agency as Agency}
                        userId={user?.id as string}
                        userName={user?.name}
                      />
                    </CustomModal>
                  )
                }
              >
                <PlusCircleIcon size={15} /> Create Sub Account
              </Button>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Sidebar Navigation */}
        <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p>
        <Separator className="mb-4" />
        <nav>
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandGroup>
                {sidebarOpt.map((sidebarOptions) => {
                  const Icon = icons.find((icon) => icon.value === sidebarOptions.icon)?.path
                  return (
                    <CommandItem key={sidebarOptions.id}>
                      <Link href={sidebarOptions.link} className="flex items-center gap-2">
                        {Icon && <Icon />}
                        <span>{sidebarOptions.name}</span>
                      </Link>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default MenuOptions
