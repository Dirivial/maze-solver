import { useState, useEffect } from "react";

import Cell from "./cell";

type MazeProps = {
  width: number;
  height: number;
};

type GeneratedCell = {
  x: number;
  y: number;
  visited: boolean;
  wall: boolean;
};

type CellCoord = {
  x: number;
  y: number;
};

type addWallsProps = {
  maze: GeneratedCell[][];
  walls: GeneratedCell[];
  x: number;
  y: number;
};

const Maze = ({ width, height }: MazeProps) => {
  const [size, setSize] = useState({
    width: width * 1.75 + "rem",
    height: height * 1.75 + "rem",
  });
  const [cells, setCells] = useState<GeneratedCell[][]>([]);
  const [wallStack, setWallStack] = useState<GeneratedCell[]>([]);

  const generateCells = () => {
    let maze: GeneratedCell[][] = [];

    // Fill maze
    for (let i = 0; i < height; i++) {
      maze[i] = [];
      for (let j = 0; j < width; j++) {
        if (i > 0 && i < height - 1 && j > 0 && j < width - 1) {
          (maze[i] as GeneratedCell[]).push({
            x: j,
            y: i,
            visited: false,
            wall: false,
          });
        } else {
          (maze[i] as GeneratedCell[]).push({
            x: j,
            y: i,
            visited: false,
            wall: true,
          });
        }
      }
    }

    // Choose a starting point -- as of now on the first row but should be random
    let randomX = Math.floor(Math.random() * (width - 2)) + 1;
    let randomY = Math.floor(Math.random() * (height - 2)) + 1;
    let walls: GeneratedCell[] = [];
    if (maze[randomY]![randomX]) {
      (maze[randomY]![randomX] as GeneratedCell).visited = true;
      (maze[randomY]![randomX] as GeneratedCell).wall = false;
      for (let i = -1; i < 2; i += 2) {
        if (maze[i + randomY]?.[randomX]) {
          maze[i + randomY]![randomX]!.wall = true;
          walls.push(maze[i + randomY]![randomX]!);
        }
        if (maze[randomY]?.[i + randomX]) {
          maze[randomY]![i + randomX]!.wall = true;
          walls.push(maze[randomY]![i + randomX]!);
        }
      }
    }

    setCells(maze);
    setWallStack(walls);
  };

  const generateMaze = () => {
    let walls = [...wallStack];
    let maze = [...cells];
    while (walls.length > 0) {
      let someWall = walls.splice(
        Math.floor(Math.random() * wallStack.length),
        1
      )[0];

      if (someWall) {
        let x = someWall.x;
        let y = someWall.y;

        if (y > 0 && y < height - 1 && x > 0 && x < width - 1) {
          for (let i = -1; i < 2; i += 2) {
            if (
              (!maze.at(y - i)?.at(x)?.visited &&
                maze.at(y + i)?.at(x)?.visited) ||
              (!maze.at(y)?.at(x - i)?.visited &&
                maze.at(y)?.at(x + i)?.visited)
            ) {
              if (calcSurroundingCells({ x, y }) < 2) {
                maze.at(y)!.at(x)!.visited = true;
                maze.at(y)!.at(x)!.wall = false;

                // Add surrounding cells as walls, if they should be added
                addWalls({ maze, walls, x, y });
              }
            }
          }
        }
      }
    }

    setWallStack(walls);
    setCells(maze);
  };

  const calcSurroundingCells = ({ x, y }: CellCoord) => {
    let sumOfSurrounding: number = 0;

    for (let i = -1; i < 2; i += 2) {
      if (cells.at(y + i)?.at(x)?.visited) {
        sumOfSurrounding++;
      }
      if (cells.at(y)?.at(x + i)?.visited) {
        sumOfSurrounding++;
      }
    }
    return sumOfSurrounding;
  };

  const addWalls = ({ maze, walls, x, y }: addWallsProps) => {
    for (let i = -1; i < 2; i += 2) {
      if (
        y > 0 &&
        y < height - 1 &&
        !maze.at(y + i)!.at(x)!.visited &&
        !maze.at(y + i)!.at(x)!.wall
      ) {
        maze.at(y + i)!.at(x)!.wall = true;
        walls.push(maze.at(y + i)!.at(x)!);
      }
      if (
        x > 0 &&
        x < width - 1 &&
        !maze.at(y)!.at(x + i)!.visited &&
        !maze.at(y)!.at(x + i)!.wall
      ) {
        maze.at(y)!.at(x + i)!.wall = true;
        walls.push(maze.at(y)!.at(x + i)!);
      }
    }
  };

  useEffect(() => {
    generateCells();
    setSize({ width: width * 1.75 + "rem", height: height * 1.75 + "rem" });
  }, [width, height]);

  return (
    <div className="rounded border justify-center items-center flex flex-col bg-orange-300 p-2">
      <div className="flex flex-wrap p-3 gap-2">
        <button onClick={generateCells} className="border p-1">
          Generate new maze
        </button>
        <button onClick={generateMaze} className="border p-1">
          Next step
        </button>
        <button className="border p-1">Next snapshot</button>
      </div>

      <div style={{ width: size.width, height: size.height }} className="">
        {cells?.flat().map((cell, index) => {
          return (
            <Cell
              key={index}
              x={cell.x}
              y={cell.y}
              visited={cell.visited}
              wall={cell.wall}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Maze;
