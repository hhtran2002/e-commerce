import qs from "qs";
import dotenv from "dotenv";

dotenv.config();
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID!;
const REALM = process.env.KEYCLOAK_REALM!;
const KEYCLOAK_ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN_USERNAME!;
const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD!;
const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET!;

export async function getAdminToken() {
  const tokenResponse = await fetch(
    `http://keycloak:8080/realms/${REALM}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: qs.stringify({
        grant_type: "password",
        client_id: KEYCLOAK_CLIENT_ID,
        username: KEYCLOAK_ADMIN_USERNAME,
        password: KEYCLOAK_ADMIN_PASSWORD,
        client_secret: KEYCLOAK_CLIENT_SECRET,
      }),
    }
  );
  const data = await tokenResponse.json();
  return data["access_token"];
}

export async function reseterPassword(
  adminToken: string,
  keycloakId: string,
  newPassword: string
) {
  const response = await fetch(
    `http://keycloak:8080/admin/realms/${REALM}/users/${keycloakId}/reset-password`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "password",
        value: newPassword,
        temporary: false,
      }),
    }
  );
  return response.ok;
}
