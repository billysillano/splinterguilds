<script>
import { onMount } from "svelte";
import { LEAGUES } from "../constants";
import { getGuildMemberInfo } from "../services/guilds";


export let member;
let player = null;
let battles = null;

onMount(async () => {
  player = await getGuildMemberInfo(member.player);

  if (player.history && player.history.battles.length) {
    const tournament = player.history.battles.filter(i => i.match_type==='Tournament');
    const ranked = player.history.battles.filter(i => i.match_type==='Ranked');
    const challenge = player.history.battles.filter(i => i.match_type==='Challenge');
    const tournamentWins = tournament.filter(i => i.match_type==='Tournament'  && i.winner === player.history.player).length;
    const rankedWins = ranked.filter(i => i.match_type==='Ranked' && i.winner === player.history.player).length;
    const challengeWins = challenge.filter(i => i.match_type==='Challenge' && i.winner === player.history.player).length;
    const lastBattleDate = new Date(player.history.battles[0].created_date).toLocaleString();
    battles = {
      lastBattleDate: lastBattleDate,
      tournament: {
        count: tournament.length,
        wins: tournamentWins,
      },
      ranked: {
        count: ranked.length,
        wins: rankedWins,
      },
      challenge: {
        count: challenge.length,
        wins: challengeWins,
      }
    }
  }
})
</script>

{#if player}
<div class="member">
	<p>name: {player.details.name}</p>
	<p>modern league: {LEAGUES[player.details.modern_league]} @ {player.details.modern_rating}</p>
	<p>wild league: {LEAGUES[player.details.league]} @ {player.details.rating}</p>
	<p>title: {player.details.title_post}</p>
	<p>champion points: {player.details.champion_points}</p>
	<p>battles: {player.details.battles}</p>
	<p>wins: {player.details.wins}</p>
	<p>win rate: {Number((player.details.wins / player.details.battles) * 100).toFixed(2)}%</p>
  <p>modern battles: {player.details.modern_battles}</p>
	<p>modern wins: {player.details.modern_wins}</p>
	<p>win rate: {Number((player.details.modern_wins / player.details.modern_battles) * 100).toFixed(2)}%</p>
  ____________________
  {#if battles}
    <p>Last 50 battles: {`won: ${battles.tournament.wins + battles.ranked.wins + battles.challenge.wins} / fights:${battles.tournament.count + battles.ranked.count + battles.challenge.count}`}</p>
    <p>Tournaments: {`won: ${battles.tournament.wins} / fights:${battles.tournament.count}`}</p>
    <p>Ranks: {`won: ${battles.ranked.wins} / fights:${battles.ranked.count}`}</p>
    <p>Challenges: {`won: ${battles.challenge.wins} / fights:${battles.challenge.count}`}</p>
    <p>Last battle: {battles.lastBattleDate}</p>
  {/if}
  ____________________

  <table>
    {#each player.balances as balance }
    <tr>
      <td>{balance.token}</td>
      <td>{balance.balance}</td>
    </tr>
    {/each}
  </table>
</div>
{/if}

<style>
	.member {
		color: #fff;
		padding: 4px 5px;
		border: 1px solid #444;
		background-color: #333;
		margin-top: 10px;
	}
</style>