import BlurPage from '@/components/global/blur-page'
import { getClient, getProjects } from '@/lib/queries'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import Link from 'next/link'
import CreateProjectButton from './_components/create-project-btn'

type Props = {
  params: { clientId: string }
}

const ProjectsPage = async ({ params }: Props) => {
  const { clientId } = params
  const clientDetails = await getClient(clientId)
  if (!clientDetails) return null

  const { projects } = await getProjects({ clientId }) || { projects: [] }

  return (
    <BlurPage>
      <div className="flex flex-col">
        <CreateProjectButton
          clientId={clientId}
          className="w-[200px] self-end m-6"
        />
        <Command className="rounded-lg bg-transparent">
          <CommandInput placeholder="Search Projects..." />
          <CommandList>
            <CommandEmpty>No Projects Found.</CommandEmpty>
            <CommandGroup heading="Projects">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    className="h-24 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                  >
                    <Link
                      href={`/client/${clientId}/projects/${project.id}`}
                      className="flex gap-4 w-full h-full"
                    >
                      <div className="flex flex-col justify-between w-full">
                        <div className="flex flex-col">
                          <p className="font-semibold">{project.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {project.description || 'No description'}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs">
                            Status: <span className="capitalize">{project.status.toLowerCase()}</span>
                          </p>
                          {project.deploymentUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <Link href={project.deploymentUrl} target="_blank">
                                View Live
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Link>
                  </CommandItem>
                ))
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  No Projects
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </BlurPage>
  )
}

export default ProjectsPage
