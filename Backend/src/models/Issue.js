import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
  {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    individualAssetIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "IndividualAsset",
      required: true,
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "inProgress", "solved"],
      default: "created",
    },
    title: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },

    //issue image is optional
    issuePhoto : {
      publicUrl : {type : String},
      publicId : {type : String},

    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Issue", IssueSchema);
