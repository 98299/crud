import { Router } from "express";
import { check } from "./usercontrollers.js";
const router=Router();

router.route("/cards").post(check)

export default router;