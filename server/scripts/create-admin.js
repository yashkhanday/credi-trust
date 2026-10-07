const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

async function main() {
  const file = path.join(__dirname, "../data/users.json");

  const users = JSON.parse(
    await fs.readFile(file, "utf8")
  );

  const email = "admin@creditrust.local";
  const password = "Admin@123456";

  const existingAdmin = users.find(
    (user) => user.email === email
  );

  if (existingAdmin) {
    console.log("Admin already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  users.push({
    id: crypto.randomUUID(),
    fullName: "CrediTrust Admin",
    email,
    phone: "9000000000",
    password: passwordHash,
    role: "admin",
    createdAt: new Date().toISOString(),
  });

  await fs.writeFile(
    file,
    JSON.stringify(users, null, 2),
    "utf8"
  );

  console.log("Admin created successfully");
  console.log("Email:", email);
  console.log("Password:", password);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});