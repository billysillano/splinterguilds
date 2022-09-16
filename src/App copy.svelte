<script>
  import { onMount } from "svelte";
  import { guildInfo, guilds } from "./lib/store/guilds";
  import { getGuilds } from "./lib/services/guilds";

  import AppHeader from "./lib/components/AppHeader.svelte";
  import Home from "./lib/components/Home.svelte";
  import GuildView from "./lib/components/GuildView.svelte";

  onMount(async () => {
    const guildsList = await getGuilds();
    guilds.set(guildsList);
  })
</script>

<!-- <AppHeader/> -->
<main class="main-content">
  <div class:hidden={$guildInfo}>
    <Home />
  </div>

  {#if $guildInfo}
    <GuildView />
  {/if}
</main>

<style>
  .main-content {
    margin-bottom: 20%;
    display: flex;
    flex-direction: column;
  }
</style>
