<script>
  import { onMount } from "svelte";
  import { guildInfo } from "../store/guilds";
  import { getGuildBrawlRecords } from "../services/guilds";
  import GuildTiers from "./GuildTiers.svelte";
  import GuildBrawlResult from "./GuildBrawlResult.svelte";
  import { formatCompactNumber } from "../utils";
  import { getGuildBrawlInfo } from "../services/guilds";
    import AppSpinner from "./AppSpinner.svelte";
  

  let loading = false;
  let dataIsLoaded = false;
  let brawls = [];
  let playerStats = {};
  let inputCycleStart = '';
  let inputCycleEnd = '';
  let guildStats = {
    brawl_rank: 0,
    battles: 0,
    win_rate: 0,
    draws: 0,
    losses: 0,
    wins: 0,
  };

  const getData = async () => {
    const guildId = $guildInfo.id;
    const start = inputCycleStart;
    const end = inputCycleEnd;

    if (Number(end) < Number(start)) {
      alert('Invalid cycle from or cycle to value');
      return;
    }

    dataIsLoaded = true;
    loading = true;
    brawls = []
    
    const records = await getGuildBrawlRecords(guildId, start, end);
    guildStats = {
      brawl_rank: 0,
      battles: 0,
      win_rate: 0,
      draws: 0,
      losses: 0,
      wins: 0,
    };

    playerStats = {};

    records.forEach(result => {
      guildStats.brawl_rank += result.brawl_rank
      guildStats.battles += (result.draws + result.losses + result.wins)
      guildStats.wins += result.wins
    });

    guildStats.brawl_rank = Math.round(guildStats.brawl_rank/records.length)
    guildStats.win_rate = Math.round((guildStats.wins / guildStats.battles) * 100)

    const players = {};

    for await (let stat of records) {
      const result = await getGuildBrawlInfo({tournament_id: stat.tournament_id, id: stat.guild_id});
      stat.brawl_info = result;

      if (result && result.players) {
        result.players.forEach(p => {
          const {
            brawl_level,
            draws,
            entered_battles,
            finish,
            fray_index,
            losses,
            meta_pts,
            total_battles,
            wins,
            player,
          } = p;
  
          if (!players[player]) players[player] = [];
          
          players[player] = [...players[player], {
            brawl_level,
            draws,
            entered_battles,
            finish,
            fray_index,
            losses,
            meta_pts,
            total_battles,
            wins,
          }];
        });
      }
    }

    for(const player in players) {
      if (!playerStats[player]) playerStats[player] = {};

      players[player].reduce((res, value) => {
        // const fray_index = value.fray_index;
        if (!res) {
          res = { 
            draws: 0,
            entered_battles: 0,
            finish: 0,
            losses: 0,
            meta_pts: 0,
            total_battles: 0,
            wins: 0,
            frays:{},
            brawls_particated: 0,
            player,
           };
           playerStats[player] = res
        }
        res.draws += value.draws,
        res.entered_battles += value.entered_battles,
        res.finish += value.finish,
        res.losses += value.losses,
        res.meta_pts += value.meta_pts,
        res.total_battles += value.total_battles,
        res.wins += value.wins
        res.brawls_particated += 1

        return res;
      }, null);

      playerStats[player].win_rate = Number((playerStats[player].wins/playerStats[player].entered_battles) * 100).toFixed(2);
    }

    brawls = records;

    loading = false;
  }

  function sortBrawlsHandler(e, key) {
    const tableMembers = document.getElementById('table-past-brawls');
    const order = e.target.dataset.order === 'desc' ? 'asc' : 'desc';
    
    const sortable  = brawls.sort((a, b) => {
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

    brawls = [...sortable];

    tableMembers.querySelectorAll('th').forEach(i => i.dataset.order = '');
    e.target.dataset.order = order;
  }

  function sortGuildMembersHandler(e, key) {
    const tableMembers = document.getElementById('table-past-brawls-members');
    const order = e.target.dataset.order === 'desc' ? 'asc' : 'desc';
    
    const sortable  = Object.entries(playerStats)
      .sort(([,a], [,b]) => {
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
      })
      .reduce((r, [k, v]) => ({...r, [k]: v}), {});

    playerStats = sortable;

    tableMembers.querySelectorAll('th').forEach(i => i.dataset.order = '');
    e.target.dataset.order = order;
  }
</script>

<div class="accordion accordion-flush border border-primary mb-3">
  <div class="accordion-item">
    <div class="accordion-header" id="brawl-cycle-heading">
      <button class="accordion-button mb-0 text-light bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#brawl-cycle" aria-expanded="true" aria-controls="guild-brawl-results">
        <div class="d-flex flex-wrap h5 mb-0">
          <div class="text-nowrap">Past brawls</div>

          {#if brawls.length}
          <span class="ms-3 badge bg-primary"><span class="text-muted">Ave placement:</span> {guildStats.brawl_rank}</span>
          <span class="ms-3 badge bg-primary"><span class="text-muted">Wins:</span>  {guildStats.wins}</span>
          <span class="ms-3 badge bg-primary"><span class="text-muted">Battles:</span> {guildStats.battles}</span>
          <span class="ms-3 badge bg-primary"><span class="text-muted">Win rate:</span>  {guildStats.win_rate}%</span>
          {/if}
        </div>
      </button>
    </div>
    <div id="brawl-cycle" class="accordion-collapse collapse show">
      <p class="px-3 small">Enter the cycle range that you want to view (recommended) or click apply to get all (slow).</p>
      <div class="d-flex justify-content-end align-items-center px-3 pb-3">
        <strong class="mb-0 me-3">Cycle</strong>
        <div class="me-2 d-flex align-items-center">
          <input id="cycleStart" type="number" class="form-control form-control-sm bg-dark text-light" placeholder="From"  bind:value={inputCycleStart}>
        </div>
        <div  class="me-2 d-flex align-items-center">
          <input id="cycleEnd" type="number" class="form-control form-control-sm bg-dark text-light" placeholder="To"  bind:value={inputCycleEnd}>
        </div>

        <button class="btn btn-sm btn-primary" on:click={getData}>Apply</button>
      </div>
      {#if dataIsLoaded}
      {#if loading}
      <div class="text-center small pb-4">
        <AppSpinner/>
      </div>
      {/if}

      <!-- brawls -->
      {#if brawls.length}
      <div class="table-responsive max-h-500 border border-primary   {loading && 'd-none'}">
        {#each brawls as brawl}
        <table id="table-past-brawls" class="table table-sm table-hover align-middle mb-0">
            <thead>
              <tr class="bg-darker">
                <th class="px-3 text-nowrap" role="button">Cycle</th>
                <th class="px-3 text-nowrap" role="button">ID</th>
                <th class="px-3 text-nowrap text-center" role="button">Tier</th>
                <th class="px-3 text-nowrap" role="button">Place</th>
                <th class="px-3 text-nowrap" role="button">Wins</th>
                <th class="px-3 text-nowrap" role="button">Losses</th>
                <th class="px-3 text-nowrap" role="button">Draws</th>
                <th class="px-3 text-nowrap" role="button">Crowns</th>
                <th class="px-3 text-nowrap" role="button">SPS</th>
                <th class="px-3 text-nowrap" role="button">Merits</th>
              </tr>
            </thead>
            <tbody>
              <tr role="button" data-bs-toggle="collapse" data-bs-target="#brawl-summary-{brawl.tournament_id}" aria-expanded="false" class="collapsed">
                <td>
                  <div class="px-3">
                    <span class="me-2 arrow small">&#11166;</span>
                    <span class="text-info">
                      {brawl.cycle}
                    </span>
                  </div>
                </td>
                <td><div class="px-3 text-nowrap small">{brawl.tournament_id}</div></td>
                <td><div class="px-3 text-nowrap text-center"><GuildTiers level="{brawl.brawl_level}"/></div></td>
                <td><div class="px-3 text-nowrap">{brawl.brawl_rank}</div></td>
                <td><div class="px-3 text-nowrap">{brawl.wins}</div></td>
                <td><div class="px-3 text-nowrap">{brawl.losses}</div></td>
                <td><div class="px-3 text-nowrap">{brawl.draws}</div></td>
                <td><div class="px-3 text-nowrap"><img width="25px" class="me-2" src="https://d36mxiodymuqjm.cloudfront.net/website/guilds/img_guild_crown_75.png" alt="Crowns">{formatCompactNumber(brawl.total_payout)}</div></td>
                <td><div class="px-3 text-nowrap"><img width="25px" class="me-2"  src="https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/cl/img_sps-shard_128.png" alt="SPS">{formatCompactNumber(brawl.member_sps_payout)}</div></td>
                <td><div class="px-3 text-nowrap"><img width="25px" class="me-2"  src="https://d36mxiodymuqjm.cloudfront.net/website/icons/img_merit_256.png" alt="Merrits">{formatCompactNumber(brawl.member_merits_payout)}</div></td>
              </tr>
              
              <tr  id="brawl-summary-{brawl.tournament_id}" class="accordion-collapse collapse">
                <td colspan="10">
                  <GuildBrawlResult brawl="{ brawl.brawl_info?.guilds || []}" status="2"/>
                </td>
              </tr>
            </tbody>
          </table>
          {/each}
      </div>
      {:else if !loading}
        <p class="text-center  p-3">No record found</p>
      {/if}

      <!-- players -->
      <div id="player-brawl-result" class="accordion-collapse collapse show mt-4  {loading && 'd-none'}">
        <div class="px-3 mb-3 h5">Members</div>
        {#if Object.entries(playerStats).length}
        
        <div class="table-responsive max-h-500 border border-primary">
          <table id="table-past-brawls-members" class="table table-sm align-middle table-fixed mb-0">
            <thead>
              <tr class="sticky-top bg-darker">
                <th class="px-3 text-nowrap" role="button" on:click="{(e) => sortGuildMembersHandler(e, 'player')}">IGN  <span class="ms-2">&#8597;</span></th>
                <th class="px-3 text-nowrap" role="button" on:click="{(e) => sortGuildMembersHandler(e, 'wins')}">Wins  <span class="ms-2">&#8597;</span></th>
                <th class="px-3 text-nowrap" role="button" on:click="{(e) => sortGuildMembersHandler(e, 'losses')}">Losses  <span class="ms-2">&#8597;</span></th>
                <th class="px-3 text-nowrap" role="button" on:click="{(e) => sortGuildMembersHandler(e, 'draws')}">Draws  <span class="ms-2">&#8597;</span></th>
                <th class="px-3 text-nowrap" role="button" on:click="{(e) => sortGuildMembersHandler(e, 'total_battles')}">Battles  <span class="ms-2">&#8597;</span></th>
                <th class="px-3 text-nowrap" role="button" on:click="{(e) => sortGuildMembersHandler(e, 'win_rate')}">Win rate  <span class="ms-2">&#8597;</span></th>
                <th class="px-3 text-nowrap" role="button" on:click="{(e) => sortGuildMembersHandler(e, 'brawls_particated')}"># of Brawls  <span class="ms-2">&#8597;</span></th>
              </tr>
            </thead>
            <tbody>
              {#each Object.entries(playerStats) as [player, stats], playerIndex}
              <tr>
                <td class="text-nowrap">
                  <div class="px-3">
                    {player}
                  </div>
                </td>
                <td class="text-nowrap">
                  <div class="px-3">
                    {stats.wins}
                  </div>
                </td>
                <td class="text-nowrap">
                  <div class="px-3">
                    {stats.losses}
                  </div>
                </td>
                <td class="text-nowrap">
                  <div class="px-3">
                    {stats.draws}
                  </div>
                </td>
                <td class="text-nowrap">
                  <div class="px-3">
                    {stats.total_battles}
                  </div>
                </td>
                <td class="text-nowrap">
                  <div class="px-3">
                    {stats.win_rate}%
                  </div>
                </td>
                <td class="text-nowrap">
                  <div class="px-3">
                    {stats.brawls_particated}
                  </div>
                </td>
              </tr>
              {/each}
            </tbody>
          </table>
        </div>
        {:else if !loading}
          <p class="text-center p-3">No record found</p>
        {/if}
      </div>
      {/if}
    </div>
  </div>  
</div>  