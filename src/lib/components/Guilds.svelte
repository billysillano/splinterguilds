<script>
  import { onMount } from "svelte";
  import { getGuildInfo, getGuildMembers, getGuilds } from "../services/guilds";
  import { guilds, guildMembers, guildLoading, guildInfo, searchKey } from "../store/guilds";
  import GuildCrest from "./GuildCrest.svelte";
  import GuildBuildings from "./GuildBuildings.svelte";
  import { setUrl } from "../utils";
  import GuildTiers from "./GuildTiers.svelte";

  let filteredList = [];

  onMount(async () => {
    $guildLoading = true;
    const guildsList = await getGuilds();
    guilds.set(guildsList);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const myParam = urlSearchParams.get('guild');
    if(myParam) {
      await viewGuildMembers(myParam);
      
      setUrl('guild', myParam);
    }
    
    setFilterList();
    $guildLoading = false;
  })

  const setFilterList = ()=>{
    filteredList = $guilds.filter(i => String(i.name).trim().toLowerCase()
              .includes($searchKey.trim().toLowerCase()));
  }

  const viewGuildMembers = async (id) => {
    $guildLoading = true;
    $guildInfo = await getGuildInfo(id);
    $guildMembers = await getGuildMembers(id);
    $searchKey = $guildInfo.name;
    setUrl('guild', id);

    $guildLoading = false;

  }
</script>

<div
  class="mb-5"
  class:disabled={$guildLoading}
>
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h1 class="h4 mb-0">Splinterlands Guilds</h1>
    <label for="" class="ms-auto me-2">Search guild name:</label>
    <input class="form-control-sm" type="text" placeholder="Search" bind:value={$searchKey} on:input="{() => setFilterList()}">
  </div>
  <div class="table-responsive bg-dark max-h-500">
    <table id="table-guilds" class="table table-hover align-middle mb-0">
      <thead class="sticky-top bg-darker">
        <tr>
          <th><div class="px-3">{filteredList.length} Guilds</div></th>
          <th class="text-center">Rank</th>
          <th class="text-center">Tier</th>
          <th class="text-center">Rating</th>
          <th class="text-center">Buildings</th>
          <th class="text-center">Members</th>
        </tr>
      </thead>
      <tbody>
        {#each $guilds as guild}
          <tr
            class="pointer"
            on:click={() => viewGuildMembers(guild.id)}
            class:d-none={
              !String(guild.name).trim().toLowerCase()
              .includes($searchKey.trim().toLowerCase())
            }
          >
            <td class="text-nowrap">
              <div class="px-3">
                <GuildCrest data={guild.data}/>
                {guild.name}
              </div>
            </td>
            <td class="text-center">
              {guild.rank}
            </td>
            <td class="text-center">
              <GuildTiers level={guild.brawl_level}/>
            </td>
            <td class="text-center">{(Number(guild.rating)/1000).toFixed(1)}K</td>
            <td class="text-nowrap">
              <GuildBuildings buildings={guild.buildings}/>
            </td>
            <td class="text-center">{guild.num_members}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .disabled {
    opacity: .5;
    pointer-events: none;
  }
</style>
