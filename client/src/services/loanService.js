const API_URL = "http://localhost:5000/api";

export async function getLoanOffers(token) {
  if (!token) {
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_URL}/loans`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch loan offers");
  }

  return data;
}
