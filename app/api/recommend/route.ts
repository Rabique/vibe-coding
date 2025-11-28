import { NextResponse } from "next/server";

const recommendations: string[] = [
  "처음은 누구나 어렵습니다. 하지만 당신의 열정은 코드를 움직이는 가장 강력한 엔진입니다!",
  "실수는 성장의 기회입니다. 버그는 당신을 더 강하게 만들 것입니다.",
  "매일 작은 코드라도 작성해보세요. 꾸준함이 비범함을 만듭니다.",
  "동료들과 지식을 나누세요. 함께 성장하는 것이 더 즐겁습니다.",
  "당신의 코드는 세상에 긍정적인 영향을 미칠 수 있습니다. 힘내세요!",
  "Vibe Coding은 코딩을 즐기는 문화입니다. 당신의 고유한 바이브를 찾으세요!",
  "깔끔한 코드는 예술입니다. 당신의 코드를 아름답게 만들어보세요.",
  "막다른 길에 부딪혔을 때는 잠시 쉬어가세요. 새로운 아이디어가 떠오를 것입니다.",
  "코딩은 마법과 같습니다. 당신의 상상력을 현실로 만들어보세요.",
  "Vibe Coding과 함께라면 어떤 도전도 이겨낼 수 있습니다. 화이팅!",
];

// GET: 랜덤 추천 메시지 조회
export async function GET() {
  try {
    const randomIndex = Math.floor(Math.random() * recommendations.length);
    const randomMessage = recommendations[randomIndex];

    return NextResponse.json(
      {
        success: true,
        data: {
          message: randomMessage,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
