<script>
  export let buildings;
  const guildBuildings = JSON.parse(buildings);
</script>

<div class="h5 d-flex justify-content-center">
  <div class="me-2 text-nowrap badge bg-primary">
    <span class="text-muted me-2">Hall</span>
    {guildBuildings.guild_hall.level}
  </div>
  <div class="me-2 text-nowrap badge bg-primary">
    <span class="text-muted me-2">Lodge</span>
    {guildBuildings.quest_lodge.level}
  </div>
  <div class="me-2 text-nowrap badge bg-primary">
    <span class="text-muted me-2">Arena</span>
    {guildBuildings.arena.level}
  </div>
  <div class="me-2 text-nowrap badge bg-primary">
    <span class="text-muted me-2">Barracks</span>
    {guildBuildings.barracks.level}
  </div>
  <div class="me-2 text-nowrap badge bg-primary">
    <span class="text-muted me-2">Shop</span>
    {guildBuildings.guild_shop.level}
  </div>
</div>

