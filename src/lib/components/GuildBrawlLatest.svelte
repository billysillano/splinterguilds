<script>
import GuildBrawlResultFray from "./GuildBrawlResultFray.svelte";
import { onMount } from "svelte";
import { guildInfo, guildOpponentInfo } from "../store/guilds";
import { getGuildBrawlInfo} from "../services/guilds";
  import AppSpinner from "./AppSpinner.svelte";
import { BRAWL_STATUS, LEAGUES, BRAWL_TIER, FRAYS } from "../constants";

let ownGuild = null;
let guildNames = {};
let guilds = [];
let loading =  false;

const getFrayName = (fray_index, brawl_level) => {
  const tier = BRAWL_TIER[brawl_level]?.tier || 0;
  
  if (!tier) return ''

  const frays = FRAYS[tier];

  const fray = frays[fray_index];
  return fray;
}

const getCurrentBrawlStats = (id) => {
  const stats = ownGuild.guilds.find(i => i.id === id);
  return `
    <div class="small">
      <span class="text-success small me-2">${stats.wins} W</span>
      <span class="text-danger small me-2">${stats.losses} L</span>
      <span class="text-warning small me-2">${stats.draws} D</span>
      <div class="text-muted small">${stats.pts} pts - ${stats.completed_battles}/${stats.total_battles}</div>
    </div>
  `;
}

onMount(async () => {
  loading = true;
  const data = JSON.parse($guildInfo.tournament_data);

  for await (let guildId of data.guilds) {
    const brawlData = await getGuildBrawlInfo({
      tournament_id: $guildInfo.tournament_id,
      id: guildId,
    });


    if (guildId === $guildInfo.id) {
      ownGuild = {
        guildId,
        ...brawlData
      };
    } else {
      guilds = [...guilds, {
        guildId,
        players: brawlData.players
      }];
    }
  }

  ownGuild.guilds.forEach(element => {
    guildNames[element.id] = element.name;
  });

  loading = false;
});

// info
const closeGuildOpponentInfo = () => $guildOpponentInfo = null;
</script>

<div class="accordion-header">
  <button class="accordion-button text-light bg-dark"  data-bs-toggle="collapse" data-bs-target="#guild-brawl-latest" aria-expanded="true" aria-controls="guild-brawl-latest">
    <div class="h5"><strong>Current Brawl</strong> : {BRAWL_STATUS[$guildInfo.tournament_status]}</div>
  </button>
</div>
<div id="guild-brawl-latest" class="accordion-collapse collapse show">
  {#if loading}
    <div class="text-center p-2">
      <AppSpinner/>
    </div>
  {/if}
  {#if ownGuild && $guildInfo && !loading}
  <div class="table-responsive max-h-500 border border-primary">
    <table class="table table-sm align-middle mb-0">
      <thead class="sticky-top bg-darker">
        <tr>
          <th class="text-nowrap px-3" style="min-width: 250px;">
            <span class="text-info">{guildNames[ownGuild.guildId] || '--'}</span>
            {@html getCurrentBrawlStats(ownGuild.guildId)}
          </th>
  
          {#each guilds as guild}
            <th class="px-3 text-nowrap">
              <span class="text-info">{guildNames[guild.guildId] || '--'}</span>
              {@html getCurrentBrawlStats(guild.guildId)}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each ownGuild.players as champion}
          <tr>
            <td class="p-0">
              <div class="py-1 px-3 bg-dark">
                <span class="me-2 text-nowrap text-info">
                  {champion.player}
                </span>
                <div class="text-muted badge d-flex text-nowrap">
                  <span class="text-success me-2">{champion.wins} W</span>
                  <span class="text-danger me-2">{champion.losses} L</span>
                  <span class="text-warning me-2">{champion.draws} D</span>
                </div>
                <div class="small text-muted">
                  <small>
                    Fray {getFrayName(champion.fray_index, champion.brawl_level)}
                  </small>
                </div>
              </div>
            </td>
            {#each guilds as guild}
            <td>
              <div class="px-3">
                <GuildBrawlResultFray
                  players={guild.players}
                  champion={champion}
                />
              </div>
            </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="playerInfo" tabindex="-1" aria-labelledby="playerInfoLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <button type="button" class="btn-close float-end" data-bs-dismiss="modal" aria-label="Close" on:click="{closeGuildOpponentInfo}"></button>
          {#if $guildOpponentInfo}
            <p>
              <span class="text-muted me-2">Name:</span>
              {$guildOpponentInfo.name}
            </p>
            <p>
              <span class="text-muted me-2">Collection power:</span>
              {$guildOpponentInfo.collection_power}
            </p>
            {#if $guildOpponentInfo.title_post}
            <p>
              <span class="text-muted me-2">title:</span>
              {$guildOpponentInfo.title_post}
            </p>
            {/if}
            {#if $guildOpponentInfo.champion_points}
            <p>
              <span class="text-muted me-2">Champion points:</span>
              {$guildOpponentInfo.champion_points}
              </p>
            {/if}
            <div class="d-md-flex">
              <div class="card flex-fill">
                <div class="card-header">Wild</div>
                <div class="list-group list-group-flush">
                  <div class="list-group-item">
                    <span class="text-muted me-2">League:</span>
                    {LEAGUES[$guildOpponentInfo.league]}
                  </div>
                  <div class="list-group-item">
                    <span class="text-muted me-2">Rating:</span>
                    {$guildOpponentInfo.rating}
                  </div>
                  <div class="list-group-item">
                    <span class="text-muted me-2">Win rate:</span>
                    {Number(($guildOpponentInfo.wins / $guildOpponentInfo.battles) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
              <div class="card flex-fill">
                <div class="card-header">Modern</div>
                <div class="list-group list-group-flush">
                  <div class="list-group-item">
                    <span class="text-muted me-2">League:</span>
                    {LEAGUES[$guildOpponentInfo.modern_league]}
                  </div>
                  <div class="list-group-item">
                    <span class="text-muted me-2">Rating:</span>
                    {$guildOpponentInfo.modern_rating}
                  </div>
                  <div class="list-group-item">
                    <span class="text-muted me-2">Win rate:</span>
                    {Number(($guildOpponentInfo.modern_wins / $guildOpponentInfo.modern_battles) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <a class="text-info text-decoration-none" href="https://splinterlands.com/?p=collection&a={$guildOpponentInfo.name}" target="blank">
                View collections on splinterlands.com
              </a>
            </div>
          {:else}
            <AppSpinner/>
          {/if}
        </div>
      </div>
    </div>
  </div>
  {/if}
</div>
