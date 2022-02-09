import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const resultBuilder = function resultBuilder(a) {
  if (a < 3) {
    return { row: 0, column: a };
  }
  if (a >= 3 && a < 6) {
    return { row: 1, column: a % 3 }
  }
  if (a >= 6 && a < 9) {
    return { row: 2, column: a % 3 }
  }

  return { row: 0, column: 0 }
}

const calculateWinner = function calculateWinner(nestedSquares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const squares = nestedSquares.map((v) => v.value).flat().map((v) => v.value);

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
};

const Square = function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()} style={{ backgroundColor: props.isMarked ? "green" : "" }}>
      {props.value}
    </button>
  );
};

const Board = function Board(props) {
  return (
    <div>
      {props.squares.map((innerSquares, i) => {
        return <div key={innerSquares.key} className="board-row">
          {innerSquares.value.map((innerSquare, j) => {
            return (
              <Square
                key={innerSquare.key}
                value={innerSquare.value}
                onClick={() => props.onClick(i, j)}
                isMarked={
                  props.winnerCoord.length === 3
                  && props.winnerCoord.find(v => v.row === i && v.column === j)
                }
              />
            )
          }
          )}
        </div>
      }
      )}
    </div>
  );
};

const Game = function Game() {
  const [state, setState] = useState({
    history: [
      {
        squares: Array.from(Array(3), (_, i) => ({ key: i, value: Array.from(Array(3).fill(null), (x, i) => ({ key: i, value: x })) })),
        row: 0,
        column: 0,
        icon: '',
      },
    ],
    stepSelected: -1,
    stepNumber: 0,
    xIsNext: true,
  });

  const handleClick = function handleClick(i, j) {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];

    const squares = JSON.parse(JSON.stringify(current.squares))
    if (calculateWinner(squares) || squares[i].value[j].value) {
      return;
    }

    const icon = state.xIsNext ? 'X' : '0';
    squares[i].value[j].value = icon;

    setState({
      history: history.concat([
        {
          squares: squares,
          row: i,
          column: j,
          icon: icon,
        },
      ]),
      stepSelected: -1,
      stepNumber: history.length,
      xIsNext: !state.xIsNext,
    });
  };

  const jumpTo = function jumpTo(step) {
    setState({
      ...state,
      stepSelected: step,
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  };

  const history = state.history;
  const current = history[state.stepNumber];

  const moves = history.map((step, move) => {
    const title = move ? `${step.icon}${step.row + 1}${step.column + 1}` : "";
    const desc = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move} style={{ fontWeight: state.stepSelected === move ? "bold" : "" }}>
        <p>{title}</p>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status = `Next player: ${state.xIsNext ? 'X' : 'O'}`;
  let winnerCoord = []
  const winner = calculateWinner(current.squares);
  if (winner) {
    status = `Winner: ${state.xIsNext ? 'O' : 'X'}`;
    winnerCoord = winner.map(v => resultBuilder(v))
  }

  if (winnerCoord.length === 0 && history.length === 10) {
    status = "Draw"
  }


  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i, j) => handleClick(i, j)}
          winnerCoord={winnerCoord}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);
