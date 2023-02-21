<script>
  import { LEAGUES } from "../constants";
  import { guildMembers } from "../store/guilds";
  import { formatCompactNumber } from "../utils";
  

  function sortHandler(e, key) {
    const tableMembers = document.getElementById('table-members');
    const order = e.target.dataset.order === 'desc' ? 'asc' : 'desc';
    
    const sortable  = $guildMembers.sort((a, b) => {
      if (isNaN(a[key])) {
        if (order === 'asc') {
          return b[key].localeCompare(a[key]);
        } else {
          return a[key].localeCompare(b[key]);
        }
      }

      if (order === 'asc') {
        return b[key] - a[key]
      } else {
        return a[key] - b[key]
      }
    });

    $guildMembers = [...sortable];

    tableMembers.querySelectorAll('th').forEach(i => i.dataset.order = '');
    e.target.dataset.order = order;
  }
</script>
<div class="table-responsive max-h-500 border border-primary">
  <table id="table-members" class="table table-sm align-middle mb-0">
    <thead class="sticky-top bg-darker">
      <tr>
        <th class="px-3 text-nowrap" role="button" on:click="{(e) => sortHandler(e, 'player')}">IGN <span class="ms-2">&#8597;</span></th>
        <th class="px-3 text-nowrap text-center" role="button" on:click="{(e) => sortHandler(e, 'collection_power')}">CP <span class="ms-2">&#8597;</span></th>
        <th class="px-3 text-nowrap text-center" role="button" on:click="{(e) => sortHandler(e, 'modern_rating')}">Modern <span class="ms-2">&#8597;</span></th>
        <th class="px-3 text-nowrap text-center" role="button" on:click="{(e) => sortHandler(e, 'rating')}">Wild <span class="ms-2">&#8597;</span></th>
        <th class="px-3 text-nowrap" role="button" on:click="{(e) => sortHandler(e, 'crowns')}">Crown <span class="ms-2">&#8597;</span></th>
        <th class="px-3 text-nowrap" role="button" on:click="{(e) => sortHandler(e, 'dec')}">DEC <span class="ms-2">&#8597;</span></th>
        <th class="px-3 text-nowrap" role="button" on:click="{(e) => sortHandler(e, 'quest_lodge')}">Quest <span class="ms-2">&#8597;</span></th>
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
            <div class="px-3 font-monospace text-nowrap">
              <img width="25px"  class="ms-2"  src="https://d36mxiodymuqjm.cloudfront.net/website/guilds/img_guild_crown_75.png" alt="Crowns">
              {member.crowns ? formatCompactNumber(member.crowns) : 0}
            </div>
          </td>
          <td>
            <div class="px-3 font-monospace text-nowrap">
              <img width="25px"src="https://d36mxiodymuqjm.cloudfront.net/website/guilds/img_dec.png" alt="DEC">
              {member.dec ? formatCompactNumber(member.dec) : 0}
            </div>
          </td>
          <td>
            <div class="px-3 font-monospace text-nowrap">
              <img width="25px" class="ms-2"  src="https://d36mxiodymuqjm.cloudfront.net/website/guilds/img_quest_150.png" alt="Quest">
              {member.quest_lodge ? formatCompactNumber(member.quest_lodge) : 0}
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>