"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProjectMutation } from "@/app/store/api/authApi";

type Props = {
  onDone?: () => void;
};

export default function TopupForm({ onDone }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    const payload = { projectName: name, description };

    // Attempt with retries for transient JDBC pool errors
    const maxRetries = 3;
    let attempt = 0;
    let lastResult: unknown = null;
    while (attempt < maxRetries) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await createProject(payload);
      lastResult = result;

      if (!result.error) {
        // success
        break;
      }

      // Inspect error body for JDBC connection pool message
      const e = result.error;
      const errData = e?.data ?? e;
      const bodyStr =
        typeof errData === "string" ? errData : JSON.stringify(errData);
      if (bodyStr.includes("Unable to acquire JDBC Connection")) {
        attempt += 1;
        if (attempt < maxRetries) {
          setIsRetrying(true);
          const backoff = 500 * Math.pow(2, attempt - 1); // 500ms, 1000ms, 2000ms
          await new Promise(r => setTimeout(r, backoff));
          setIsRetrying(false);
          continue;
        }
      }

      // non-retryable or exhausted retries -> break and handle below
      break;
    }

    // use lastResult for post-processing
    type RtkResult = { data?: unknown; error?: unknown } | undefined;
    const finalResult = lastResult as RtkResult;

    // RTK returns an object with either `data` or `error`
    // Inspect both to surface the real reason for 400 responses.

    if (finalResult?.error) {
      const e = finalResult.error as { data?: unknown } | unknown;
      console.error("Create project failed:", e);
      let errData: unknown;
      if (
        e &&
        typeof e === "object" &&
        Object.prototype.hasOwnProperty.call(e, "data")
      ) {
        errData = (e as { data?: unknown }).data;
      } else {
        errData = e;
      }

      try {
        setErrorMessage(
          typeof errData === "string" ? errData : JSON.stringify(errData)
        );
      } catch {
        setErrorMessage(String(errData));
      }
      return;
    }

    // success
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newProject: any = finalResult?.data;
    if (newProject?.id) {
      onDone?.();
      router.push(`/workspace/${newProject.id}/projectOverview`);
      return;
    }

    onDone?.();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <label className="text-sm">Project name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full rounded-[8px] border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400 hover:border-teal-400 dark:border-zinc-800 dark:bg-[#0F0F1A] dark:text-zinc-200 dark:focus:border-emerald-500 dark:hover:border-emerald-500"
          placeholder="Input your project name"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm">Discrition</label>
        <textarea
          className="w-full rounded-[8px] border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400 hover:border-teal-400 dark:border-zinc-800 dark:bg-[#0F0F1A] dark:text-zinc-200 dark:focus:border-emerald-500 dark:hover:border-emerald-500"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description of project"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-[8px] bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-[0.98] dark:bg-emerald-500"
          disabled={isLoading}
        >
          Continue
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex items-center justify-center rounded-[8px] border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Cancel
        </button>
      </div>
      {errorMessage && (
        <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
      )}
    </form>
  );
}
