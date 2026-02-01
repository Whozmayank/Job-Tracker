const mongoose = require("mongoose");
const Application = require("../models/Application");

// Get all applications for the authenticated user
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Get applications error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const createApplication = async (req, res) => {
  try {
    const { company, role, status, appliedDate, notes } = req.body;

    if (!company || !role) {
      return res
        .status(400)
        .json({ error: "company and role are required" });
    }

    const application = await Application.create({
      company,
      role,
      status,
      appliedDate,
      notes,
      user: req.user.id, // from auth middleware
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Create application error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update application
const updateApplication = async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId early
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid application ID" });
  }

  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Ownership check
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Prevent changing ownership
    delete req.body.user;

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Update application error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};


// Delete application
const deleteApplication = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid application ID" });
  }

  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Ownership check
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
};
