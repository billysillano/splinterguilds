<script>
  import { guildMembers, guildInfo } from "../store/guilds";
  import GuildMembers from './GuildMembers.svelte';
  import GuildBuildings from './GuildBuildings.svelte';
  import GuildCrest from "./GuildCrest.svelte";
    import GuildBrawlStats from "./GuildBrawlStats.svelte";
  import GuildBrawlLatest from "./GuildBrawlLatest.svelte";
    import { BRAWL_STATUS } from "../constants";
  const handleCloseMembers = () => {
    $guildMembers = [];
    $guildInfo = null;
  }
</script>

{#if $guildInfo }
<div class="mb-5">
  <div class="d-flex bg-dark py-2 px-3">
    <h2 class="h5">{$guildInfo.name}</h2>
    
    <button on:click={handleCloseMembers} class="btn btn-sm btn-primary py-0 ms-auto close" aria-label="close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>

  <div class="d-flex mb-4 p-3 bg-black rounded">
    <GuildCrest data={$guildInfo.data} size="large"/>

    <div class="px-3">
      <div class="mb-2">
        <span class="me-2">Rank: {$guildInfo.rank}</span>
        <span>Rating: {$guildInfo.rating}</span>
      </div>
      <div class="mb-2">
        <GuildBuildings buildings={$guildInfo.buildings} />
      </div>
      
      {#if $guildInfo.description}
        <div class=" small">{$guildInfo.description}</div>
      {/if}
    </div>
  </div>
  
  <div class="accordion mb-3">
    {#if $guildMembers && $guildMembers.length}
    <div class="accordion-item">
      <div class="accordion-header d-flex align-items-center py-2 px-3">
        <span class="h5">Members</span> <span class="mx-3 badge bg-primary">{$guildInfo.num_members}</span>
        <button class="btn btn-sm btn-primary ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#guild-members" aria-expanded="true" aria-controls="guild-members">
          <span aria-hidden="true" class="dropdown-toggle"></span>
        </button>
      </div>
      <div id="guild-members" class="accordion-collapse collapse show">
        <GuildMembers/>
      </div>
    </div>
    {/if}
  </div>

  <div class="accordion  mb-3">
    <div class="accordion-item">
      <GuildBrawlStats/>
    </div>
  </div>

  <div class="accordion  mb-3">
    <div class="accordion-item">
      {#if ($guildInfo.tournament_status)}
      <GuildBrawlLatest/>
      {:else if ($guildInfo.tournament_status === 0)}
        <div class="h1 text-center">{BRAWL_STATUS[$guildInfo.tournament_status]}</div>
      {:else}
        <div class="h1 text-center">No participation</div>
      {/if}
    </div>
  </div>
</div>
{/if}
