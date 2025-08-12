export default function CustomerCentorInfo() {
  return (
    <section className="mt-10 px-4 py-6 border-t">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">고객센터</h2>
        <a
          className="text-sm text-neutral-700 underline"
          href="mailto:honmoon.site@gmail.com"
        >
          honmoon.site@gmail.com
        </a>
      </div>

      <h3 className="text-[15px] font-semibold mb-2">자주 묻는 질문</h3>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.06)]">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <th className="text-left px-4 py-3 w-[22%]">구분</th>
              <th className="text-left px-4 py-3 w-[30%]">질문</th>
              <th className="text-left px-4 py-3">답변</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            <tr>
              <td className="px-4 py-3 text-neutral-800 font-medium">로그인</td>
              <td className="px-4 py-3 text-neutral-800">
                이메일로 로그인은 어떻게 하나요?
              </td>
              <td className="px-4 py-3 text-neutral-700">
                회원가입/로그인 시 입력한 이메일로 전송된 매직 링크를 클릭하면
                즉시 로그인됩니다. 링크가 오지 않았다면 스팸함을 확인해주세요.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-neutral-800 font-medium">
                미션 유형
              </td>
              <td className="px-4 py-3 text-neutral-800">
                객관식/텍스트/이미지 업로드 차이는?
              </td>
              <td className="px-4 py-3 text-neutral-700">
                객관식(예: “광화문 역사 퀴즈”)은 보기 중 정답 선택, 텍스트(예:
                “한강 다리 퀴즈”)는 정답을 직접 입력, 이미지 업로드(예:
                “남산타워 야경 사진”)는 안내에 따라 사진을 업로드합니다.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-neutral-800 font-medium">
                사진 업로드
              </td>
              <td className="px-4 py-3 text-neutral-800">
                이미지 미션은 어떻게 제출하나요?
              </td>
              <td className="px-4 py-3 text-neutral-700">
                미션 상세의 안내문을 확인한 뒤, 현장에서 촬영한 사진을 선택해
                업로드하세요. 업로드 완료 후 제출을 누르면 검증이 진행됩니다.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-neutral-800 font-medium">
                장소 방문
              </td>
              <td className="px-4 py-3 text-neutral-800">
                PLACE_VISIT 미션은 무엇인가요?
              </td>
              <td className="px-4 py-3 text-neutral-700">
                특정 장소(예: 경복궁, 덕수궁 등)를 방문해 지정된 조건을 충족하면
                완료 처리됩니다. 상세 화면의 안내를 참고하세요.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-neutral-800 font-medium">포인트</td>
              <td className="px-4 py-3 text-neutral-800">
                포인트는 어디서 확인하나요?
              </td>
              <td className="px-4 py-3 text-neutral-700">
                미션 완료 시 포인트가 적립됩니다. 내 프로필의 포인트 카드에서
                총/사용 가능 포인트를 확인할 수 있습니다.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-neutral-800 font-medium">래플</td>
              <td className="px-4 py-3 text-neutral-800">
                응모 내역은 어디에서 보나요?
              </td>
              <td className="px-4 py-3 text-neutral-700">
                내 프로필 하단의 “Raffle 응모 내역”에서 확인 가능합니다.
                상품명/이미지/응모일/상태가 표시됩니다.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-neutral-800 font-medium">문의</td>
              <td className="px-4 py-3 text-neutral-800">
                문의는 어떻게 하나요?
              </td>
              <td className="px-4 py-3 text-neutral-700">
                상단의 고객센터 메일(
                <a className="underline" href="mailto:honmoon.site@gmail.com">
                  honmoon.site@gmail.com
                </a>
                )로 문의해 주세요.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
