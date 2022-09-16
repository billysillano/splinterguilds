<script>
  import { onMount } from "svelte";
  import { getGuildInfo, getGuildMembers, getGuilds } from "../services/guilds";
  import { guilds, guildMembers, guildLoading, guildInfo } from "../store/guilds";
  import GuildCrest from "./GuildCrest.svelte";

  onMount(async () => {
    $guildLoading = true;
    const guildsList = await getGuilds();
    guilds.set(guildsList);
    $guildLoading = false;
  })

  const viewGuildMembers = async (id) => {
    $guildLoading = true;
    $guildInfo = await getGuildInfo(id);
    $guildMembers = await getGuildMembers(id);
    $guildLoading = false;
  }
  
  let searchKey = '';
</script>

<div
  class="mb-5"
  class:disabled={$guildLoading}
>
  <div class="d-flex justify-content-between align-items-end mb-2">
    <h1 class="h4 mb-0">Splinterlands Guilds</h1>
    <input class="form-control-sm" type="text" placeholder="Search" bind:value={searchKey}>
  </div>
  <div class="table-responsive max-h-500">
    <table class="table table-hover align-middle mb-0">
      <thead class="sticky-top bg-primary">
        <tr>
          <th class="text-center">Rank</th>
          <th class="sticky-left bg-primary text-center">Guilds</th>
          <th></th>
          <th class="text-center">Level</th>
          <th class="text-center">Rating</th>
          <!-- <th>Buildings</th> -->
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
              .includes(searchKey.trim().toLowerCase())
            }
          >
            <td class="text-center">
              <span class="badge bg-primary">
                {guild.rank}
              </span>
            </td>
            <td class="sticky-left text-center">
              <GuildCrest data={guild.data}/>
            </td>
            <td>
              {guild.name}
              <div class="small text-muted">{guild.owner}</div>
            </td>
            <td class="text-center">{guild.level}</td>
            <td class="text-center">{guild.rating}</td>
            <!-- <td>
              <GuildBuildings buildings={guild.buildings}/>
            </td> -->
            <td class="text-center">{guild.num_members}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .table th:first-child {
    width: 80px;
  }

  .table th:last-child {
    width: 60px;
  }

  .disabled {
    opacity: .5;
    pointer-events: none;
  }
</style>
