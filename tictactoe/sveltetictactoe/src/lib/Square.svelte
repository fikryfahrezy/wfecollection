<script>
    export let onClick = function onClick() {};
    export let isMarked = false;
    export let value = "";
</script>

<button
    class="square"
    on:click={() => onClick()}
    style:background-color={isMarked ? "green" : ""}
    >{value ? value : ""}</button
>

<style>
    .square {
        background: #fff;
        border: 1px solid #999;
        float: left;
        font-size: 24px;
        font-weight: bold;
        line-height: 34px;
        height: 34px;
        margin-right: -1px;
        margin-top: -1px;
        padding: 0;
        text-align: center;
        width: 34px;
    }

    .square:focus {
        outline: none;
        background: #ddd;
    }
</style>
