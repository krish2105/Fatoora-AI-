import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

export function validationErrorResponse(error: ZodError | Error) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { success: false, error: "Validation failed", issues: error.issues },
      { status: 400 }
    );
  }
  return errorResponse(error.message, 400);
}

export function forbiddenResponse(message = "Forbidden") {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = "Not Found") {
  return errorResponse(message, 404);
}

export function unauthorizedResponse(message = "Unauthorized") {
  return errorResponse(message, 401);
}
