import express from "express"
import upload from "../middleware/multer.js";
import {
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssue,
    deleteIssue
} from "../controllers/issueController.js";

import { verifyJWT } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// all location routes require authentication
router.use(verifyJWT);



// CREATE ISSUE  --practicalIncharge only
router.post("/", roleMiddleware(["practicalIncharge"]),upload.single("issuePhoto"), createIssue);

// GET ALL ISSUES --admin, labAssistant, practicalIncharge, labIncharge
router.get("/", roleMiddleware(["admin", "labAssistant", "practicalIncharge", "labIncharge"]), getAllIssues);

// GET ISSUE BY ID --admin, labAssistant, practicalIncharge, labIncharge
router.get("/:issueId", roleMiddleware(["admin", "labAssistant", "practicalIncharge", "labIncharge"]), getIssueById);

// UPDATE ISSUE --labAssisstan only
router.put("/:issueId", roleMiddleware(["labAssistant"]), updateIssue);

// DELETE ISSUE --labAssisstan only
router.delete("/:issueId", roleMiddleware(["labAssistant"]), deleteIssue);

// later  on ask HOD sir in meet about whether to give delete and edit access or to completely remove delete option from everywhere

export default router;
