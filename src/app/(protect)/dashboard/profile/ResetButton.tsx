"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function ResetButton() {
  const [showReset, setShowReset] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <>
      <button
        className="inline-flex items-center justify-center h-8 px-4 rounded bg-gradient-to-r from-teal-500 to-teal-600 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-teal-400 hover:to-teal-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:opacity-50"
        onClick={() => setShowReset(!showReset)}>Reset</button>
      {showReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <section className="w-full max-w-4xl bg-white dark:bg-slate-900 border rounded border-gray-200 dark:border-slate-800 px-10 pt-10 pb-5">
            <h1 className="text-2xl text-black mb-2 dark:text-white">
              Reset Password
            </h1>
            <p className="text-gray-500">
              Please enter your old password to reset
            </p>
            <form className="my-10 text-black dark:text-white">
              <div className="grid grid-cols-4 gap-x-8 mb-10">
                <label className="text-lg self-center">
                  Old Password
                </label>
                <div className="col-span-2 w-full col-end-5">
                  <div className="relative">
                    <input name="oldPassword"
                      type={showOld ? "text" : "password"}
                      placeholder="Old Password" required
                      className="p-3 border rounded w-full text-sm pr-10"/>
                    <button type="button"
                      className="absolute inset-y-0 right-3 inline-flex items-center text-gray-500"
                      onClick={() => setShowOld(!showOld)}>
                      {showOld ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-x-8 items-start">
                <label className="text-lg mt-2">
                  New Password
                </label>
                <div className="col-span-2 w-full col-end-5">
                  <div className="relative">
                    <input name="newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="Type in a strong password" required
                      className="p-3 border rounded w-full text-sm pr-10"/>
                    <button type="button"
                      className="absolute inset-y-0 right-3 inline-flex items-center text-gray-500"
                      onClick={() => setShowNew(!showNew)}>
                      {showNew ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    The password should contain uppercase, lowercase, number,
                    and special character.
                  </p>
                </div>
              </div>
              <div className="justify-end flex gap-5 mt-10">
                <button type="button"
                  className="border py-2 px-4 text-gray-500 rounded text-sm"
                  onClick={() => setShowReset(false)}>Cancel</button>
                <button type="submit"
                  className="bg-[var(--color-secondary)] rounded py-2 px-4 text-sm text-white">Update</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
} 