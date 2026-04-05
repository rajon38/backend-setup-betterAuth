import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { UserService } from "./user.service.js";
import { IQueryParams } from "../../interfaces/query.interface.js";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await UserService.getAll(query as IQueryParams);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "User list retrieved successfully",
    data: result,
    meta: result.meta
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getById(req.params.id as string);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "User retrieved successfully",
    data: result,
  });
});




const deleteById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deleteById(req.params.id as string);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "User deleted successfully",
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id, status } = req.body;
  const result = await UserService.changeUserStatus(id, status);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "User status updated successfully",
    data: result,
  });
});

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id, role } = req.body;
  const result = await UserService.changeUserRole(id, role);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "User role updated successfully",
    data: result,
  });
});

export const UserController = {
  getAll,
  getById,
  deleteById,
  changeUserStatus,
  changeUserRole,
};
