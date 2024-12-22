'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { v4 } from 'uuid'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import FileUpload from '../global/file-upload'
import { Client, User } from '@prisma/client'
import { useToast } from '../ui/use-toast'
import { createClient, updateClient } from '@/lib/queries'
import { useEffect } from 'react'
import Loading from '../global/loading'
import { useModal } from '@/providers/modal-provider'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  companyEmail: z.string().email('Invalid email'),
  companyPhone: z.string().optional(),
  companyLogo: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
})

interface ClientDetailsProps {
  details?: Partial<Client>
  user: User
}

const ClientDetails: React.FC<ClientDetailsProps> = ({
  details,
  user,
}) => {
  const { toast } = useToast()
  const { setClose } = useModal()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: details?.name,
      companyName: details?.companyName,
      companyEmail: details?.companyEmail,
      companyPhone: details?.companyPhone!,
      companyLogo: details?.companyLogo!,
      address: details?.address!,
      city: details?.city!,
      state: details?.state!,
      country: details?.country!,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (details?.id) {
        // Update existing client
        const response = await updateClient(details.id, values)
        if (!response) throw new Error('No response from server')
      } else {
        // Create new client
        const response = await createClient(values)
        if (!response) throw new Error('No response from server')
      }

      toast({
        title: 'Success',
        description: `Successfully ${details?.id ? 'updated' : 'created'} client details.`,
      })

      setClose()
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save client details.',
      })
    }
  }

  useEffect(() => {
    if (details) {
      form.reset({
        name: details.name,
        companyName: details.companyName,
        companyEmail: details.companyEmail,
        companyPhone: details.companyPhone || undefined,
        companyLogo: details.companyLogo || undefined,
        address: details.address || undefined,
        city: details.city || undefined,
        state: details.state || undefined,
        country: details.country || undefined,
      })
    }
  }, [details, form])

  const isLoading = form.formState.isSubmitting

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
        <CardDescription>Please enter client business details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="companyLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Client name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Company name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Company Email</FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Company Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              disabled={isLoading}
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Business St..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="State"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              disabled={isLoading}
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Country"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loading /> : `${details?.id ? 'Update' : 'Create'} Client`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ClientDetails