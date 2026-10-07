const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const usersFile = path.join(__dirname, "../../../data/users.json");

async function getUsers() {
  const data = await fs.readFile(usersFile, "utf8");

  try {
    return JSON.parse(data);
  } catch {
    throw new Error("users.json contains invalid JSON");
  }
}

async function saveUsers(users) {
  await fs.writeFile(
    usersFile,
    JSON.stringify(users, null, 2),
    "utf8"
  );
}

async function createUser({
  fullName,
  email,
  phone,
  password,
  role = "customer",
}) {
  const users = await getUsers();

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail
  );

  if (existingUser) {
    const error = new Error("A user with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const existingPhone = users.find(
    (user) => user.phone === phone
  );

  if (existingPhone) {
    const error = new Error("A user with this phone number already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone,
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  await saveUsers(users);

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
  createUser,
};
