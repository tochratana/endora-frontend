"use server";

export async function updateProfile(formData: FormData) {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  console.log("[updateProfile]", { firstName, lastName });
}

export async function requestPasswordReset() {
  console.log("[requestPasswordReset] requested");
}
