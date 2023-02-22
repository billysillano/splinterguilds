<script>
  import { onMount } from "svelte";
  import { BRAWL_TIER, FRAYS, } from "../constants";
  import { getGuildBrawlInfo } from "../services/guilds";
  import { guildInfo } from "../store/guilds";
  import AppSpinner from "./AppSpinner.svelte";

  let players = [];
  let results = [];
  let loading = false;

  const getFrayName = (fray_index, brawl_level) => {
    const tier = BRAWL_TIER[brawl_level]?.tier || 0;

    if (!tier) return ''

    const frays = FRAYS[tier];

    const fray = frays[fray_index];
    return fray;
  }

  function sortHandler(e, key) {
    const order = e.target.dataset.order === 'desc' ? 'asc' : 'desc';
    
    results.sort((a, b) => {
      if (isNaN(a[key])) {
        if (order === 'asc') {
          return b[key].localeCompare(a[key]);
        } else {
          return a[key].localeCompare(b[key]);
        }
      }

      if (order === 'asc') {
        return b[key] - a[key]
      } else {
        return a[key] - b[key]
      }
    });

    players = [...results];

    e.target.dataset.order = order;
  }

  onMount(async () => {
    loading = true;
    let id = $guildInfo.id;
    let tournament_id = $guildInfo.tournament_id;
    let res = await getGuildBrawlInfo({tournament_id, id});
    if (res && res.players) {
      results = res.players.map(i => {
        i['win_rate'] = Number((i.wins/i.entered_battles) * 100).toFixed(2);
        return i;
      })
      players = [...results];
    }
    loading = false;
  })
</script>
{#if loading}
<div class="text-center p-2">
  <AppSpinner/>
</div>
{:else}
<div class="p-3 bg-dark">
  <div class="table-responsive max-h-500 border border-primary">
    <table class="table table-sm mb-0 w-100 table-fixed">
      <thead class="sticky-top bg-darker">
        <tr>
          <th>
            <div class="px-3 text-nowrap" role="button" on:click="{(e) => sortHandler(e, 'player')}">IGN <span class="ms-2">&#8597;</span></div>
          </th>
          <th>
            <div class="px-3 text-nowrap" role="button" on:click="{(e) => sortHandler(e, 'fray_index')}">Fray <span class="ms-2">&#8597;</span></div>
          </th>
          <th>
            <div class="px-3 text-nowrap" role="button" on:click="{(e) => sortHandler(e, 'wins')}">Wins <span class="ms-2">&#8597;</span></div>
          </th>
          <th>
            <div class="px-3 text-nowrap" role="button" on:click="{(e) => sortHandler(e, 'losses')}">Loses <span class="ms-2">&#8597;</span></div>
          </th>
          <th>
            <div class="px-3 text-nowrap" role="button" on:click="{(e) => sortHandler(e, 'draws')}">Draws <span class="ms-2">&#8597;</span></div>
          </th>
          <th>
            <div class="px-3 text-nowrap" role="button" on:click="{(e) => sortHandler(e, 'total_battles')}">Battles <span class="ms-2">&#8597;</span></div>
          </th>
          <th>
            <div class="px-3 text-nowrap" role="button" on:click="{(e) => sortHandler(e, 'win_rate')}">Win rate <span class="ms-2">&#8597;</span></div>
          </th>
        </tr>
      </thead>
      <tbody>
        {#each players as player, index}
          <tr>
            <td>
              <div class="px-3 text-nowrap text-info">{player.player}</div>
            </td>
            <td>
              <div class="px-3 text-extra-small text-nowrap text-muted">
                Fray {getFrayName(player.fray_index, player.brawl_level)}
              </div>
            </td>
            <td><div class="px-3 text-nowrap">{player.wins}</div></td>
            <td><div class="px-3 text-nowrap">{player.losses}</div></td>
            <td><div class="px-3 text-nowrap">{player.draws}</div></td>
            <td><div class="px-3 text-nowrap">{player.total_battles}</div></td>
            <td><div class="px-3 text-nowrap">{player.win_rate}%</div></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
{/if}