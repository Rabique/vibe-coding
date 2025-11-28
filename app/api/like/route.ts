import { NextResponse } from "next/server";
import { supabase } from "../supabase/route";

// GET: 현재 좋아요 수 조회
export async function GET(request: Request) {
  try {
    const clientId = request.headers.get("x-client-id") || "anonymous";

    // 전체 좋아요 수 조회
    const { count, error: countError } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Supabase 좋아요 수 조회 오류:", countError);
      throw new Error(countError.message);
    }

    // 현재 클라이언트의 좋아요 상태 확인
    const { data: likedData, error: likedError } = await supabase
      .from("likes")
      .select("id")
      .eq("client_id", clientId)
      .single();

    if (likedError && likedError.code !== "PGRST116") { // PGRST116: No rows found
      console.error("Supabase 클라이언트 좋아요 상태 조회 오류:", likedError);
      throw new Error(likedError.message);
    }

    const isLiked = !!likedData;

    return NextResponse.json(
      {
        success: true,
        data: {
          count: count || 0,
          isLiked: isLiked,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, x-client-id",
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

    const clientId = request.headers.get("x-client-id") || "anonymous";

    if (clientId === "anonymous") {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication Error",
          message: "클라이언트 ID가 필요합니다.",
        },
        { status: 401 }
      );
    }

    // 현재 클라이언트의 좋아요 상태 확인
    const { data: existingLike, error: fetchError } = await supabase
      .from("likes")
      .select("id")
      .eq("client_id", clientId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") { // PGRST116: No rows found
      console.error("Supabase 좋아요 상태 확인 오류:", fetchError);
      throw new Error(fetchError.message);
    }

    let message = "";

    if (action === "like" && !existingLike) {
      // 좋아요 추가
      const { error } = await supabase.from("likes").insert([{ client_id: clientId }]);
      if (error) {
        console.error("Supabase 좋아요 추가 오류:", error);
        throw new Error(error.message);
      }
      message = "좋아요가 추가되었습니다.";
    } else if (action === "unlike" && existingLike) {
      // 좋아요 취소
      const { error } = await supabase.from("likes").delete().eq("client_id", clientId);
      if (error) {
        console.error("Supabase 좋아요 취소 오류:", error);
        throw new Error(error.message);
      }
      message = "좋아요가 취소되었습니다.";
    } else if (action === "like" && existingLike) {
      message = "이미 좋아요를 눌렀습니다.";
    } else if (action === "unlike" && !existingLike) {
      message = "좋아요를 누르지 않았습니다.";
    }

    // 업데이트된 전체 좋아요 수 조회
    const { count, error: countError } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Supabase 좋아요 수 조회 오류:", countError);
      throw new Error(countError.message);
    }

    // 최종적으로 좋아요 상태 다시 확인
    const { data: finalLikedData, error: finalLikedError } = await supabase
      .from("likes")
      .select("id")
      .eq("client_id", clientId)
      .single();
    
    const isLiked = !!finalLikedData;

    return NextResponse.json(
      {
        success: true,
        data: {
          count: count || 0,
          isLiked: isLiked,
        },
        message: message,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, x-client-id",
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
      "Access-Control-Allow-Headers": "Content-Type, x-client-id",
    },
  });
}

