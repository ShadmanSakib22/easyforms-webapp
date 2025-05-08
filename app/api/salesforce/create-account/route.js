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

    if (!authResponse.ok) {
      const errorBody = await authResponse.text();
      console.error(
        "Salesforce Authentication Failed:",
        authResponse.status,
        errorBody
      );
      return NextResponse.json(
        {
          error: `Salesforce Authentication Failed: ${authResponse.status} - ${errorBody}`,
        },
        { status: 401 } // Use 401 for unauthorized
      );
    }

    const { access_token, instance_url } = await authResponse.json();
    console.log(
      "Successfully obtained Salesforce access token and instance URL."
    );

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

    if (!accountResponse.ok) {
      const errorBody = await accountResponse.json();
      console.error(
        "Error Creating Account:",
        accountResponse.status,
        errorBody
      );
      return NextResponse.json(
        {
          error: `Error Creating Account: ${
            accountResponse.status
          } - ${JSON.stringify(errorBody)}`,
        },
        { status: accountResponse.status }
      );
    }

    const accountResult = await accountResponse.json();
    console.log("Account Created:", accountResult);

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
          FirstName: data.firstName,
          LastName: data.lastName,
          Email: data.userEmail,
          Phone: data.phone,
        }),
      }
    );

    if (!contactResponse.ok) {
      const errorBody = await contactResponse.json();
      console.error(
        "Error Creating Contact:",
        contactResponse.status,
        errorBody
      );
      return NextResponse.json(
        {
          error: `Error Creating Contact: ${
            contactResponse.status
          } - ${JSON.stringify(errorBody)}`,
        },
        { status: contactResponse.status }
      );
    }

    const contactResult = await contactResponse.json();
    console.log("Contact Created:", contactResult);

    return NextResponse.json({
      success: true,
      accountId: accountResult.id,
      contactId: contactResult.id,
    });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
