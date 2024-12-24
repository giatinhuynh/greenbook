'use client'

import { Client, User } from '@prisma/client'
import React, { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from 'lucide-react'
import clsx from 'clsx'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'
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

type Props = {
  defaultOpen?: boolean
  details: any
  id: string
  sidebarContent: {
    type: 'text' | 'logo'
    content: string
  }
  sidebarOpt: {
    id: string
    name: string
    icon: string
    link: string
  }[]
  clients: Array<{
    client: Client & { projects: any[] }
    role: string
  }>
  user: User
}

const MenuOptions = ({
  details,
  sidebarContent,
  sidebarOpt,
  clients,
  user,
  defaultOpen,
  id,
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
        {sidebarContent.type === 'text' ? (
          <span className="text-xl font-bold">{sidebarContent.content}</span>
        ) : (
          <div className="relative w-40 h-40">
            <Image
              src={sidebarContent.content}
              alt="logo"
              className="object-contain"
              fill
            />
          </div>
        )}

        {/* Sidebar Navigation */}
        <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p>
        <Separator className="mb-4" />
        <nav>
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandGroup>
                {sidebarOpt.map((option) => {
                  const Icon = icons.find((icon) => icon.value === option.icon)?.path
                  return (
                    <CommandItem key={option.id}>
                      <Link href={option.link} className="flex items-center gap-2 w-full">
                        {Icon && <Icon />}
                        <span>{option.name}</span>
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