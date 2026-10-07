const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const { getUsers, saveUsers } = require("../../utils/userStore");
const { generateToken } = require("../../utils/jwt");

async function registerUser({ fullName, email, phone, password }) {
  const users = await getUsers();

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = users.find(
    (user) => user.email === normalizedEmail
  );

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone,
    password: passwordHash,
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  await saveUsers(users);

  return sanitizeUser(newUser);
}

async function loginUser({ email, password }) {
  const users = await getUsers();

  const normalizedEmail = email.toLowerCase().trim();

  const user = users.find(
    (user) => user.email === normalizedEmail
  );

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: sanitizeUser(user),
  };
}

async function getUserById(userId) {
  const users = await getUsers();

  const user = users.find((item) => item.id === userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
}

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
