<script>
  import { guildMembers, guildInfo, searchKey } from "../store/guilds";
  import GuildMembers from './GuildMembers.svelte';
  import GuildBuildings from './GuildBuildings.svelte';
  import GuildCrest from "./GuildCrest.svelte";
    import GuildBrawlStats from "./GuildBrawlStats.svelte";
  import GuildBrawlLatest from "./GuildBrawlLatest.svelte";
    import { BRAWL_STATUS } from "../constants";
  import { formatCompactNumber, setUrl } from "../utils";
    import GuildTiers from "./GuildTiers.svelte";

  const handleCloseMembers = () => {
    $guildMembers = [];
    $guildInfo = null;
    $searchKey = '';
    setUrl('guild', '');
  }
</script>

{#if $guildInfo }
<div class="mb-5">
  <div class="bg-dark">
    <div class="d-flex py-2 px-3 align-items-center">
      <h2 class="h2 text-info">{$guildInfo.name}</h2>
      
      <button on:click={handleCloseMembers} class="btn btn-sm btn-primary ms-auto close" aria-label="close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  
    <div class="d-flex mb-4 p-3  rounded">
      <div>
        <GuildCrest data={$guildInfo.data} size="large"/>
        <h2 class="h2 text-center">
          <GuildTiers level="{$guildInfo.brawl_level}"/>
        </h2>
      </div>
  
      <div class="px-3">
        <div class="mb-2">
          <span class="me-2">Rank: <strong class="text-info">{$guildInfo.rank}</strong></span>
          <span>Rating: &nbsp;<strong class="text-info">{formatCompactNumber($guildInfo.rating)}</strong></span>
        </div>
        <div class="mb-2">
          <GuildBuildings buildings={$guildInfo.buildings} />
        </div>
        
        {#if $guildInfo.description}
          <div class=" small">{$guildInfo.description}</div>
        {/if}
      </div>
    </div>
  </div>
  
  <div class="accordion accordion-flush mb-3">
    {#if $guildMembers && $guildMembers.length}
    <div class="accordion-item">
      <div class="accordion-header">
        <button class="accordion-button text-light bg-dark"  data-bs-toggle="collapse" data-bs-target="#guild-members" aria-expanded="true" aria-controls="guild-members">
          <div class="h5">Members <span class="mx-3 badge bg-primary"><span class="text-muted">total </span>{$guildInfo.num_members}</span></div> 
        </button>
      </div>
      <div id="guild-members" class="accordion-collapse collapse show">
        <GuildMembers/>
      </div>
    </div>
    {/if}
  </div>
  
  <GuildBrawlStats/>

  <div class="accordion accordion-flush  mb-3">
    <div class="accordion-item">
      {#if ($guildInfo.tournament_status)}
      <GuildBrawlLatest/>
      {:else if ($guildInfo.tournament_status === 0)}
      <div class="p-3"><strong>Current Brawl</strong> : {BRAWL_STATUS[$guildInfo.tournament_status]}</div>
      {:else}
        <div class="h1 text-center">No participation</div>
      {/if}
    </div>
  </div>
</div>
{/if}
