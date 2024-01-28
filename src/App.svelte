<script>
  import GuildView from "./lib/components/GuildView.svelte";
  import Guilds from "./lib/components/Guilds.svelte";
  import AppSpinner from "./lib/components/AppSpinner.svelte";
  import { guildInfo, guildLoading } from "./lib/store/guilds";

  function copyText() {
    // Copy the text inside the text field
    navigator.clipboard.writeText('nevermeltice');

    // Alert the copied text
    alert('Copied!');
  } 
</script>

<main class="bg-black pt-3 text-body min-vh-100 font-monospace" id="main">
  <div class="container">
    <Guilds/>
    
    {#if $guildInfo && !$guildLoading}
      <GuildView/>
    {/if}

    

    {#if $guildLoading }
    <div class="text-center my-5">
      <AppSpinner/>
    </div>
    {/if}

    <footer>
      <div class="text-end text-muted my-5">
        IGN:
        <span role="button" class="badge bg-primary text-secondary" on:click={copyText} title="click to copy">
          NEVERMELTICE
        </span>
      </div>
    </footer>
  </div>
</main>
