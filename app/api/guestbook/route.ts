import { NextResponse } from "next/server";
import { supabase } from "../supabase/route"; // Supabase 클라이언트 import

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

// GET: 방명록 목록 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("guestbook")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase 방명록 조회 오류:", error);
      throw new Error(error.message);
    }

    const formattedData = data.map((entry: { id: number; name: string; message: string; created_at: string }) => ({
      id: entry.id,
      name: entry.name,
      message: entry.message,
      createdAt: new Date(entry.created_at).toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedData,
        count: formattedData.length,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST: 새로운 방명록 작성
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message } = body;

    // 유효성 검사
    if (!name || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: "이름과 메시지는 필수입니다.",
        },
        { status: 400 }
      );
    }

    if (name.trim().length === 0 || message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: "이름과 메시지는 비어있을 수 없습니다.",
        },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: "이름은 50자 이하여야 합니다.",
        },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: "메시지는 500자 이하여야 합니다.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("guestbook")
      .insert([{ name: name.trim(), message: message.trim() }])
      .select();

    if (error) {
      console.error("Supabase 방명록 작성 오류:", error);
      throw new Error(error.message);
    }

    const newEntry = data[0];

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newEntry.id,
          name: newEntry.name,
          message: newEntry.message,
          createdAt: new Date(newEntry.created_at).toISOString(),
        },
        message: "방명록이 성공적으로 작성되었습니다.",
      },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE: 방명록 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: "삭제할 방명록 ID가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const entryId = parseInt(id, 10);
    if (isNaN(entryId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: "유효하지 않은 ID입니다.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("guestbook").delete().eq("id", entryId);

    if (error) {
      console.error("Supabase 방명록 삭제 오류:", error);
      throw new Error(error.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "방명록이 성공적으로 삭제되었습니다.",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// OPTIONS: CORS 처리
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

