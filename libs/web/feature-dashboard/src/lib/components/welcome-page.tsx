import Link from 'next/link';
import { Button } from '@durablr/web-ui/server';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@durablr/web-ui/server';
import { ChevronDownIcon } from 'lucide-react';
import { getProjects } from '../loader';

export async function WelcomePage() {
  const projects = await getProjects();
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-grid-white/[0.02] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900/50" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="max-w-2xl text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                Welcome to Stream Helper
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-lg mx-auto">
                Select a project to view real-time streaming metrics and analytics
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <label className="text-sm font-medium text-gray-300">Choose your project</label>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[300px] h-12 bg-gray-900/50 border-gray-800 hover:bg-gray-900/80 text-white justify-between"
                    >
                      Select a project...
                      <ChevronDownIcon className="size-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[300px] bg-gray-900 border-gray-800">
                    {projects.map((project) => (
                      <DropdownMenuItem
                        className="outline-none cursor-pointer hover:bg-gray-800"
                        key={project.id}
                        asChild
                      >
                        <Link
                          href={`/dashboard/${project.id}`}
                          className="flex items-center justify-between w-full"
                        >
                          <span>{project.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-xs text-gray-500">
                Select a project to view detailed metrics and streaming data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
