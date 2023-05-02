<script>
  import { onMount } from "svelte";
  import { getGuildBrawlByTournament, getGuildBrawlInfo } from "../services/guilds";
  import { guildInfo } from "../store/guilds";
  import GuildBrawlResult from "./GuildBrawlResult.svelte";
  import { BRAWL_STATUS } from "../constants";
    import AppSpinner from "./AppSpinner.svelte";
    import GuildCurrentBrawlMembers from "./GuildCurrentBrawlMembers.svelte";
    import { assign } from "svelte/internal";

  let brawlData = [];
  let loading = true;
  let cycle = '';
  onMount(async () => {
    const tournament_id = $guildInfo.tournament_id;
    const id =$guildInfo.id;
    cycle = tournament_id.split('-')[1].substring(2,);
    if ($guildInfo.tournament_status === 1) {
      let data = await getGuildBrawlInfo({tournament_id, id});
      brawlData = data.guilds
      // console.log(data.guilds)
      
    } else {
      brawlData = await getGuildBrawlByTournament(tournament_id);
    }
    loading = false;
  })
</script>

{#if ($guildInfo.tournament_status)}
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
      <p class="px-3">ID: {$guildInfo.tournament_id}  &nbsp;&nbsp; Cycle: {brawlData[0].cycle || cycle}</p>

      <GuildBrawlResult brawl="{brawlData}" status="{$guildInfo.tournament_status}"/>

      <GuildCurrentBrawlMembers />
    </div>
   {/if}
  </div>
</div>
{:else if $guildInfo.tournament_status === 0}
  <div class="p-3 mb-3 bg-dark">
    <div class="h5"><strong>Current Brawl</strong> : {BRAWL_STATUS[$guildInfo.tournament_status]}</div>
  </div>
{:else}
<div class="p-3 mb-3 bg-dark">
  <div class="h5">Current Brawl: No participation</div>
</div>
{/if}
