import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export function jsonSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

export function validateString(
  value: unknown,
  fieldName: string,
  options?: { min?: number; max?: number; required?: boolean }
): { valid: boolean; error?: string; value: string } {
  const isRequired = options?.required ?? true;
  if (value === undefined || value === null || value === "") {
    if (isRequired) {
      return { valid: false, error: `${fieldName} is required`, value: "" };
    }
    return { valid: true, value: "" };
  }

  if (typeof value !== "string") {
    return { valid: false, error: `${fieldName} must be a string`, value: "" };
  }

  const trimmed = value.trim();
  if (options?.min && trimmed.length < options.min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${options.min} characters`,
      value: trimmed,
    };
  }

  if (options?.max && trimmed.length > options.max) {
    return {
      valid: false,
      error: `${fieldName} must be at most ${options.max} characters`,
      value: trimmed,
    };
  }

  return { valid: true, value: trimmed };
}
