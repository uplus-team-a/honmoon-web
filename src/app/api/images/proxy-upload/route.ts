import { NextRequest, NextResponse } from "next/server";

/**
 * 서버를 통해 이미지를 프록시 업로드하는 API
 * CORS 문제를 우회하기 위해 서버에서 대신 업로드를 처리
 */
export async function POST(req: NextRequest) {
  try {
    console.log("프록시 업로드 시작");

    // 인증 헤더 확인
    const authorization = req.headers.get("authorization");
    if (!authorization) {
      console.error("인증 헤더 없음");
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // FormData에서 파일과 업로드 URL 추출
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const uploadUrl = formData.get("uploadUrl") as string;

    console.log("받은 데이터:", {
      fileName: file?.name,
      fileSize: file?.size,
      uploadUrlExists: !!uploadUrl,
    });

    if (!file || !uploadUrl) {
      console.error("파일 또는 업로드 URL 누락");
      return NextResponse.json(
        { message: "file and uploadUrl are required" },
        { status: 400 }
      );
    }

    // File을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    console.log("파일 변환 완료, 크기:", arrayBuffer.byteLength);

    // 서버에서 presigned URL로 업로드 수행
    console.log("presigned URL로 업로드 시작:", uploadUrl);
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: arrayBuffer,
      headers: {
        "Content-Type": file.type,
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });

    console.log("업로드 응답:", {
      status: uploadResponse.status,
      statusText: uploadResponse.statusText,
      headers: Object.fromEntries(uploadResponse.headers.entries()),
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse
        .text()
        .catch(() => "알 수 없는 오류");
      console.error("서버 업로드 실패:", errorText);
      return NextResponse.json(
        { message: `업로드 실패: ${errorText}` },
        { status: uploadResponse.status }
      );
    }

    console.log("프록시 업로드 성공!");
    return NextResponse.json({
      message: "Upload successful",
      status: 200,
    });
  } catch (error) {
    console.error("프록시 업로드 오류:", error);
    return NextResponse.json(
      {
        message: `Internal server error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
