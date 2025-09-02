'use client';
import { Project } from '@durablr/shared-utils-schemas';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@durablr/web-ui/server';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({
  projects,
  selectedProjectId,
}: {
  projects: Project[];
  selectedProjectId: string;
}) {
  const [open, setIsOpen] = useState(false);
  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="w-full flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-white font-semibold">Stream Consumer</span>
            </div>

            <div className="max-w-[300px] w-full flex items-center gap-2">
              <span className="text-gray-400 text-sm">Project:</span>
              <DropdownMenu open={open} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className="w-full rounded-lg px-3 py-2 bg-gray-800/80 flex items-center justify-between outline-none">
                  <span>{selectedProject?.name || 'Select a project'}</span>
                  {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-gray-800 border-none">
                  {projects.map((project) => (
                    <DropdownMenuItem
                      asChild
                      key={project.id}
                      className="outline-none hover:bg-gray-700"
                    >
                      <Link className="cursor-pointer" href={`/dashboard/${project.id}`}>
                        {project.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
