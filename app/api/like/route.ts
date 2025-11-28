import { NextResponse } from "next/server";

// 메모리 기반 저장소 (실제로는 DB를 사용해야 함)
let likeCount = 42; // 기본 더미 숫자
let likedUsers = new Set<string>(); // 좋아요를 누른 사용자 추적 (실제로는 세션이나 IP 기반)
let lastUpdated = new Date().toISOString();

// GET: 현재 좋아요 수 조회
export async function GET(request: Request) {
  try {
    // 클라이언트 식별자 (실제로는 세션이나 IP 기반)
    const clientId = request.headers.get("x-client-id") || "anonymous";
    const isLiked = likedUsers.has(clientId);

    return NextResponse.json(
      {
        success: true,
        data: {
          count: likeCount,
          isLiked: isLiked,
          lastUpdated: lastUpdated,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

// POST: 좋아요 토글 (추가/취소)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body; // "like" or "unlike"
    
    // 클라이언트 식별자 (실제로는 세션이나 IP 기반)
    const clientId = request.headers.get("x-client-id") || "anonymous";
    const isCurrentlyLiked = likedUsers.has(clientId);

    if (action === "like" && !isCurrentlyLiked) {
      // 좋아요 추가
      likeCount += 1;
      likedUsers.add(clientId);
      lastUpdated = new Date().toISOString();
    } else if (action === "unlike" && isCurrentlyLiked) {
      // 좋아요 취소
      likeCount = Math.max(0, likeCount - 1);
      likedUsers.delete(clientId);
      lastUpdated = new Date().toISOString();
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          count: likeCount,
          isLiked: likedUsers.has(clientId),
          lastUpdated: lastUpdated,
        },
        message: likedUsers.has(clientId) 
          ? "좋아요가 추가되었습니다." 
          : "좋아요가 취소되었습니다.",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

