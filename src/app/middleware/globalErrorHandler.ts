/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";
import { deleteUploadedFilesFromGlobalErrorHandler } from "../utils/deleteUploadedFilesFromGlobalErrorHandler";
import { Prisma } from "../../generated/prisma/client";
import {
  handlePrismaClientUnknownRequestError,
  handlePrismaClientValidationError,
  handlerPrismaClientInitializationError,
  handlerPrismaClientRustPanicError,
  PrismaClientKnownRequestError,
} from "../errorHelpers/handlePrismaErrors";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction  // ✅ Required — Express needs 4 args to detect error middleware
) => {
  // ── Dev logging ────────────────────────────────────────────────────────────
  if (envVars.NODE_ENV === "development") {
    console.error("Error from globalErrorHandler:", err);
  }

  // ── Cleanup uploaded files ─────────────────────────────────────────────────
  await deleteUploadedFilesFromGlobalErrorHandler(req);

  // ── Defaults ───────────────────────────────────────────────────────────────
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string;
  let errorSources: TErrorSources[];
  let stack: string | undefined = undefined;

  // ── Prisma: Known Request Error (P2xxx codes) ──────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const simplified = PrismaClientKnownRequestError(err);
    statusCode = simplified.statusCode as number;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = err.stack;

  // ── Prisma: Unknown Request Error ──────────────────────────────────────────
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    const simplified = handlePrismaClientUnknownRequestError(err);
    statusCode = simplified.statusCode as number;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = err.stack;

  // ── Prisma: Validation Error ───────────────────────────────────────────────
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    const simplified = handlePrismaClientValidationError(err);
    statusCode = simplified.statusCode as number;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = err.stack;

  // ── Prisma: Rust Panic Error ───────────────────────────────────────────────
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    const simplified = handlerPrismaClientRustPanicError();
    statusCode = simplified.statusCode as number;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = err.stack;

  // ── Prisma: Initialization Error ───────────────────────────────────────────
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    const simplified = handlerPrismaClientInitializationError(err);
    statusCode = simplified.statusCode as number;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = err.stack;

  // ── Zod Validation Error ───────────────────────────────────────────────────
  } else if (err instanceof z.ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode as number;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = (err as any).stack;   // ✅ added — was missing in your original

  // ── Custom App Error ───────────────────────────────────────────────────────
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];

  // ── Malformed JSON body (from express.json()) ──────────────────────────────
  // ✅ New — without this, a bad JSON body gives a confusing 500
  } else if (err instanceof SyntaxError && "body" in err) {
    statusCode = status.BAD_REQUEST;
    message = "Malformed JSON in request body.";
    stack = (err as SyntaxError).stack;
    errorSources = [{ path: "body", message: message }];

  // ── Generic Error fallback ─────────────────────────────────────────────────
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];

  // ── Completely unknown throw (e.g. throw "some string") ───────────────────
  // ✅ New — guards against non-Error throws
  } else {
    message = "An unexpected error occurred.";
    errorSources = [{ path: "", message: String(err) }];
  }

  // ── Response ───────────────────────────────────────────────────────────────
  const isDev = envVars.NODE_ENV === "development";

  const errorResponse: TErrorResponse = {
    success: false,
    message,
    errorSources,
    stack: isDev ? stack : undefined,
    error: isDev ? err : undefined,   // ✅ raw error only in dev
  };

  res.status(statusCode).json(errorResponse);
};