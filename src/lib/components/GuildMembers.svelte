<script>
  import { LEAGUES } from "../constants";
  import { guildMembers } from "../store/guilds";
</script>
<div class="table-responsive max-h-500 border border-primary">
  <table class="table table-sm align-middle mb-0">
    <tbody>
      {#each $guildMembers as member }
        <tr class="bg-dark">
          <td class="sticky-left p-0">
            <div class="py-1 px-3 bg-dark">
              {member.player}
            </div>
          </td>
          <td>
            <div class=" font-monospace me-3 me-2 text-nowrap">
              <span class="badge bg-dark text-muted">CP</span>
              <span class="">{member.collection_power}</span>
            </div>
          </td>
          <td>
            <div class="d-flex font-monospace me-3 me-2 text-nowrap">
              <span class="badge bg-dark text-muted me-2">Modern</span>
              <span class="me-2">{member.modern_rating}</span>
              <span class="text-muted" title="rating">{LEAGUES[member.modern_league]}</span>
            </div>
          </td>
          <td>
            <div class=" font-monospace me-3 me-2 text-nowrap">
              <span class="badge bg-dark text-muted me-2">Wild</span>
              <span class="" title="league">{member.rating}</span>
              <span class="text-muted" title="rating">{LEAGUES[member.league]}</span>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>