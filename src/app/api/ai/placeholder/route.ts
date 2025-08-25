import OpenAI from "openai";

/**
 * AI 호출 실패 시 사용할 다양한 기본 메시지들
 */
const getRandomDefaultMessage = (): string => {
  const messages = [
    "오늘은 어디로 놀러가볼까요?",
    "새로운 장소를 탐험해보세요!",
    "근처 맛집을 찾아볼까요?",
    "산책하기 좋은 곳을 둘러보세요",
    "특별한 추억을 만들어볼까요?",
    "어떤 곳이 궁금하신가요?",
    "여행 떠날 준비 되셨나요?",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

export async function GET() {
  const DEFAULT_TEXT = getRandomDefaultMessage();
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ text: DEFAULT_TEXT });
    }

    const client = new OpenAI({ apiKey });

    const now = new Date();
    const dateStr = now.toLocaleDateString("ko-KR", { dateStyle: "long" });
    const prompt = `너는 한국어 앱의 장소 검색창 플레이스홀더를 만드는 도우미야.
다음 요구사항을 정확히 지켜서 한 문장만 출력해.
- 오늘 날짜를 자연스럽게 반영할 것: ${dateStr}
- 30자 내외의 재치있는 드립 톤으로 작성할 것
- 장소/산책/여행/탐방을 떠올리게 하고 검색을 유도할 것
- 따옴표, 해시태그, 이모지 금지
- 출력은 한국어 텍스트 한 줄만 (예: 오늘 어디 가볼까?, 한강 야경 보러 갈래?)`;

    const result = (await Promise.race([
      client.responses.create({
        model: "gpt-4o-mini",
        temperature: 0.9,
        max_output_tokens: 40,
        input: prompt,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 1500)
      ),
    ])) as Awaited<ReturnType<typeof client.responses.create>>;

    type MinimalResponseLike = { output_text?: unknown };
    const maybe = result as unknown as MinimalResponseLike;
    const raw = typeof maybe?.output_text === "string" ? maybe.output_text : "";
    const text =
      String(raw)
        .replace(/["'“”]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 40) || DEFAULT_TEXT;

    return Response.json({ text });
  } catch {
    return Response.json({ text: DEFAULT_TEXT });
  }
}
