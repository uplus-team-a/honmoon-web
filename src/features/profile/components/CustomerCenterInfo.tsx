export default function CustomerCentorInfo() {
    return (
      <section className="mt-10 px-4 py-6 border-t">
        <h2 className="text-lg font-semibold mb-2">고객센터 1111-1111</h2>
        <p className="text-sm mb-1">
          운영시간 평일 <span className="font-semibold">09:00 ~ 18:00</span>
        </p>
        <p className="text-sm mb-6">점심시간 평일 12:00 ~ 13:00</p>
  
        <div className="flex gap-4">
          <button className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-semibold">
            자주 묻는 질문
          </button>
          <button className="flex-1 border border-black text-black py-3 rounded-lg text-sm font-semibold">
            1 : 1 문의
          </button>
        </div>
      </section>
    );
  }
  