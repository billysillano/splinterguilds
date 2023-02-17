<script>
  import { onMount } from "svelte";
  import { guildInfo } from "../store/guilds";
  import { getGuildBrawlRecords } from "../services/guilds";
  import GuildTiers from "./GuildTiers.svelte";
  import GuildBrawlResult from "./GuildBrawlResult.svelte";
  import { formatCompactNumber } from "../utils";
  import { getGuildBrawlInfo } from "../services/guilds";
  

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
    const start = inputCycleStart || $guildInfo.brawl_stats.start_cycle;
    const end = inputCycleEnd || $guildInfo.brawl_stats.end_cycle;

    if (Number(end) < Number(start)) {
      alert('Invalid cycle from or cycle to value');
      return;
    }

    brawls = await getGuildBrawlRecords(guildId, start, end);

    guildStats = {
      brawl_rank: 0,
      battles: 0,
      win_rate: 0,
      draws: 0,
      losses: 0,
      wins: 0,
    };

    playerStats = {};

    brawls.forEach(result => {
      guildStats.brawl_rank += result.brawl_rank
      guildStats.battles += (result.draws + result.losses + result.wins)
      guildStats.wins += result.wins
    });

    guildStats.brawl_rank = Math.round(guildStats.brawl_rank/brawls.length)
    guildStats.win_rate = Math.round((guildStats.wins / guildStats.battles) * 100)

    const players = {};

    for await (let stat of brawls) {
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
            frays:{}
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

        return res;
      }, null);

    }
  }

  onMount(async () => {
    getData();
  })
</script>

<div class="accordion accordion-flush border border-primary mb-3">
  <div class="accordion-item">
    <div class="accordion-header" id="brawl-cycle-heading">
      <button class="accordion-button text-light bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#brawl-cycle" aria-expanded="true" aria-controls="guild-brawl-results">
        <div class="d-flex flex-wrap">
          <div class="h5 mb-0">Past brawls
            <span class="ms-3 badge bg-primary"><span class="text-muted">Ave placement:</span> {guildStats.brawl_rank}</span>
            <span class="ms-3 badge bg-primary"><span class="text-muted">Wins:</span>  {guildStats.wins}</span>
            <span class="ms-3 badge bg-primary"><span class="text-muted">Battles:</span> {guildStats.battles}</span>
            <span class="ms-3 badge bg-primary"><span class="text-muted">Win rate:</span>  {guildStats.win_rate}%</span>
          </div>
        </div>
      </button>
    </div>
    <div id="brawl-cycle" class="accordion-collapse collapse show">
      <div class="d-flex justify-content-end align-items-center px-3 mb-3">
        <strong class="mb-0 me-3">Cycle</strong>
        <div class="me-2 d-flex align-items-center">
          <input id="cycleStart" type="number" class="form-control form-control-sm bg-dark text-light" placeholder="From"  bind:value={inputCycleStart}>
        </div>
        <div  class="me-2 d-flex align-items-center">
          <input id="cycleEnd" type="number" class="form-control form-control-sm bg-dark text-light" placeholder="To"  bind:value={inputCycleEnd}>
        </div>

        <button class="btn btn-sm btn-primary" on:click={getData}>Apply</button>
      </div>

      <!-- brawls -->
      <div class="table-responsive max-h-500 border border-primary">
        <table class="table table-sm table-hover align-middle mb-0">
          <thead>
            <tr class="bg-darker">
              <th class="px-3">Cycle</th>
              <th class="px-3">ID</th>
              <th class="px-3 text-center">Tier</th>
              <th class="px-3">Place</th>
              <th class="px-3">Wins</th>
              <th class="px-3">Losses</th>
              <th class="px-3">Draws</th>
              <th class="px-3">Crowns</th>
              <th class="px-3">SPS</th>
              <th class="px-3">Merits</th>
            </tr>
          </thead>
          <tbody>
            {#each brawls as brawl}
              <tr role="button" data-bs-toggle="collapse" data-bs-target="#brawl-summary-{brawl.tournament_id}" aria-expanded="false">
                <td>
                  <div class="px-3">
                    {brawl.cycle}
                  </div>
                </td>
                <td><div class="px-3 text-nowrap small">{brawl.tournament_id}</div></td>
                <td><div class="px-3 text-center"><GuildTiers level="{brawl.brawl_level}"/></div></td>
                <td><div class="px-3">{brawl.brawl_rank}</div></td>
                <td><div class="px-3">{brawl.wins}</div></td>
                <td><div class="px-3">{brawl.losses}</div></td>
                <td><div class="px-3">{brawl.draws}</div></td>
                <td><div class="px-3"><img width="25px" class="me-2" src="https://d36mxiodymuqjm.cloudfront.net/website/guilds/img_guild_crown_75.png" alt="Crowns">{formatCompactNumber(brawl.other_payout)}</div></td>
                <td><div class="px-3"><img width="25px" class="me-2"  src="https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/cl/img_sps-shard_128.png" alt="SPS">{formatCompactNumber(brawl.member_sps_payout)}</div></td>
                <td><div class="px-3"><img width="25px" class="me-2"  src="https://d36mxiodymuqjm.cloudfront.net/website/icons/img_merit_256.png" alt="Merrits">{formatCompactNumber(brawl.member_merits_payout)}</div></td>
              </tr>
              <tr  id="brawl-summary-{brawl.tournament_id}" class="accordion-collapse collapse">
                <td colspan="10">
                  <GuildBrawlResult results="{brawls}"/>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- players -->
      <div id="player-brawl-result" class="accordion-collapse collapse show">
        <div class="table-responsive max-h-500 border border-primary">
          <table class="table table-sm align-middle table-fixed mb-0">
            <thead>
              <tr class="sticky-top bg-darker">
                <th class="px-3">Members</th>
                <th class="px-3">Wins</th>
                <th class="px-3">Losses</th>
                <th class="px-3">Draws</th>
                <th class="px-3">Battles</th>
                <th class="px-3 text-nowrap">Win rate</th>
              </tr>
            </thead>
            <tbody>
              {#each Object.entries(playerStats) as [player, stats], playerIndex}
              <tr>
                <td class="text-nowrap">
                  <div class="px-3 text-info">
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
                    {Number((stats.wins/stats.entered_battles) * 100).toFixed(2) }%
                  </div>
                </td>
              </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>  
</div>  