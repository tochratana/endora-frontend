"use client";

import { Archive, Database, User, ZapIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetProjectByUuidQuery } from "@/service/project/projectApi";

interface ProjectOverviewProps {
  projectUuid?: string;
}

export default function ProjectOverview({ projectUuid }: ProjectOverviewProps) {
  const params = useParams();
  const uuid = projectUuid || (params?.projectUuid as string);

  const { data: project, error, isLoading } = useGetProjectByUuidQuery(uuid);

  if (isLoading) {
    return (
      <section className="w-full py-10 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-6xl m-auto flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 dark:border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading project...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-10 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-6xl m-auto flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-2">
              Error loading project
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {error && "data" in error
                ? String(error.data)
                : "Failed to fetch project"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="w-full py-10 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-6xl m-auto flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Project not found
            </p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="w-full py-10 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl m-auto flex md:flex-col flex-row text-black dark:text-white">
        <div className="grid grid-cols-12 w-full mb-10">
          <div className="col-span-6">
            <h1 className="text-2xl font-semibold mb-3 text-black dark:text-white">
              {project.projectName}
            </h1>
            <p className="text-gray-800 dark:text-gray-300">
              {project.description}
            </p>
            {/* <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
              {project.updatedAt && (
                <p>
                  Updated: {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div> */}
          </div>
          <div className="text-black dark:text-white col-span-6 justify-self-end">
            <h1 className="font-semibold text-lg">Total Requests</h1>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This month
            </p>
          </div>
        </div>
        <div className="grid grid-cols-8 h-70 w-full gap-4">
          {/*  */}
          <div className="col-span-2 p-3 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="h-[50%]">
              <div className="flex gap-4 mb-3">
                <Database className="text-teal-600 dark:text-emerald-500" />
                <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                  Database
                </h1>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                REST Request
              </h3>
              <p className="text-gray-900 dark:text-gray-100">0</p>
            </div>
            <div className="h-[50%] grid place-content-center border border-gray-300 dark:border-gray-600 text-center bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-600 dark:text-gray-400">
                No data to show
              </p>
            </div>
          </div>
          {/*  */}
          <div className="col-span-2 p-3 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="h-[50%]">
              <div className="flex gap-4 mb-3">
                <Archive className="text-teal-600 dark:text-emerald-500" />
                <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                  Storage
                </h1>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                REST Request
              </h3>
              <p className="text-gray-900 dark:text-gray-100">0</p>
            </div>
            <div className="h-[50%] grid place-content-center border border-gray-300 dark:border-gray-600 text-center bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-600 dark:text-gray-400">
                No data to show
              </p>
            </div>
          </div>
          {/*  */}
          <div className="col-span-2 p-3 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="h-[50%]">
              <div className="flex gap-4 mb-3">
                <User className="text-teal-600 dark:text-emerald-500" />
                <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                  Auth
                </h1>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                REST Request
              </h3>
              <p className="text-gray-900 dark:text-gray-100">0</p>
            </div>
            <div className="h-[50%] grid place-content-center border border-gray-300 dark:border-gray-600 text-center bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-600 dark:text-gray-400">
                No data to show
              </p>
            </div>
          </div>
          {/*  */}
          <div className="col-span-2 p-3 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="h-[50%]">
              <div className="flex gap-4 mb-3">
                <ZapIcon className="text-teal-600 dark:text-emerald-500" />
                <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                  Realtime
                </h1>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                REST Request
              </h3>
              <p className="text-gray-900 dark:text-gray-100">0</p>
            </div>
            <div className="h-[50%] grid place-content-center border border-gray-300 dark:border-gray-600 text-center bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-600 dark:text-gray-400">
                No data to show
              </p>
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </section>
  );
}
