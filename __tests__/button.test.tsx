import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "../src/shared/components/ui/button";

describe("Button 컴포넌트", () => {
  test("기본 버튼이 렌더링되어야 한다", () => {
    render(<Button>테스트 버튼</Button>);
    const button = screen.getByRole("button", { name: "테스트 버튼" });
    expect(button).toBeInTheDocument();
  });

  test("다양한 variant가 적용되어야 한다", () => {
    const { rerender } = render(<Button variant="default">기본 버튼</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary");

    rerender(<Button variant="destructive">파괴적 버튼</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");

    rerender(<Button variant="outline">아웃라인 버튼</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("border");
  });

  test("다양한 size가 적용되어야 한다", () => {
    const { rerender } = render(<Button size="default">기본 크기</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("h-10");

    rerender(<Button size="sm">작은 크기</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("h-9");

    rerender(<Button size="lg">큰 크기</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("h-11");
  });

  test("disabled 상태가 적용되어야 한다", () => {
    render(<Button disabled>비활성화 버튼</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });

  test("onClick 이벤트가 작동해야 한다", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>클릭 버튼</Button>);
    const button = screen.getByRole("button");
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("asChild prop이 작동해야 한다", () => {
    render(
      <Button asChild>
        <a href="/test">링크 버튼</a>
      </Button>
    );
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });
});
