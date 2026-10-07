const API_URL = "http://localhost:5000/api";

export async function createAdminUser(token, userData) {
  if (!token) {
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_URL}/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(`Server returned ${response.status}`);
  }

  if (!response.ok) {
    if (data.errors?.length) {
      const firstError = data.errors[0];

      const field =
        firstError.path?.length
          ? `${firstError.path.join(".")}: `
          : "";

      throw new Error(
        `${field}${firstError.message || data.message || "Validation failed"}`
      );
    }

    throw new Error(data.message || "Unable to create user");
  }

  return data;
}
