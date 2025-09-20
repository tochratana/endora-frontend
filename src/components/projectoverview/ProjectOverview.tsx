"use client";
import { Archive, Database, Library, User, ZapIcon } from "lucide-react";
import { useParams } from "next/navigation";
import {
  useGetProjectByUuidQuery,
  useGetProjectOverviewQuery,
} from "@/service/project/projectApi";
import { BarChart, Bar, XAxis } from "recharts";
import clientLibraries from "@/mock/clientLibraries";
import { HiDocument } from "react-icons/hi2";
import Image from "next/image";

const stats = {
  tables: 2,
  functions: 0,
  replicas: 0,
};

export default function ProjectOverview({ projectUuid }: ProjectOverviewProps) {
  const params = useParams();

  const uuid = projectUuid || (params?.projectUuid as string);
  const { data: response, error: ree } = useGetProjectByUuidQuery(uuid);

  if (ree) {
    console.log("Error", ree);
  }

  const projectData = response?.data;
  console.log("uuid", uuid);
  console.log("project", projectData);

  const { data: project, error, isLoading } = useGetProjectOverviewQuery(uuid);
  const projects = project?.data || [];
  console.log("project", projects);

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
          <div className="bg-gray-900 text-white p-6 col-span-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                {/* Left side - Project info */}
                <div className="col-span-6 grid grid-cols-2  ">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-2xl font-semibold text-white">
                        {projectData?.projectName}
                      </h1>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded">
                        NANO
                      </span>
                    </div>
                    <p className="text-gray-300">{projectData?.description}</p>
                    {/* <div className="mt-3 text-sm text-gray-400">
                      <p>
                        Created:{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                      {project.updatedAt && (
                        <p>
                          Updated:{" "}
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div> */}
                  </div>
                </div>

                {/* Right side - Stats and status */}
                <div className="flex items-center gap-8">
                  {/* Stats */}
                  <div className="flex gap-6 text-center">
                    <div>
                      <div className="text-gray-400 text-sm">Tables</div>
                      <div className="text-2xl font-semibold text-white">
                        {stats.tables}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Functions</div>
                      <div className="text-2xl font-semibold text-white">
                        {stats.functions}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Error Count</div>
                      <div className="text-2xl font-semibold text-white">
                        {projects.errorCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 h-75 w-full gap-4">
          {/* Database */}
          <div className="p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
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
              <p className="text-gray-900 dark:text-gray-100">
                {projects.restRequestsTotal}
              </p>
            </div>
            <div className="h-[50%] grid place-content-center border border-gray-300 dark:border-gray-600 text-center bg-gray-50 dark:bg-gray-700 rounded">
              {projects.restRequestsTotal > 0 ? (
                <BarChart
                  width={30}
                  height={150} // bigger height so bars have room to grow
                  data={[
                    { name: "Requests", value: projects.restRequestsTotal },
                  ]}
                >
                  <XAxis dataKey="name" hide />
                  <Bar
                    dataKey="value"
                    fill="var(--color-secondary)"
                    radius={[4, 4, 0, 0]} // rounded top corners
                  />
                </BarChart>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No data to show
                </p>
              )}
            </div>
          </div>

          {/* Auth */}
          <div className="p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
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
              <p className="text-gray-900 dark:text-gray-100">
                {projects.authRequests}
              </p>
            </div>
            <div className="h-[50%] grid place-content-center border border-gray-300 dark:border-gray-600 text-center bg-gray-50 dark:bg-gray-700 rounded">
              <BarChart
                width={30}
                height={150} // bigger height so bars have room to grow
                data={[{ name: "Requests", value: projects.authRequests }]}
              >
                <XAxis dataKey="name" hide />
                <Bar
                  dataKey="value"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]} // rounded top corners
                />
              </BarChart>
            </div>
          </div>

          {/* Storage */}
          <div className="p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
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
              <p className="text-gray-900 dark:text-gray-100">
                {projects.mongoBytes}
              </p>
            </div>
            <div className="h-[50%] grid place-content-center border border-gray-300 dark:border-gray-600 text-center bg-gray-50 dark:bg-gray-700 rounded">
              {projects.mongoBytes > 0 ? (
                <BarChart
                  width={30}
                  height={150} // bigger height so bars have room to grow
                  data={[{ name: "Requests", value: projects.mongoBytes }]}
                >
                  <XAxis dataKey="name" hide />
                  <Bar
                    dataKey="value"
                    fill="var(--color-secondary)"
                    radius={[4, 4, 0, 0]} // rounded top corners
                  />
                </BarChart>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No data to show
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Client libraries
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {clientLibraries.map((library, index) => (
              <div
                key={library.name || index}
                className="p-6 border rounded-lg border-gray-300 dark:border-gray-600  "
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={library.logo}
                      alt={`${library.name} logo`}
                      width={24}
                      height={24}
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {library.name}
                  </h3>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <HiDocument />
                    Docs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
