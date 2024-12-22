'use client'
import { User, Role, Client } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useModal } from '@/providers/modal-provider'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import {
  getAuthUserDetails,
  initUser,
  updateClient
} from '@/lib/queries'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import FileUpload from '../global/file-upload'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { Separator } from '../ui/separator'
import { Switch } from '../ui/switch'

type Props = {
  id: string | null
  userData?: Partial<User>
  clients?: Client[]
}

const UserDetails = ({ id, userData, clients }: Props) => {
  const { data, setClose } = useModal()
  const [roleState, setRoleState] = useState('')
  const [loadingPermissions, setLoadingPermissions] = useState(false)
  const [authUserData, setAuthUserData] = useState<User | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (data.user) {
      const fetchDetails = async () => {
        const response = await getAuthUserDetails()
        if (response) setAuthUserData(response)
      }
      fetchDetails()
    }
  }, [data])

  const userDataSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    avatarUrl: z.string(),
    role: z.enum(['ADMIN', 'USER', 'GUEST']),
  })

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: 'onChange',
    defaultValues: {
      name: userData?.name ?? data?.user?.name ?? '',
      email: userData?.email ?? data?.user?.email ?? '',
      avatarUrl: userData?.avatarUrl ?? data?.user?.avatarUrl ?? '',
      role: userData?.role ?? data?.user?.role ?? 'USER',
    },
  })

  useEffect(() => {
    if (data.user) {
      form.reset({
        name: data.user.name,
        email: data.user.email,
        avatarUrl: data.user.avatarUrl ?? '',
        role: data.user.role
      })
    }
    if (userData) {
      form.reset({
        name: userData.name ?? '',
        email: userData.email ?? '',
        avatarUrl: userData.avatarUrl ?? '',
        role: userData.role ?? 'USER'
      })
    }
  }, [userData, data])

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    if (!id) return
    if (userData || data?.user) {
      const updatedUser = await initUser(values)
      if (updatedUser) {
        toast({
          title: 'Success',
          description: 'Updated User Information',
        })
        setClose()
        router.refresh()
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not update user information',
        })
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Full Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={
                        userData?.role === 'ADMIN' ||
                        form.formState.isSubmitting
                      }
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User Role</FormLabel>
                  <Select
                    disabled={field.value === 'ADMIN'}
                    onValueChange={(value) => {
                      if (value === 'GUEST') {
                        setRoleState(
                          'Guest users have limited access to view client information.'
                        )
                      } else if (value === 'USER') {
                        setRoleState(
                          'Users can view and manage client projects.'
                        )
                      } else {
                        setRoleState('')
                      }
                      field.onChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="GUEST">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleState}</p>
                </FormItem>
              )}
            />

            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loading /> : 'Save User Details'}
            </Button>

            {authUserData?.role === 'ADMIN' && clients && (
              <div>
                <Separator className="my-4" />
                <FormLabel>Client Access</FormLabel>
                <FormDescription className="mb-4">
                  Manage which clients this user can access. Only administrators can modify these settings.
                </FormDescription>
                <div className="flex flex-col gap-4">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p>{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.companyName}</p>
                      </div>
                      <Switch
                        disabled={loadingPermissions}
                        checked={false} // TODO: Implement client access check
                        onCheckedChange={async (access) => {
                          setLoadingPermissions(true)
                          try {
                            // TODO: Implement addUserToClient or removeUserFromClient
                            toast({
                              title: 'Success',
                              description: 'Updated client access',
                            })
                          } catch (error) {
                            toast({
                              variant: 'destructive',
                              title: 'Error',
                              description: 'Could not update client access',
                            })
                          }
                          setLoadingPermissions(false)
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default UserDetails