<script>
  import { guildInfo } from "../store/guilds";
  import { getGuildBrawlInfo } from "../services/guilds";
    import { BRAWL_TIER, FRAYS, } from "../constants";
  let playerStat = {};
  let guildStats = {
    brawl_rank: 0,
    battles: 0,
    win_rate: 0,
    draws: 0,
    losses: 0,
    wins: 0,
  }
  const getFrayName = (fray_index, brawl_level) => {
    const tier = BRAWL_TIER[brawl_level - 1].tier;
    const frays = FRAYS[tier];

    const fray = frays[fray_index];
    return fray;
  }

  const init = async () => {
    const brawlStat = $guildInfo.brawl_stats.results;
    const stats = {};

    brawlStat.forEach(result => {
      guildStats.brawl_rank += result.brawl_rank
      guildStats.battles += (result.draws + result.losses + result.wins)
      guildStats.wins += result.wins
    });

    guildStats.brawl_rank = Math.round(guildStats.brawl_rank/brawlStat.length)
    guildStats.win_rate = Math.round((guildStats.wins / guildStats.battles) * 100)


    for await (let stat of brawlStat) {
      const result = await getGuildBrawlInfo({tournament_id: stat.tournament_id, id: stat.guild_id});
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
  
          if (!stats[player]) stats[player] = [];
  
          stats[player] = [...stats[player], {
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

    for(const player in stats) {
      if (!playerStat[player]) playerStat[player] = {};
      stats[player].reduce(function(res, value) {
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
          playerStat[player] = res
        }
        res.draws += value.draws,
        res.entered_battles += value.entered_battles,
        res.finish += value.finish,
        res.losses += value.losses,
        res.meta_pts += value.meta_pts,
        res.total_battles += value.total_battles,
        res.wins += value.wins

        if (!res.frays[value.fray_index]) {
          res.frays[value.fray_index] = {
            brawl_level: 0,
            draws: 0,
            entered_battles: 0,
            finish: 0,
            losses: 0,
            meta_pts: 0,
            total_battles: 0,
            wins: 0,
            fray_name: '',
          }
        }
        res.frays[value.fray_index].draws += value.draws,
        res.frays[value.fray_index].entered_battles += value.entered_battles,
        res.frays[value.fray_index].finish += value.finish,
        res.frays[value.fray_index].losses += value.losses,
        res.frays[value.fray_index].meta_pts += value.meta_pts,
        res.frays[value.fray_index].total_battles += value.total_battles,
        res.frays[value.fray_index].wins += value.wins
        res.frays[value.fray_index].fray_name = getFrayName(value.fray_index, value.brawl_level)
          
        return res;
      }, null);

    }
  }
  init()
</script>

<div class="accordion-header d-flex flex-wrap align-items-center py-2 px-3">
  <div class="h5">Stats for the last 10 brawls</div>
  <button class="btn btn-sm btn-primary ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#guild-brawl-result" aria-expanded="true" aria-controls="guild-brawl-result">
    <span aria-hidden="true" class="dropdown-toggle"></span>
  </button>
  <div class="px-2 mt-2 bg-primary flex-grow-1 w-100">
    <span class="">Ave rank: {guildStats.brawl_rank}</span>
    <span class="ms-3">Wins: {guildStats.wins}</span>
    <span class="ms-3">Battles: {guildStats.battles}</span>
    <span class="ms-3">Win rate: {guildStats.win_rate}%</span>
  </div>
</div>
<div id="guild-brawl-result" class="accordion-collapse collapse show">
  <div class="table-responsive max-h-500 border border-primary">
    <table class="table table-sm align-middle mb-0 table-fixed">
      <thead>
        <tr class="sticky-top bg-dark">
          <th class="px-3 bg-dark">
            <button class="btn btn-sm btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#player-fray-result" aria-expanded="true" aria-controls="guild-brawl-result">
              Display frays <span aria-hidden="true" class="dropdown-toggle"></span>
            </button>
          </th>
          <th class="px-3 bg-dark">Wins</th>
          <th class="px-3 bg-dark">Losses</th>
          <th class="px-3 bg-dark">Draws</th>
          <th class="px-3 bg-dark">Battles</th>
          <!-- <th class="px-3 bg-dark">Participation</th> -->
          <th class="px-3 bg-dark">Win rate</th>
        </tr>
      </thead>
      <tbody>
        {#each Object.entries(playerStat) as [player, stats]}
        <tr>
          <td class="text-nowrap sticky-left p-0">
            <div class="py-1 px-3 bg-dark">
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
          <!-- <td class="text-nowrap">
            <div class="px-3">
              {(Number(stats.entered_battles / stats.total_battles) * 100).toFixed() }%
            </div>
          </td> -->
          <td class="text-nowrap">
            <div class="px-3">
              {Number((stats.wins/stats.entered_battles) * 100).toFixed(2) }%
            </div>
          </td>
        </tr>
        <tr  id="player-fray-result" class="accordion-collapse collapse">
          <td colspan="6">
            <table class="table table-sm mb-0 w-100 table-fixed">
              {#each Object.entries(stats.frays) as [frayIndex, frayResult]}
                <tr>
                  <td>
                    <div class="px-3 text-extra-small fray-cell text-muted">
                      Fray {frayResult.fray_name}
                    </div>
                  </td>
                  <td><div class="px-3 fray-cell text-muted">{frayResult.wins}</div></td>
                  <td><div class="px-3 fray-cell text-muted">{frayResult.losses}</div></td>
                  <td><div class="px-3 fray-cell text-muted">{frayResult.draws}</div></td>
                  <td><div class="px-3 fray-cell text-muted">{frayResult.total_battles}</div></td>
                  <td><div class="px-3 fray-cell text-muted">{Number((frayResult.wins/frayResult.entered_battles) * 100).toFixed(2) }%</div></td>
                </tr>
              {/each}
            </table>
          </td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .table-fixed {
    table-layout: fixed;
  }

  .text-extra-small {
    font-size: 12px;
    line-height: 14px;
  }

  .fray-cell {
    height: 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>