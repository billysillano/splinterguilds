<script>
  import { LEAGUES } from "../constants";
  import { guildMembers } from "../store/guilds";
  import { formatCompactNumber } from "../utils";
</script>
<div class="table-responsive max-h-500 border border-primary">
  <table class="table table-sm align-middle mb-0">
    <thead class="sticky-top bg-darker">
      <tr>
        <th class="px-3">IGN</th>
        <th class="px-3 text-center">CP</th>
        <th class="px-3 text-center">Modern</th>
        <th class="px-3 text-center">Wild</th>
        <th class="px-3">Contributed</th>
      </tr>
    </thead>
    <tbody>
      {#each $guildMembers as member }
        <tr class="bg-dark">
          <td class="p-0">
            <div class="py-1 px-3 bg-dark">
              <a class="text-decoration-none text-info" href="https://splinterlands.com/?p=collection&a={member.player}" target="blank" title="view collections on splinterlands.com">
                {member.player}
              </a>
              <div class="text-muted">joined: {member.join_date}</div>
            </div>
          </td>
          <td>
            <div class="px-3 font-monospace text-center ">{formatCompactNumber(member.collection_power)}</div>
          </td>
          <td>
            <div class="px-3 font-monospace text-center">
              <div class="text-muted" title="rating">{LEAGUES[member.modern_league]}</div>
                <div class="me-2">{member.modern_rating}</div>
            </div>
          </td>
          <td>
            <div class="px-3 font-monospace text-center">
              <div class="text-muted" title="rating">{LEAGUES[member.league]}</div>
                <div class="" title="league">{member.rating}</div>
            </div>
          </td>
          
          <td>
            <div class="px-3 font-monospace me-3 me-2 text-nowrap">
              {#if (member.dec)}
              <img width="25px"src="https://d36mxiodymuqjm.cloudfront.net/website/guilds/img_dec.png" alt="DEC">
                {formatCompactNumber(member.dec)}
              {/if}
              {#if (member.quest_lodge)}
              <img width="25px" class="ms-2"  src="https://d36mxiodymuqjm.cloudfront.net/website/guilds/img_quest_150.png" alt="Quest">
                {formatCompactNumber(member.quest_lodge)}
              {/if}
              {#if (member.crowns)}
              <img width="25px"  class="ms-2"  src="https://d36mxiodymuqjm.cloudfront.net/website/guilds/img_guild_crown_75.png" alt="Crowns">
                {formatCompactNumber(member.crowns)}
              {/if}
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>