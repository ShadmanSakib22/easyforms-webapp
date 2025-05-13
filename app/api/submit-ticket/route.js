import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { Dropbox } from "dropbox";
import fetch from "node-fetch";

const DROPBOX_UPLOAD_PATH = process.env.DROPBOX_UPLOAD_PATH;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Dropbox Access Token
const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;

// Initialize Dropbox client
let dbx;
if (DROPBOX_ACCESS_TOKEN) {
  dbx = new Dropbox({
    accessToken: DROPBOX_ACCESS_TOKEN,
    fetch: fetch,
  });
} else {
  console.error(
    "FATAL ERROR: DROPBOX_ACCESS_TOKEN environment variable is not set."
  );
}

export async function POST(req) {
  const { userId } = await auth();

  if (!userId) {
    console.warn("Attempted to submit ticket without authentication.");
    return NextResponse.json({ error: "Login Required!" }, { status: 401 });
  }

  // Check for required environment variables and Dropbox client initialization
  if (!dbx || !DROPBOX_UPLOAD_PATH || !ADMIN_EMAIL) {
    console.error(
      "FATAL ERROR: Missing one or more required environment variables (Dropbox or Admin Email) or Dropbox client not initialized."
    );
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

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

    // Construct the JSON data for the ticket
    const ticketJson = {
      "Reported by": reportedBy,
      Link: link,
      Priority: priority,
      Summary: summary.trim(),
      Timestamp: new Date().toISOString(),
      AdminEmail: ADMIN_EMAIL,
    };

    // Generate a unique filename (e.g., using timestamp and user ID)
    const filename = `help-ticket-${Date.now()}-${userId}.json`;
    // Construct the full path in Dropbox
    // Ensure the path starts with a '/'
    const filePath = `${
      DROPBOX_UPLOAD_PATH.startsWith("/") ? "" : "/"
    }${DROPBOX_UPLOAD_PATH}/${filename}`;

    // Convert JSON object to a string and then to a Buffer for Dropbox upload
    const jsonString = JSON.stringify(ticketJson, null, 2);
    const fileBuffer = Buffer.from(jsonString);

    // Upload the file to Dropbox
    const uploadResponse = await dbx.filesUpload({
      path: filePath,
      contents: fileBuffer,
      mode: { ".tag": "overwrite" }, // or add
      autorename: false, // if add, true
    });

    console.log(
      "Successfully uploaded file to Dropbox:",
      uploadResponse.result.path_display
    );

    return NextResponse.json({
      success: true,
      message: "Ticket submitted successfully!",
    });
  } catch (error) {
    console.error(
      "Error submitting help ticket or uploading to Dropbox:",
      error
    );

    // Check if it's a Dropbox API error
    if (error.error && error.error.error_summary) {
      console.error("Dropbox API Error Details:", error.error.error_summary);
      return NextResponse.json(
        { error: `Dropbox API Error: ${error.error.error_summary}` },
        { status: 500 }
      );
    }

    // Handle other potential errors
    return NextResponse.json(
      { error: "Ticket system is down 😔" },
      { status: 500 }
    );
  }
}
