import express from "express";
import {
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssue,
    deleteIssue
} from "../controllers/issueController.js";

const router = express.Router();

// CREATE ISSUE  --practicalIncharge only
router.post("/", createIssue);

// GET ALL ISSUES --admin, labAssistant, practicalIncharge, labIncharge
router.get("/", getAllIssues);

// GET ISSUE BY ID --admin, labAssistant, practicalIncharge, labIncharge
router.get("/:issueId", getIssueById);

// UPDATE ISSUE --labAssisstan only
router.put("/:issueId", updateIssue);

// DELETE ISSUE --labAssisstan only
router.delete("/:issueId", deleteIssue);

export default router;
