<script>
    import { onMount } from 'svelte';
  import {formatCompactNumber} from '../utils';

  export let brawl;
  export let status;
  let results = [];
  onMount(() => {
    results = brawl;
    console.log(results)
  })
</script>
{#if (results && results.length)} 
<div class="p-3 bg-dark">
  <table class="table table-sm small">
    <thead class="bg-darker">
      <tr>
        <th><div class="px-2">Guild</div></th>
        <th><div class="px-2">Place</div></th>
        <th><div class="px-2">Wins</div></th>
        <th><div class="px-2">Losses</div></th>
        <th><div class="px-2">Draws</div></th>
        <th><div class="px-2">Points</div></th>
        {#if status === 1}
          <th><div class="px-2">Battles</div></th>
        {:else if status === 2}
          <th><div class="px-2">Crowns</div></th>
          <th><div class="px-2">SPS</div></th>
          <th><div class="px-2">Merits</div></th>
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each results as guild, index}
      <tr>
        <td><div class="px-2">{guild.name}</div></td>
        <td><div class="px-2">{index + 1}</div></td>
        <td><div class="px-2">{guild.wins}</div></td>
        <td><div class="px-2">{guild.losses}</div></td>
        <td><div class="px-2">{guild.draws}</div></td>
        <td><div class="px-2">{guild.pts}</div></td>
        {#if status === 1}
        <td><div class="px-2">{guild.completed_battles}/ {guild.total_battles}</div></td>
        {:else if status === 2}
        <td><div class="px-2"><img width="25px" class="me-2" src="https://d36mxiodymuqjm.cloudfront.net/website/guilds/img_guild_crown_75.png" alt="Crowns">{formatCompactNumber(guild.other_payout)}</div></td>
        <td><div class="px-2"><img width="25px" class="me-2"  src="https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/cl/img_sps-shard_128.png" alt="SPS">{formatCompactNumber(guild.member_sps_payout)}</div></td>
        <td><div class="px-2"><img width="25px" class="me-2"  src="https://d36mxiodymuqjm.cloudfront.net/website/icons/img_merit_256.png" alt="Merrits">{formatCompactNumber(guild.member_merits_payout)}</div></td>
        {/if}
      </tr>
      {/each}
    </tbody>
  </table>
</div>
{/if}

