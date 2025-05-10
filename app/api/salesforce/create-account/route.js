import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();

  const {
    SALESFORCE_AUTH_URL,
    SALESFORCE_CLIENT_ID,
    SALESFORCE_CLIENT_SECRET,
    SALESFORCE_USERNAME,
    SALESFORCE_PASSWORD,
  } = process.env;

  try {
    const { access_token, instance_url } = await getAccessToken({
      SALESFORCE_AUTH_URL,
      SALESFORCE_CLIENT_ID,
      SALESFORCE_CLIENT_SECRET,
      SALESFORCE_USERNAME,
      SALESFORCE_PASSWORD,
    });

    const accountId = await getOrCreateAccount({
      access_token,
      instance_url,
      company: data.company,
    });

    const contactResult = await createContact({
      access_token,
      instance_url,
      accountId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.userEmail,
      phone: data.phone,
    });

    return NextResponse.json({
      success: true,
      accountId,
      contactId: contactResult.id,
    });
  } catch (error) {
    console.error("Unhandled Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ------------------- HELPERS ------------------------

async function getAccessToken({
  SALESFORCE_AUTH_URL,
  SALESFORCE_CLIENT_ID,
  SALESFORCE_CLIENT_SECRET,
  SALESFORCE_USERNAME,
  SALESFORCE_PASSWORD,
}) {
  const res = await fetch(`${SALESFORCE_AUTH_URL}/services/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: SALESFORCE_CLIENT_ID,
      client_secret: SALESFORCE_CLIENT_SECRET,
      username: SALESFORCE_USERNAME,
      password: SALESFORCE_PASSWORD,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Salesforce Auth Failed: ${res.status} - ${errorText}`);
  }

  return res.json();
}

async function getOrCreateAccount({ access_token, instance_url, company }) {
  // Skip account creation if no company is provided
  if (!company) {
    console.warn("No company name provided — skipping Account creation.");
    return null;
  }

  const query = `SELECT Id FROM Account WHERE Name = '${company}' LIMIT 1`;
  const queryRes = await fetch(
    `${instance_url}/services/data/v57.0/query/?q=${encodeURIComponent(query)}`,
    {
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );

  if (!queryRes.ok) {
    const errorText = await queryRes.text();
    throw new Error(`Account lookup failed: ${queryRes.status} - ${errorText}`);
  }

  const data = await queryRes.json();
  if (data.records.length > 0) {
    console.log("Existing account found:", data.records[0].Id);
    return data.records[0].Id;
  }

  // No existing account — create one
  const createRes = await fetch(
    `${instance_url}/services/data/v57.0/sobjects/Account`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Name: company }),
    }
  );

  if (!createRes.ok) {
    const errorBody = await createRes.json();
    throw new Error(`Account creation failed: ${JSON.stringify(errorBody)}`);
  }

  const result = await createRes.json();
  console.log("New account created:", result.id);
  return result.id;
}

async function createContact({
  access_token,
  instance_url,
  accountId,
  firstName,
  lastName,
  email,
  phone,
}) {
  const body = {
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Phone: phone,
  };

  if (accountId) body.AccountId = accountId;

  const res = await fetch(
    `${instance_url}/services/data/v57.0/sobjects/Contact`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(`Contact creation failed: ${JSON.stringify(errorBody)}`);
  }

  const result = await res.json();
  console.log("Contact created:", result);

  await prisma.user.update({
    where: { email: email },
    data: { salesforce: "connected" },
  });

  return result;
}
