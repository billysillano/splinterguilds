<script>
  import { guildInfo } from "../store/guilds";
  import { getGuildBrawlInfo } from "../services/guilds";
    import { BRAWL_TIER, FRAYS, } from "../constants";
    import { formatCompactNumber } from "../utils";
    import GuildBrawlResult from "./GuildBrawlResult.svelte";
    import GuildTiers from "./GuildTiers.svelte";
  let playerStat = {};
  let guildStats = {
    brawl_rank: 0,
    battles: 0,
    win_rate: 0,
    draws: 0,
    losses: 0,
    wins: 0,
  }
  let brawlStat;

  const getFrayName = (fray_index, brawl_level) => {
    const tier = BRAWL_TIER[brawl_level]?.tier || 0;

    if (!tier) return ''

    const frays = FRAYS[tier];

    const fray = frays[fray_index];
    return fray;
  }

  const init = async () => {
    brawlStat = [...$guildInfo.brawl_stats.results].reverse();
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
<div class="accordion accordion-flush mb-3">
  <div class="accordion-item">
    <div class="accordion-header" id="player-brawl-results-heading">
      <button class="accordion-button bg-dark"  data-bs-toggle="collapse" data-bs-target="#player-brawl-result" aria-expanded="true" aria-controls="player-brawl-result">
        <div class="d-flex flex-wrap">
          <div class="h5 mb-0">Last 10 brawls
            <span class="ms-3 badge bg-primary"><span class="text-muted">Ave placement:</span> {guildStats.brawl_rank}</span>
            <span class="ms-3 badge bg-primary"><span class="text-muted">Wins:</span>  {guildStats.wins}</span>
            <span class="ms-3 badge bg-primary"><span class="text-muted">Battles:</span> {guildStats.battles}</span>
            <span class="ms-3 badge bg-primary"><span class="text-muted">Win rate:</span>  {guildStats.win_rate}%</span>
          </div>
        </div>
      </button>
    </div>
    <div id="player-brawl-result" class="accordion-collapse collapse show">
      <div class="table-responsive max-h-500 border border-primary">
        <table class="table table-hover table-sm align-middle table-fixed mb-0">
          <thead>
            <tr class="sticky-top bg-darker">
              <th class="px-3"></th>
              <th class="px-3">Wins</th>
              <th class="px-3">Losses</th>
              <th class="px-3">Draws</th>
              <th class="px-3">Battles</th>
              <th class="px-3 text-nowrap">Win rate</th>
            </tr>
          </thead>
          <tbody>
            {#each Object.entries(playerStat) as [player, stats], playerIndex}
            <tr role="button" data-bs-toggle="collapse" data-bs-target="#player-fray-result-{playerIndex}" aria-expanded="false">
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
            <tr  id="player-fray-result-{playerIndex}" class="accordion-collapse collapse">
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
  </div>
</div>

<div class="accordion accordion-flush border border-primary mb-3">
  <div class="accordion-item">
    <div class="accordion-header" id="guild-bralw-results-heading">
      <button class="accordion-button text-light bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#guild-brawl-results" aria-expanded="true" aria-controls="guild-brawl-results">
        <div class="h5">Previous Brawls</div>
      </button>
    </div>
    <div id="guild-brawl-results" class="accordion-collapse collapse show">
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
            {#each brawlStat as brawl}
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
                  <GuildBrawlResult tournament_id="{brawl.tournament_id}" guild_id="{$guildInfo.id}"/>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<style>
  .table-fixed {
    table-layout: fixed;
    min-width: 1000px;
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