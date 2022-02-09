<script>
    import Square from "./Square.svelte";

    export let squares = [];
    export let onClick = function onClick(i, j) {};
    export let winnerCoord = [];
</script>

<div>
    {#each squares as innerSquares, i (innerSquares.key)}
        <div class="board-row">
            {#each innerSquares.value as innerSquare, j (innerSquare.key)}
                <Square
                    value={innerSquare.value}
                    onClick={() => onClick(i, j)}
                    isMarked={winnerCoord.length === 3 &&
                        winnerCoord.find((v) => v.row === i && v.column === j)}
                />
            {/each}
        </div>
    {/each}
</div>

<style>
    .board-row:after {
        clear: both;
        content: "";
        display: table;
    }
</style>
