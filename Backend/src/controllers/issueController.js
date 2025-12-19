import mongoose from "mongoose";
import Issue from "../models/Issue.js";
import User from "../models/User.js";
import Location from "../models/Location.js";
import IndividualAsset from "../models/IndividualAsset.js";
import { createIssueSchema, updateIssueSchema } from "../validators/issueValidation.js";

// CREATE ISSUE
export const createIssue = async (req, res) => {
    try {
        const { error, value } = createIssueSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        // Check location exists
        const location = await Location.findById(value.locationId).lean();
        if (!location) {
            return res.status(400).json({ success: false, message: "Invalid locationId" });
        }

        // Check user exists
        const user = await User.findById(value.createdBy).lean();
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid createdBy user" });
        }

        // Fetch assets and verify existence + location match
        const assets = await IndividualAsset.find({
            _id: { $in: value.individualAssetIds }
        }).select("_id locationId");

        if (assets.length !== value.individualAssetIds.length) {

            return res.status(400).json({ success: false, message: "One or more IndividualAssets do not exist" });
        }

        const invalidAsset = assets.find(
            asset => asset.locationId.toString() !== value.locationId
        );

        if (invalidAsset) {

            return res.status(400).json({ success: false, message: "One or more assets do not belong to the given location" });
        }

        // Create issue (status enforced server-side)
        const issue = await Issue.create({
            locationId: value.locationId,
            individualAssetIds: value.individualAssetIds,
            createdBy: value.createdBy,
            reason: value.reason,
            status: "created"
        });

        return res.status(201).json({ success: true, message: "Issue created successfully", data: issue });

    } catch (err) {
        console.error("Error creating issue:", err);
        return res.status(500).json({ success: false, message: "Failed to create issue" });
    }
};


// GET ALL ISSUES --yet to add filter, search and pagination
//add validations for all filter and alos prevent regex  or nosql injection which can happpen through req.pparams
export const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find()
        .populate("locationId individualAssetIds createdBy")
        .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, count: issues.length, data: issues });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to fetch issues" });
    }
};

// GET ISSUE BY ID
export const getIssueById = async (req, res) => {
    try {
        const { issueId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(issueId)) {
            return res.status(400).json({ success: false, message: "Valid issue ID is required" });
        }

        const issue = await Issue.findById(issueId).populate("locationId individualAssetIds createdBy");
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        return res.status(200).json({ success: true, data: issue });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to fetch issue" });
    }
};

// UPDATE ISSUE
export const updateIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(issueId)) {
            return res.status(400).json({ success: false, message: "Valid issue ID is required" });
        }

        const { error, value } = updateIssueSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        const allowedTransitions = {
            created: ["inProgress"],
            inProgress: ["solved"],
            solved: [],
        };

        if (value.status) {
            if (!allowedTransitions[issue.status].includes(value.status)) {
                return res.status(400).json({ success : false, message: "Invalid status transition" });
            }
        }


        const updatedIssue = await Issue.findByIdAndUpdate(issueId, value, { new: true, runValidators: true })
        .populate("locationId individualAssetIds createdBy");

        if (!updatedIssue) {
            return res.status(404).json({ success: false, message: "Issue not found or update failed" });
        }

        return res.status(200).json({ success: true, message: "Issue updated successfully", data: updatedIssue });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to update issue" });
    }
};

// DELETE ISSUE
export const deleteIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(issueId)) {
            return res.status(400).json({ success: false, message: "Valid issue ID is required" });
        }

        const deletedIssue = await Issue.findByIdAndDelete(issueId);
        if (!deletedIssue) {
            return res.status(404).json({ success: false, message: "Issue not found or delete failed" });
        }

        return res.status(200).json({ success: true, message: "Issue deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to delete issue" });
    }
};
