import mongoose from "mongoose";

const AssetTypeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},

	configuration: {
		type: String,
		required: true,
	},

	rate : {
		type : Number
	},

	//totalQuantity for our department
	//example --if total 50 desktops were boought but only 25 desktops were taken by our department then enter 25 in form and not 50
	totalQuantityBought:{
		type:Number,
	},

	totalCost : {
		type : Number,
	},
	billNo:{
		type:String,
	},
	DPRno:{
		type:String
	}

	//more attributes can be added later on
}, { timestamps: true, }
);

export default mongoose.model("AssetType", AssetTypeSchema);
