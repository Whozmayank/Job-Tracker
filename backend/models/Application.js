const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        company: {
          type: String,
          required: true,
          trim: true,
        },
    
        role: {
          type: String,
          required: true,
          trim: true,
        },
    
        status: {
          type: String,
          enum: ["applied", "interview", "offer", "rejected"],
          default: "applied",
        },
    
        appliedDate: {
          type: Date,
          default: Date.now,
        },
    
        notes: {
          type: String,
          trim: true,
        },
    
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
      {
        timestamps: true,
      }
);

module.exports = mongoose.model("Application", applicationSchema);