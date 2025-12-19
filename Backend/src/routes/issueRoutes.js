import express from "express";
import {
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssue,
    deleteIssue
} from "../controllers/issueController.js";

const router = express.Router();

// CREATE ISSUE
router.post("/", createIssue);

// GET ALL ISSUES
router.get("/", getAllIssues);

// GET ISSUE BY ID
router.get("/:issueId", getIssueById);

// UPDATE ISSUE
router.put("/:issueId", updateIssue);

// DELETE ISSUE
router.delete("/:issueId", deleteIssue);

export default router;
