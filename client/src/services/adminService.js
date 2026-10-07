const API_URL = "http://localhost:5000/api";

export async function getAllApplications(token) {
  const response = await fetch(`${API_URL}/admin/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch applications");
  }

  return data;
}

export async function updateApplicationStatus(token, applicationId, status) {
  const response = await fetch(
    `${API_URL}/admin/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update status");
  }

  return data;
}
