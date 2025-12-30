import mongoose from "mongoose";
import Issue from "../models/Issue.js";
import User from "../models/User.js";
import Location from "../models/Location.js";
import IndividualAsset from "../models/IndividualAsset.js";
import { createIssueSchema, updateIssueSchema, getAllIssuesQuerySchema } from "../validators/issueValidation.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryHelpers.js";

// Helper function to escape special regex characters
const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');



// CREATE ISSUE
export const createIssue = async (req, res) => {
    let issuePhoto = undefined; // variable to track issuePhoto 
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

        // ISSUE PHOTO UPLOAD (OPTIONAL)

        if (req.file) {
            
            // FILE TYPE CHECK
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg",];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ success: false, message: "Only JPEG and PNG images are allowed" });
            }

            // FILE SIZE CHECK (1MB)
            const MAX_SIZE = 1 * 1024 * 1024; // 1MB
            if (req.file.size > MAX_SIZE) {
                return res.status(400).json({ success: false, message: "Image size must be less than 1MB" });
            }

            const uploaded = await uploadToCloudinary(req.file.path);

            issuePhoto = {
                publicUrl: uploaded.url,
                publicId: uploaded.publicId
            };
        }

        // Create issue (status enforced server-side)
        const issueData = {
            locationId: value.locationId,
            individualAssetIds: value.individualAssetIds,
            createdBy: req.user.id,
            reason: value.reason,
            title: value.title,
            status: "created"
        };

        if (issuePhoto) {
            issueData.issuePhoto = issuePhoto;
        }

        const issue = await Issue.create(issueData);

        return res.status(201).json({ success: true, message: "Issue created successfully", data: issue });

    } catch (err) {
        console.error("Error creating issue:", err);

        if(issuePhoto?.publicId){
            await deleteFromCloudinary(issuePhoto.publicId);
        }

        return res.status(500).json({ success: false, message: "Failed to create issue" });
    }
};


// GET ALL ISSUES --yet to add filter, search and pagination
//add validations for all filter and alos prevent regex  or nosql injection which can happpen through req.pparams
// Helper function to escape special regex characters
export const getAllIssues = async (req, res) => {
    try {
        // Validate query params
        const { error, value } = getAllIssuesQuerySchema.validate(req.query);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        let { status, locationId, search, page, limit } = value;

        // Build role-based filter
        const filter = {};

        if (req.user.role === "practicalIncharge") {
            filter.createdBy = req.user.id;
        } else if (req.user.role === "labIncharge") {
            filter.locationId = req.user.locationId;
        } else if (req.user.role === "admin" || req.user.role === "labAssistant") {
            if (locationId) filter.locationId = locationId;
        }

        // Apply additional filters
        if (status) filter.status = status;

        // Apply search safely
        if (search) {
            const safeSearch = escapeRegex(search);
            const regex = new RegExp(safeSearch, "i");
            filter.$or = [
                { title: regex },
                { reason: regex }
            ];
        }

        // Pagination
        const issues = await Issue.find(filter)
            .populate("locationId individualAssetIds createdBy")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit).lean();

        const total = await Issue.countDocuments(filter);

        return res.status(200).json({
            success: true,
            count: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            data: issues
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to fetch issues" });
    }
};


// GET ISSUE BY ID
export const getIssueById = async (req, res) => {
    try {
        const { issueId } = req.params;

        // Validate issueId
        if (!issueId || !mongoose.Types.ObjectId.isValid(issueId)) {
            return res.status(400).json({ success: false, message: "Valid issue ID is required" });
        }

        // Fetch the issue
        const issue = await Issue.findById(issueId).populate("locationId individualAssetIds createdBy");
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        // Role-based access control
        const role = req.user.role;

        if (role === "labIncharge" && issue.locationId.toString() !== req.user.locationId.toString()) {
            return res.status(403).json({ success: false, message: "You can only view issues created by you" });
        }

        if (role === "practicalIncharge" && issue.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: "You can only view issues in your location" });
        }

        // admin and labAssistant can view all issues (no restriction)

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

        // delete cloudinary file only if DB delete is successful
        try {
            if (deletedIssue.issuePhoto?.publicId) {
                await deleteFromCloudinary(deletedIssue.issuePhoto.publicId);
            }
        } catch (cleanupErr) {
            console.error( "Cloudinary cleanup failed for issue:", issueId, cleanupErr );
        }

        return res.status(200).json({ success: true, message: "Issue deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to delete issue" });
    }
};
