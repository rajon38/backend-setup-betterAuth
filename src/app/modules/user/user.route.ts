import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { UserController } from "./user.controller.js";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), UserController.getAll);

router.get("/:id", checkAuth(Role.ADMIN), UserController.getById);

router.patch("/change-user-status", 
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
     UserController.changeUserStatus);
router.patch("/change-user-role",
     checkAuth(Role.SUPER_ADMIN),
     UserController.changeUserRole);

router.delete("/:id", checkAuth(Role.ADMIN), UserController.deleteById);

export const UserRoutes = router;
