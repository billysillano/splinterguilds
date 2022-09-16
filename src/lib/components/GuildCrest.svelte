<script>
  import { IMG_ROOT_URL } from '../constants';
  export let data;
  export let size="";

  const crest = JSON.parse(data).crest;
  const banner = `${IMG_ROOT_URL}/guilds/banners/bg_banner_${crest.banner}.png`;
  const decal = `${IMG_ROOT_URL}/guilds/decals/img_guild_${crest.decal}.png`;
</script>

<div
  class:guild-crest--large={size==='large'}
  class="guild-crest"
  style={`background-image: url(${banner})`}
>
  <img
    src={decal}
    alt={crest.decal}
    class="guild-crest__decal"
  >
</div>

<style>
  .guild-crest {
    display: inline-flex;
    justify-content: center;
    background-size: contain;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
  }

  .guild-crest__decal {
    width: 15px;
    height: 15px;
    margin-top: 4px;
  }

  .guild-crest--large {
    width: 100px;
    height: 100px;
  }

  .guild-crest--large .guild-crest__decal {
    width: 70px;
    height: 70px;
  }
</style>