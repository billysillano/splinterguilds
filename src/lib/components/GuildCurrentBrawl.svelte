<script>
  import { onMount } from "svelte";
  import { getGuildBrawlByTournament } from "../services/guilds";
  import { guildInfo } from "../store/guilds";
  import GuildBrawlResult from "./GuildBrawlResult.svelte";
  import { BRAWL_STATUS } from "../constants";
    import AppSpinner from "./AppSpinner.svelte";
    import GuildCurrentBrawlMembers from "./GuildCurrentBrawlMembers.svelte";

  let brawlData = [];
  let loading = true;
  onMount(async () => {
    const tid = $guildInfo.tournament_id;
    brawlData = await getGuildBrawlByTournament(tid);
    loading = false;
  })
</script>

{#if ($guildInfo.tournament_status || $guildInfo.tournament_status === 0)}
<div class="accordion accordion-flush  mb-3">
  <div class="accordion-item">
    <div class="accordion-header">
      <button class="accordion-button text-light bg-dark"  data-bs-toggle="collapse" data-bs-target="#guild-brawl-latest" aria-expanded="true" aria-controls="guild-brawl-latest">
        <div class="h5"><strong>Current Brawl</strong> : {BRAWL_STATUS[$guildInfo.tournament_status]}</div>
      </button>
    </div>
    {#if loading}
        <div class="text-center p-2">
          <AppSpinner/>
        </div>
      {:else if brawlData && brawlData.length}
    <div id="guild-brawl-latest" class="accordion-collapse collapse show">
      <p class="px-3">ID: {$guildInfo.tournament_id} - Cycle: #{brawlData[0].cycle}</p>

      <GuildBrawlResult brawl="{brawlData}"/>

      <GuildCurrentBrawlMembers />
    </div>
   {/if}
  </div>
</div>
{:else}
<div class="p-3 bg-dark">
  Current Brawl: No participation
</div>
{/if}
