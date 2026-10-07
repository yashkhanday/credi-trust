const { createUserSchema } = require("../validators/admin-user.validator");
const { createUser } = require("../services/admin/admin-user.service");

async function create(req, res) {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const user = await createUser(validatedData);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to create user",
    });
  }
}

module.exports = {
  create,
};
