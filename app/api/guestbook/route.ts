import { NextResponse } from "next/server";

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

// 메모리 기반 저장소 (실제로는 DB를 사용해야 함)
let guestbookEntries: GuestbookEntry[] = [
  {
    id: 1,
    name: "방문자1",
    message: "멋진 포트폴리오네요!",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "방문자2",
    message: "프로젝트들이 인상적입니다.",
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

// GET: 방명록 목록 조회
export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        data: guestbookEntries.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
        count: guestbookEntries.length,
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

    // 새 방명록 항목 생성
    const newEntry: GuestbookEntry = {
      id: nextId++,
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    guestbookEntries.push(newEntry);

    return NextResponse.json(
      {
        success: true,
        data: newEntry,
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

    const index = guestbookEntries.findIndex((entry) => entry.id === entryId);
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Not Found",
          message: "해당 방명록을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    guestbookEntries.splice(index, 1);

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

