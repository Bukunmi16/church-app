import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import { fetchChurchInfo, updateChurchInfo } from "./church-info.controller.js";
import upload from "../../middleware/upload.js";

const router = express.Router();


router.get("/", fetchChurchInfo);
router.patch("/", authMiddleware, authorize("admin"), upload.single("logo"), updateChurchInfo);    

export default router;