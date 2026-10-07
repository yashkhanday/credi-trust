const API_URL = "http://localhost:5000/api";

export async function getMyKyc(token) {
  const response = await fetch(`${API_URL}/kyc/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch KYC profile");
  }

  return data;
}

export async function saveMyKyc(token, profile) {
  const response = await fetch(`${API_URL}/kyc/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to save KYC profile");
  }

  return data;
}
