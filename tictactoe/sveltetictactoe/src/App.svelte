<script>
  import Board from "./lib/Board.svelte";

  const resultBuilder = function resultBuilder(a) {
    if (a < 3) {
      return { row: 0, column: a };
    }
    if (a >= 3 && a < 6) {
      return { row: 1, column: a % 3 };
    }
    if (a >= 6 && a < 9) {
      return { row: 2, column: a % 3 };
    }

    return { row: 0, column: 0 };
  };

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

    const squares = nestedSquares
      .map((v) => v.value)
      .flat()
      .map((v) => v.value);

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return lines[i];
      }
    }
    return null;
  };

  let state = {
    history: [
      {
        squares: Array.from(Array(3), (_, i) => ({
          key: i,
          value: Array.from(Array(3).fill(null), (x, i) => ({
            key: i,
            value: x,
          })),
        })),
        row: 0,
        column: 0,
        icon: "",
      },
    ],
    stepSelected: -1,
    stepNumber: 0,
    xIsNext: true,
  };

  const handleClick = function handleClick(i, j) {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];

    const squares = JSON.parse(JSON.stringify(current.squares));
    if (calculateWinner(squares) || squares[i].value[j].value) {
      return;
    }

    const icon = state.xIsNext ? "X" : "0";
    squares[i].value[j].value = icon;

    state = {
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
    };
  };

  const jumpTo = function jumpTo(step) {
    state = {
      ...state,
      stepSelected: step,
      stepNumber: step,
      xIsNext: step % 2 === 0,
    };
  };

  $: history = state.history;
  $: current = history[state.stepNumber];
  $: moves = history.map((step, move) => step);

  $: winner = calculateWinner(current.squares);
  $: winnerCoord = winner ? winner.map((v) => resultBuilder(v)) : [];
  $: status = ((winner, winnerCoord) => {
    if (winnerCoord && winnerCoord.length === 0 && history.length === 10) {
      return "Draw";
    }

    return winner
      ? `Winner: ${state.xIsNext ? "O" : "X"}`
      : `Next player: ${state.xIsNext ? "X" : "O"}`;
  })(winner, winnerCoord);
</script>

<div class="game">
  <div class="game-board">
    <Board
      squares={current.squares}
      onClick={(i, j) => handleClick(i, j)}
      {winnerCoord}
    />
  </div>
  <div class="game-info">
    <div>{status}</div>
    <ol>
      {#each moves as step, move (move)}
        <li style:font-weight={state.stepSelected === move ? "bold" : ""}>
          <p>{move ? `${step.icon}${step.row + 1}${step.column + 1}` : ""}</p>
          <button on:click={() => jumpTo(move)}>
            {move ? `Go to move #${move}` : "Go to game start"}
          </button>
        </li>
      {/each}
    </ol>
  </div>
</div>

<style>
  ol {
    padding-left: 30px;
  }

  .game {
    display: flex;
    flex-direction: row;
  }

  .game-info {
    margin-left: 20px;
  }
</style>
