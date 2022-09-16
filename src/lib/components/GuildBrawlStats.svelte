<script>
  import { guildInfo } from "../store/guilds";
  import { getGuildBrawlInfo } from "../services/guilds";
  let playerStat = {};

  const init = async () => {
    const brawlStat = $guildInfo.brawl_stats.results;
    const stats = {};

    brawlStat.reduce(function(res, value) {
      // const fray_index = value.fray_index;
      if (!res) {
        res = { 
          draws: 0,
          losses: 0,
          wins: 0,
        };
      }
      res.draws += value.draws,
      res.losses += value.losses,
      res.wins += value.wins
      return res;
    }, null);

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
            brawl_level: 0,
            draws: 0,
            entered_battles: 0,
            finish: 0,
            losses: 0,
            meta_pts: 0,
            total_battles: 0,
            wins: 0,
           };
          playerStat[player] = res
        }
        res.brawl_level += value.brawl_level,
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

  init()
</script>

<div class="accordion-header d-flex align-items-center py-2 px-3">
  <strong>Brawls</strong> : Players' stats for the last 10 brawls
  <button class="btn btn-sm btn-primary ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#guild-brawl-result" aria-expanded="true" aria-controls="guild-brawl-result">
    <span aria-hidden="true" class="dropdown-toggle"></span>
  </button>
</div>
<div id="guild-brawl-result" class="accordion-collapse collapse show">
  <div class="table-responsive max-h-500 border border-primary">
    <table class="table table-sm align-middle mb-0">
      <thead>
        <tr class="sticky-top bg-dark">
          <th class="px-3 bg-dark"></th>
          <th class="px-3 bg-dark">Wins</th>
          <th class="px-3 bg-dark">Losses</th>
          <th class="px-3 bg-dark">Draws</th>
          <th class="px-3 bg-dark">Battles</th>
          <th class="px-3 bg-dark">Participation</th>
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
          <td class="text-nowrap">
            <div class="px-3">
              {(Number(stats.entered_battles / stats.total_battles) * 100).toFixed() }%
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