import { Router } from "express";
import { TakeListUserController } from "../controller/TakeListUserController";
import {checkJwt, checkRole} from "../middleware/checkRole";

const router = Router();

router.get("/", [checkJwt, checkRole(["ADMIN"])], TakeListUserController.prototype.getAllUsers);

export const takeListUserRoutes = router;