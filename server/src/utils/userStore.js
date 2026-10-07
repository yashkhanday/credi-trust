const fs = require("fs/promises");
const path = require("path");

const usersFile = path.join(__dirname, "../../data/users.json");

async function ensureUsersFile() {
  try {
    await fs.access(usersFile);
  } catch {
    await fs.mkdir(path.dirname(usersFile), { recursive: true });
    await fs.writeFile(usersFile, "[]", "utf8");
  }
}

async function getUsers() {
  await ensureUsersFile();

  const data = await fs.readFile(usersFile, "utf8");

  try {
    return JSON.parse(data);
  } catch {
    throw new Error("users.json contains invalid JSON");
  }
}

async function saveUsers(users) {
  await ensureUsersFile();
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf8");
}

module.exports = {
  getUsers,
  saveUsers,
};
