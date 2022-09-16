<script>
    import { getPlayerInfo } from "../services/guilds";
  import { guildOpponentInfo } from "../store/guilds";


  export let players, champion;
  const player = players.find(i => i.fray_index === champion.fray_index);
  let result = 0;

  if (player && champion.defeated) {
    if (champion.defeated.includes(player.player)) {
        result = 1;
    }
  
    if (!champion.defeated.includes(player.player) && (player.defeated && player.defeated.includes(champion.player))) {
      result = 2
    }
  
    if (!result) {
      result = 3
    }
  }

  const viewInfo = async (player) => {
    const info = await getPlayerInfo(player.player);
    $guildOpponentInfo = info;
  }
</script>

<div class="text-nowrap">
  {#if result === 1}
    <span class="text-success me-1">&#8226;</span>
  {:else if result === 2}
    <span class="text-danger me-1">&#8226;</span>
  {:else if result === 3}
    <span class="text-warning me-1">&#8226;</span>
  {:else}
    <span class="text-muted">--</span>
  {/if}
  {#if player && player.player}
  <span class="small text-muted"
    role="button"
    data-bs-toggle="modal"
    data-bs-target="#playerInfo"
    on:click={() => viewInfo(player)}
  >{ player.player}</span>
  {:else}
    <span class="small text-muted"></span>
  {/if}
</div>