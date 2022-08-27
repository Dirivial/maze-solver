import { useState } from "react";

type CellProps = {
  x: number;
  y: number;
  visited: boolean;
};

const Cell = ({ x, y, visited }: CellProps) => {
  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;
    console.log("Cell @ ", x, y);
  };

  return (
    <button
      onClick={clickHandler}
      className={
        "rounded w-7 h-7 m-0 inline-block box-border" +
        (visited ? " bg-orange-500" : " bg-gray-400")
      }
      style={{ minWidth: "1.75rem" }}
    >
      {"‎"}
    </button>
  );
};

export default Cell;
export type { CellProps };
