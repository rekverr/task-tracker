import type { AxiosError } from "axios";

export function getApiErrorMessage(error: unknown) {
  const data = (error as AxiosError<{ message?: string | string[] }>).response
    ?.data;
  return Array.isArray(data?.message)
    ? data.message.join(", ")
    : data?.message || "Something went wrong. Please try again.";
}
