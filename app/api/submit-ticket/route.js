import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { Readable } from "stream";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // Email for notifications in Power Automate
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // Storage
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n"
); // Handle newline characters
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;

if (!GOOGLE_DRIVE_FOLDER_ID || !GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) {
  console.error(
    "FATAL ERROR: Missing one or more Google Drive environment variables."
  );
}

// JWT client for authentication
const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  ["https://www.googleapis.com/auth/drive"] // Scope for Google Drive
);

export async function POST(req) {
  const { userId } = await auth();

  if (!userId) {
    // User is not authenticated
    console.warn("Attempted to submit ticket without authentication.");
    return NextResponse.json({ error: "Login Required!" }, { status: 401 });
  }

  // Authenticate with Google Drive API
  try {
    await jwtClient.authorize();
  } catch (authError) {
    console.error("Google Drive authentication failed:", authError);
    return NextResponse.json(
      { error: "Ticket system is down 😔" },
      { status: 500 }
    );
  }

  const drive = google.drive({ version: "v3", auth: jwtClient });

  try {
    const { reportedBy, link, priority, summary } = await req.json();

    // Server-side validation of incoming data
    if (
      !reportedBy ||
      !link ||
      !priority ||
      !summary ||
      typeof summary !== "string" ||
      summary.trim() === ""
    ) {
      console.warn("Received incomplete or invalid ticket data.");
      return NextResponse.json(
        { error: "Missing or invalid required fields." },
        { status: 400 }
      );
    }

    // Basic validation for priority
    const validPriorities = ["High", "Average", "Low"];
    if (!validPriorities.includes(priority)) {
      console.warn(`Received invalid priority value: ${priority}`);
      return NextResponse.json(
        { error: "Invalid priority value provided." },
        { status: 400 }
      );
    }

    // Construct JSON data for the ticket
    const ticketJson = {
      "Reported by": reportedBy,
      Link: link,
      Priority: priority,
      Summary: summary.trim(),
      Timestamp: new Date().toISOString(),
      AdminEmail: ADMIN_EMAIL, // admin email for Power Automate
    };

    // Generate a unique filename (using timestamp and user ID)
    const filename = `help-ticket-${Date.now()}-${userId}.json`;

    // Convert JSON object to a string and then to a readable stream
    const jsonString = JSON.stringify(ticketJson, null, 2);
    const media = {
      mimeType: "application/json",
      body: Readable.from([jsonString]), // Create a stream from the string
    };

    // Upload the file to Google Drive
    const uploadResponse = await drive.files.create({
      requestBody: {
        name: filename,
        parents: [GOOGLE_DRIVE_FOLDER_ID], // Specify the target folder
      },
      media: media,
      fields: "id,name", // Request specific fields in the response
    });

    // Log success server-side
    console.log(
      `Successfully uploaded file to Google Drive: ${uploadResponse.data.name} (${uploadResponse.data.id})`
    );

    return NextResponse.json({
      success: true,
      message: "Ticket submitted successfully!",
    });
  } catch (error) {
    console.error(
      "Error submitting help ticket or uploading to Google Drive:",
      error
    );

    // Check if it's a Google Drive API error and log details server-side
    if (error.response && error.response.data && error.response.data.error) {
      console.error(
        "Google Drive API Error Details:",
        error.response.data.error
      );
      return NextResponse.json(
        {
          error: "Ticket system is down 😔",
        },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Ticket system is down 😔" },
      { status: 500 }
    );
  }
}
