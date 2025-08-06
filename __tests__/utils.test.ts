import { cn } from "../src/shared/lib/utils";

describe("cn 유틸리티 함수", () => {
  test("기본 클래스명을 조합할 수 있어야 한다", () => {
    const result = cn("bg-red-500", "text-white");
    expect(result).toBe("bg-red-500 text-white");
  });

  test("조건부 클래스명을 처리할 수 있어야 한다", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  test("false 조건부 클래스명을 제외할 수 있어야 한다", () => {
    const isActive = false;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class");
  });

  test("배열 형태의 클래스명을 처리할 수 있어야 한다", () => {
    const result = cn(["class1", "class2"], "class3");
    expect(result).toBe("class1 class2 class3");
  });

  test("객체 형태의 조건부 클래스명을 처리할 수 있어야 한다", () => {
    const result = cn("base-class", {
      "active-class": true,
      "inactive-class": false,
    });
    expect(result).toBe("base-class active-class");
  });

  test("Tailwind 클래스 충돌을 해결할 수 있어야 한다", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  test("빈 문자열과 undefined를 처리할 수 있어야 한다", () => {
    const result = cn("base-class", "", undefined, null);
    expect(result).toBe("base-class");
  });
});
