import { NGSL_RAW, NgslWord } from './ngslDataPart1';
import { NGSL_RAW_2 } from './ngslDataPart2';

export type { NgslWord };

const FULL_RAW = `${NGSL_RAW.trim()}\n${NGSL_RAW_2.trim()}`;

export const NGSL_WORDS: NgslWord[] = FULL_RAW.split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [groupStr, lemma, rankStr, sfi, freqStr, pos, pt] = line.split('|');
    return {
      group: parseInt(groupStr, 10),
      lemma: lemma.trim(),
      rank: parseInt(rankStr, 10),
      sfi: sfi.trim(),
      freq: parseInt(freqStr, 10),
      pos: pos.trim(),
      pt: pt.trim(),
    };
  });

export const NGSL_GROUPS: Record<number, NgslWord[]> = {};
export const NGSL_BY_LEMMA: Record<string, NgslWord> = {};

for (const word of NGSL_WORDS) {
  if (!NGSL_GROUPS[word.group]) {
    NGSL_GROUPS[word.group] = [];
  }
  NGSL_GROUPS[word.group].push(word);
  NGSL_BY_LEMMA[word.lemma.toLowerCase()] = word;
}

export const TOTAL_GROUPS = 352;
export const TOTAL_WORDS = NGSL_WORDS.length;

// Common irregular or inflected word mappings to base NGSL lemmas for instant click tooltip fallback
const INFLECTION_MAP: Record<string, string> = {
  am: 'be',
  is: 'be',
  are: 'be',
  was: 'be',
  were: 'be',
  been: 'be',
  being: 'be',
  has: 'have',
  had: 'have',
  having: 'have',
  does: 'do',
  did: 'do',
  done: 'do',
  doing: 'do',
  says: 'say',
  said: 'say',
  saying: 'say',
  goes: 'go',
  went: 'go',
  gone: 'go',
  going: 'go',
  gets: 'get',
  got: 'get',
  gotten: 'get',
  getting: 'get',
  makes: 'make',
  made: 'make',
  making: 'make',
  knows: 'know',
  knew: 'know',
  known: 'know',
  knowing: 'know',
  thinks: 'think',
  thought: 'think',
  thinking: 'think',
  takes: 'take',
  took: 'take',
  taken: 'take',
  taking: 'take',
  sees: 'see',
  saw: 'see',
  seen: 'see',
  seeing: 'see',
  comes: 'come',
  came: 'come',
  coming: 'come',
  wants: 'want',
  wanted: 'want',
  wanting: 'want',
  looks: 'look',
  looked: 'look',
  looking: 'look',
  uses: 'use',
  used: 'use',
  using: 'use',
  finds: 'find',
  found: 'find',
  finding: 'find',
  gives: 'give',
  gave: 'give',
  given: 'give',
  giving: 'give',
  tells: 'tell',
  told: 'tell',
  telling: 'tell',
  works: 'work',
  worked: 'work',
  working: 'work',
  calls: 'call',
  called: 'call',
  calling: 'call',
  tries: 'try',
  tried: 'try',
  trying: 'try',
  asks: 'ask',
  asked: 'ask',
  asking: 'ask',
  needs: 'need',
  needed: 'need',
  needing: 'need',
  feels: 'feel',
  felt: 'feel',
  feeling: 'feel',
  becomes: 'become',
  became: 'become',
  becoming: 'become',
  leaves: 'leave',
  left: 'leave',
  leaving: 'leave',
  puts: 'put',
  putting: 'put',
  means: 'mean',
  meant: 'mean',
  meaning: 'mean',
  keeps: 'keep',
  kept: 'keep',
  keeping: 'keep',
  lets: 'let',
  letting: 'let',
  begins: 'begin',
  began: 'begin',
  begun: 'begin',
  beginning: 'begin',
  seems: 'seem',
  seemed: 'seem',
  seeming: 'seem',
  helps: 'help',
  helped: 'help',
  helping: 'help',
  talks: 'talk',
  talked: 'talk',
  talking: 'talk',
  turns: 'turn',
  turned: 'turn',
  turning: 'turn',
  starts: 'start',
  started: 'start',
  starting: 'start',
  shows: 'show',
  showed: 'show',
  shown: 'show',
  showing: 'show',
  hears: 'hear',
  heard: 'hear',
  hearing: 'hear',
  plays: 'play',
  played: 'play',
  playing: 'play',
  runs: 'run',
  ran: 'run',
  running: 'run',
  moves: 'move',
  moved: 'move',
  moving: 'move',
  likes: 'like',
  liked: 'like',
  liking: 'like',
  lives: 'live',
  lived: 'live',
  living: 'live',
  believes: 'believe',
  believed: 'believe',
  believing: 'believe',
  holds: 'hold',
  held: 'hold',
  holding: 'hold',
  brings: 'bring',
  brought: 'bring',
  bringing: 'bring',
  happens: 'happen',
  happened: 'happen',
  happening: 'happen',
  writes: 'write',
  wrote: 'write',
  written: 'write',
  writing: 'write',
  provides: 'provide',
  provided: 'provide',
  providing: 'provide',
  sits: 'sit',
  sat: 'sit',
  sitting: 'sit',
  stands: 'stand',
  stood: 'stand',
  standing: 'stand',
  loses: 'lose',
  lost: 'lose',
  losing: 'lose',
  pays: 'pay',
  paid: 'pay',
  paying: 'pay',
  meets: 'meet',
  met: 'meet',
  meeting: 'meet',
  includes: 'include',
  included: 'include',
  including: 'include',
  continues: 'continue',
  continued: 'continue',
  continuing: 'continue',
  sets: 'set',
  setting: 'set',
  learns: 'learn',
  learned: 'learn',
  learning: 'learn',
  changes: 'change',
  changed: 'change',
  changing: 'change',
  leads: 'lead',
  led: 'lead',
  leading: 'lead',
  understands: 'understand',
  understood: 'understand',
  understanding: 'understand',
  watches: 'watch',
  watched: 'watch',
  watching: 'watch',
  follows: 'follow',
  followed: 'follow',
  following: 'follow',
  stops: 'stop',
  stopped: 'stop',
  stopping: 'stop',
  creates: 'create',
  created: 'create',
  creating: 'create',
  speaks: 'speak',
  spoke: 'speak',
  spoken: 'speak',
  speaking: 'speak',
  reads: 'read',
  reading: 'read',
  allows: 'allow',
  allowed: 'allow',
  allowing: 'allow',
  adds: 'add',
  added: 'add',
  adding: 'add',
  spends: 'spend',
  spent: 'spend',
  spending: 'spend',
  grows: 'grow',
  grew: 'grow',
  grown: 'grow',
  growing: 'grow',
  opens: 'open',
  opened: 'open',
  opening: 'open',
  walks: 'walk',
  walked: 'walk',
  walking: 'walk',
  wins: 'win',
  won: 'win',
  winning: 'win',
  offers: 'offer',
  offered: 'offer',
  offering: 'offer',
  remembers: 'remember',
  remembered: 'remember',
  remembering: 'remember',
  loves: 'love',
  loved: 'love',
  loving: 'love',
  considers: 'consider',
  considered: 'consider',
  considering: 'consider',
  appears: 'appear',
  appeared: 'appear',
  appearing: 'appear',
  buys: 'buy',
  bought: 'buy',
  buying: 'buy',
  waits: 'wait',
  waited: 'wait',
  waiting: 'wait',
  serves: 'serve',
  served: 'serve',
  serving: 'serve',
  dies: 'die',
  died: 'die',
  dying: 'die',
  sends: 'send',
  sent: 'send',
  sending: 'send',
  expects: 'expect',
  expected: 'expect',
  expecting: 'expect',
  builds: 'build',
  built: 'build',
  building: 'build',
  stays: 'stay',
  stayed: 'stay',
  staying: 'stay',
  falls: 'fall',
  fell: 'fall',
  fallen: 'fall',
  falling: 'fall',
  cuts: 'cut',
  cutting: 'cut',
  reaches: 'reach',
  reached: 'reach',
  reaching: 'reach',
  kills: 'kill',
  killed: 'kill',
  killing: 'kill',
  remains: 'remain',
  remained: 'remain',
  remaining: 'remain',
  children: 'child',
  men: 'man',
  women: 'woman',
  feet: 'foot',
  teeth: 'tooth',
  mice: 'mouse',
  my: 'I',
  me: 'I',
  our: 'we',
  us: 'we',
  your: 'you',
  his: 'he',
  him: 'he',
  her: 'she',
  hers: 'she',
  its: 'it',
  their: 'they',
  them: 'they',
  these: 'this',
  those: 'that',
  an: 'a',
};

export function lookupNgslWord(rawToken: string): NgslWord | undefined {
  const clean = rawToken.replace(/[^a-zA-Z']/g, '').toLowerCase();
  if (!clean) return undefined;

  if (NGSL_BY_LEMMA[clean]) return NGSL_BY_LEMMA[clean];
  if (INFLECTION_MAP[clean] && NGSL_BY_LEMMA[INFLECTION_MAP[clean].toLowerCase()]) {
    return NGSL_BY_LEMMA[INFLECTION_MAP[clean].toLowerCase()];
  }

  // Stemming rules for regular inflections (-s, -es, -ed, -ing, -ly)
  if (clean.endsWith('ies') && clean.length > 4) {
    const base = clean.slice(0, -3) + 'y';
    if (NGSL_BY_LEMMA[base]) return NGSL_BY_LEMMA[base];
  }
  if (clean.endsWith('ied') && clean.length > 4) {
    const base = clean.slice(0, -3) + 'y';
    if (NGSL_BY_LEMMA[base]) return NGSL_BY_LEMMA[base];
  }
  if (clean.endsWith('es') && clean.length > 3) {
    const base1 = clean.slice(0, -2);
    if (NGSL_BY_LEMMA[base1]) return NGSL_BY_LEMMA[base1];
    const base2 = clean.slice(0, -1);
    if (NGSL_BY_LEMMA[base2]) return NGSL_BY_LEMMA[base2];
  }
  if (clean.endsWith('s') && clean.length > 2) {
    const base = clean.slice(0, -1);
    if (NGSL_BY_LEMMA[base]) return NGSL_BY_LEMMA[base];
  }
  if (clean.endsWith('ed') && clean.length > 3) {
    const base1 = clean.slice(0, -2);
    if (NGSL_BY_LEMMA[base1]) return NGSL_BY_LEMMA[base1];
    const base2 = clean.slice(0, -1);
    if (NGSL_BY_LEMMA[base2]) return NGSL_BY_LEMMA[base2];
    if (clean.length > 4 && clean[clean.length - 3] === clean[clean.length - 4]) {
      const base3 = clean.slice(0, -3);
      if (NGSL_BY_LEMMA[base3]) return NGSL_BY_LEMMA[base3];
    }
  }
  if (clean.endsWith('ing') && clean.length > 4) {
    const base1 = clean.slice(0, -3);
    if (NGSL_BY_LEMMA[base1]) return NGSL_BY_LEMMA[base1];
    const base2 = clean.slice(0, -3) + 'e';
    if (NGSL_BY_LEMMA[base2]) return NGSL_BY_LEMMA[base2];
    if (clean.length > 5 && clean[clean.length - 4] === clean[clean.length - 5]) {
      const base3 = clean.slice(0, -4);
      if (NGSL_BY_LEMMA[base3]) return NGSL_BY_LEMMA[base3];
    }
  }

  return undefined;
}
