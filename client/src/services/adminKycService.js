const API_URL = "http://localhost:5000/api";

export async function getAdminKycRecords(token) {
  const response = await fetch(`${API_URL}/admin/kyc`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch KYC records");
  }

  return data;
}

export async function updateKycStatus(token, userId, status) {
  const response = await fetch(
    `${API_URL}/admin/kyc/${userId}/status`,
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
    throw new Error(data.message || "Unable to update KYC status");
  }

  return data;
}
