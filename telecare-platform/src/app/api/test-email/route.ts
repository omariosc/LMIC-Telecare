import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test sending an email
    const testEmail = "test@nhs.net";
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    console.warn("Testing email with API URL:", apiUrl);

    const response = await fetch(`${apiUrl}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "tfa",
        email: testEmail,
        code: "451452",
        name: "Test User",
      }),
    });

    let result;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      // If we get HTML, it's likely an error page
      const text = await response.text();
      console.error("Received non-JSON response:", text.substring(0, 200));
      result = {
        error: "Received non-JSON response",
        details: "Check server logs",
      };
    }

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        details: `Email for ${testEmail} redirected to omar.choudhry1@hotmail.com`,
        result,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send test email",
          details: result,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Test email failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
