/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL?.replace(/^jdbc:/, ""),
  ssl: { rejectUnauthorized: false },
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
});

export async function POST(req: Request, context: any) {
  const missionId = Number((context?.params as { id: string }).id);
  if (!missionId)
    return NextResponse.json(
      { message: "invalid mission id" },
      { status: 400 }
    );
  try {
    type SubmitBody = {
      textAnswer?: string;
      selectedChoiceIndex?: number;
      uploadedImageUrl?: string;
    };
    const body: SubmitBody = await req.json().catch(() => ({} as SubmitBody));
    const { textAnswer, selectedChoiceIndex, uploadedImageUrl } = body || {};

    // 활동 기록과 점수 처리는 간소화 버전: mission_detail에서 points 읽어 적립
    const client = await pool.connect();
    try {
      const m = await client.query(
        `select id, points as points_reward from mission_detail where id=$1`,
        [missionId]
      );
      if (m.rowCount === 0) {
        return NextResponse.json(
          { message: "mission not found" },
          { status: 404 }
        );
      }
      const points = Number(m.rows[0].points_reward || 0);
      const isCorrect = true; // 서버 정답 검증은 별도 확장 포인트로 두고, 일단 성공 처리

      // 간단 활동 로그 (옵션)
      await client
        .query(
          `insert into user_activity_logs(mission_id, text_answer, choice_index, image_url)
         values ($1,$2,$3,$4) on conflict do nothing`,
          [
            missionId,
            textAnswer ?? null,
            selectedChoiceIndex ?? null,
            uploadedImageUrl ?? null,
          ]
        )
        .catch(() => {});

      return NextResponse.json({
        data: { isCorrect, pointsEarned: points },
        status: 200,
        message: "OK",
      });
    } finally {
      client.release();
    }
  } catch (e) {
    console.error("submit mission error", e);
    return NextResponse.json({ message: "submit failed" }, { status: 500 });
  }
}
