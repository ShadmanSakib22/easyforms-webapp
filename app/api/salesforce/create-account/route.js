import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();

  const SF_AUTH_URL = process.env.SALESFORCE_AUTH_URL;
  const SF_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID;
  const SF_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET;

  try {
    // Get Salesforce access token
    const authResponse = await fetch(`${SF_AUTH_URL}/services/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: SF_CLIENT_ID,
        client_secret: SF_CLIENT_SECRET,
      }),
    });

    const { access_token, instance_url } = await authResponse.json();

    // Create Account
    const accountResponse = await fetch(
      `${instance_url}/services/data/v57.0/sobjects/Account`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: data.company,
          Industry: data.industry,
          Description: data.description,
        }),
      }
    );

    const accountResult = await accountResponse.json();

    // Create Contact
    const contactResponse = await fetch(
      `${instance_url}/services/data/v57.0/sobjects/Contact`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          AccountId: accountResult.id,
          Email: data.userEmail,
          Phone: data.phone,
        }),
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
