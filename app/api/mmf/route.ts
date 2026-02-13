import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Code parameter is required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(
      `https://mms.pd.mapia.io/mms/public/sheet/${code}`,
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch MMF metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 },
    );
  }
}
