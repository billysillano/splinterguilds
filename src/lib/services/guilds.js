import { API2_URL, GAME_API_URL } from '../constants';

export const getGuilds = async () => {
  const res = await fetch(`${API2_URL}/guilds/list`);
  const guildsList = await res.json();
  return guildsList.guilds;
}

export const getGuildInfo = async (id) => {
  const res = await fetch(`${API2_URL}/guilds/find?id=${id}`);
  const guild = await res.json();
  return guild;
}

export const getGuildMembers = async (id) => {
  const res = await fetch(`${API2_URL}/guilds/members?guild_id=${id}&status=active`);
  const members = await res.json();
  if (!members) return [];

  members.forEach(member => {
    const data = JSON.parse(member.data)
    const {
      guild_hall = 0,
      arena = { DEC: 0, CROWN: 0},
      barracks = { DEC: 0, CROWN: 0 },
      guild_shop = { DEC: 0, CROWN: 0},
      quest_lodge = 0
    } = data.contributions
    member.dec = guild_hall + arena.DEC + barracks.DEC + guild_shop.DEC
    member.quest_lodge = quest_lodge
    member.crowns = arena.CROWN + barracks.CROWN + guild_shop.CROWN

    member.join_date = new Date(member.join_date).toLocaleDateString()
  });
  
  return members.reverse();
}

export const getGuildMemberInfo = async (name) => {
  const details = await fetch(`${GAME_API_URL}/players/details?name=${name}`);
  const balances = await fetch(`${GAME_API_URL}/players/balances?username=${name}`);
  const history = await fetch(`${GAME_API_URL}/battle/history?player=${name}`);
  const member = {
    details: null,
    balances: null,
    history: null, 
  };

  member.details = await details.json();
  member.balances = await balances.json();
  member.history = await history.json();

  return member;
}

export const getGuildBrawlInfo = async ({tournament_id, id}) => {
  const res = await fetch(`${API2_URL}/tournaments/find_brawl?id=${tournament_id}&guild_id=${id}`);
  const result = await res.json();
  return result;
}

export const getPlayerInfo = async (name) => {
  const res = await fetch(`${API2_URL}/players/details?name=${name}`);
  const details= await res.json();
  return details;
}

export const getGuildBrawlRecords = async (guildId, cycleStart, cycleEnd) => {
  const res = await fetch(`${API2_URL}/guilds/brawl_records?guild_id=${guildId}&start_cycle=${cycleStart}&end_cycle=${cycleEnd}`);
  const details= await res.json();
  return details.results || [];
}

export const getGuildBrawlByTournament = async (tournament_id) => {
  const res = await fetch(`${API2_URL}/guilds/brawl_records?tournament_id=${tournament_id}`);
  const details= await res.json();
  return details.results || [];
}

// export const getGuildBrawlMatchup = async ({tournament_id, name, user}) => {
//   const res = await fetch(`${API2_URL}/tournaments/battles?id=${tournament_id}&round=1&player=${name}&token=${user.token}&username=${name}`);
//   const result = await res.json();
//   return result;
// }

// export const login =  async(username) => {
//   if(!window.hive_keychain) return alert('You must have hive keychain to login');

//   let hive_keychain = window.hive_keychain;

//   username = username.toLowerCase().trim();
//   if(username.startsWith('@'))
//   username = username.substr(1);

//   let params = { name: username, ts: Date.now(), sig: '' };
//   params.sig = await new Promise(resolve => hive_keychain.requestSignBuffer(username, username + params.ts, 'Posting', r => resolve(r.result)));

//   if(params.sig) {
//     const res =  await fetch(`https://api2.splinterlands.com/players/v2/login?name=${params.name}&ts=${params.ts}&keychain=true&sig=${params.sig}`);
//     const auth = await res.json();
//     return auth;
//   } else {
//     return '';
//   }
// }
