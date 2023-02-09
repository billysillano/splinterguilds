<script>
    import { onMount } from "svelte";
  import { BRAWL_TIER } from "../constants";

  export let level;
  let stars = [];

  onMount(() => {
    const tier = BRAWL_TIER[level]?.tier || 0;
    stars = Array(tier)
  })
</script>

{#if stars.length}
<span>
  {#each stars as star}
  ⭐
  {/each}
</span>
{:else}
  <span>💩</span>
{/if}