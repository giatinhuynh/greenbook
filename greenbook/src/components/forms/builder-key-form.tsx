import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import Loading from '../global/loading'

const formSchema = z.object({
  builderPublicKey: z.string().min(1, 'Builder.io public key is required'),
})

interface BuilderKeyFormProps {
  projectId: string
}

const BuilderKeyForm = ({ projectId }: BuilderKeyFormProps) => {
  const { toast } = useToast()
  const router = useRouter()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      builderPublicKey: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`/api/projects/${projectId}/builder-key`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to update Builder.io public key')
      }

      toast({
        title: 'Success',
        description: 'Builder.io public key updated successfully.',
      })

      router.refresh()
    } catch (error) {
      console.error('Builder key update error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update Builder.io public key.',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="builderPublicKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Builder.io Public Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Builder.io public key" {...field} />
              </FormControl>
              <FormDescription>
                You can find this in your Builder.io space settings under API Keys.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Loading /> : 'Save Key'}
        </Button>
      </form>
    </Form>
  )
}

export default BuilderKeyForm