export const fields = {
    signature: {id: 'signature', offset: 0x0000, size: 4, type: 'header', help: 'Signature'},
    version: {id: 'version', offset: 0x0004, size: 4, type: 'header', help: 'Version'},
    partyMembersStructOffset: {id: 'partyMembersStructOffset', offset: 0x0020, size: 4, type: 'header', help: 'Offset to NPC structs for party members'},
    partyMembersStructCount: {id: 'partyMembersStructCount', offset: 0x0024, size: 4, type: 'header', help: 'Count of NPC structs for party members (including protagonist)'},
    partyInventoryOffset: {id: 'partyInventoryOffset', offset: 0x0028, size: 4, type: 'header', help: 'Offset to party inventory'},
    partyInventoryCount: {id: 'partyInventoryCount', offset: 0x002c, size: 4, type: 'header', help: 'Count of party inventory'},
    nonPartyMembersStructOffset: {id: 'nonPartyMembersStructOffset', offset: 0x0030, size: 4, type: 'header', help: 'Offset to NPC structs for non-party members'},
    nonPartyMembersStructCount: {id: 'nonPartyMembersStructCount', offset: 0x0034, size: 4, type: 'header', help: 'Count of NPC structs for non-party members'},
    globalNamespaceVariablesOffset: {id: 'globalNamespaceVariablesOffset', offset: 0x0038, size: 4, type: 'header', help: 'Offset to Global namespace variables'},
    globalNamespaceVariablesCount: {id: 'globalNamespaceVariablesCount', offset: 0x003c, size: 4, type: 'header', help: 'Count of Global namespace variables'},
    gameTime: {id: 'gameTime', offset: 0x0008, size: 4, type: 'header', help: 'Game time'},
    partyGold: {id: 'partyGold', offset: 0x0018, size: 4, type: 'header', help: 'Party gold'},
    partyReputation: {id: 'partyReputation', offset: 0x0054, size: 4, type: 'header', help: 'Party reputation'},
    characterName: {id: 'characterName', offset: 0x000c, size: 8, type: 'npc-struct', help: 'Character Name'},
    characterCurrentArea: {id: 'characterCurrentArea', offset: 0x0018, size: 8, type: 'npc-struct', help: 'Character current area'},
    creOffset: {id: 'creOffset', offset: 0x0004, size: 4, type: 'npc-struct', help: 'Offset (from start of file) to CRE resource data for this character'},
    creSize: {id: 'creSize', offset: 0x0008, size: 4, type: 'npc-struct', help: 'Size of CRE resource data for this character'},
    name: {id: 'name', offset: 0x00c0, size: 32, type: 'npc-struct', help: 'Name'},
    strongestKillName: {id: 'strongestKillName', offset: 0x0000, size: 4, type: 'char-stats', help: 'Most powerful vanquished - Name'},
    strongestKillXP: {id: 'strongestKillXP', offset: 0x0004, size: 4, type: 'char-stats', help: 'Most powerful vanquished - XP Reward'},
    timeInParty: {id: 'timeInParty', offset: 0x0008, size: 4, type: 'char-stats', help: 'Time in party (1/15 seconds)'},
    timeJoined: {id: 'timeJoined', offset: 0x000c, size: 4, type: 'char-stats', help: 'Time Joined (1/15 seconds)'},
    isPartyMember: {id: 'isPartyMember', offset: 0x0010, size: 1, type: 'char-stats', help: 'Party member (0 = Not in party, 1 = In party)'},
    firstLetterOfCre: {id: 'firstLetterOfCre', offset: 0x0013, size: 1, type: 'char-stats', help: 'First letter of CRE resref (changed to *)'},
    chapterKillsXP: {id: 'chapterKillsXP', offset: 0x0014, size: 4, type: 'char-stats', help: 'Kills - XP Gained (chapter)'},
    chapterKillsCount: {id: 'chapterKillsCount', offset: 0x0018, size: 4, type: 'char-stats', help: 'Kills - Number (chapter)'},
    gameKillsXP: {id: 'gameKillsXP', offset: 0x001c, size: 4, type: 'char-stats', help: 'Kills - XP (game)'},
    gameKillsCount: {id: 'gameKillsCount', offset: 0x0020, size: 4, type: 'char-stats', help: 'Kills - number (game)'},
    favouriteSpells: {id: 'favouriteSpells', offset: 0x0024, size: 4 * 8, type: 'char-stats', help: 'Favourite spells'},
    favouriteSpellCount: {id: 'favouriteSpellCount', offset: 0x0044, size: 4 * 2, type: 'char-stats', help: 'Favourite spell count'},
    favouriteWeapons: {id: 'favouriteWeapons', offset: 0x004c, size: 4 * 8, type: 'char-stats', help: 'Favourite weapons'},
    favouriteWeaponTime: {id: 'favouriteWeaponTime', offset: 0x006c, size: 4 * 2, type: 'char-stats', help: 'Favourite weapon time (time equipped in combat - 1/15 seconds)'},
    creSignature: {id: 'signature', offset: 0x0000, size: 4, type: 'cre', help: 'Signature'},
    creVersion: {id: 'version', offset: 0x0004, size: 4, type: 'cre', help: 'Version'},
    creatureFlags: {id: 'creatureFlags', offset: 0x0010, size: 4, type: 'cre', help: 'Creature flags'},
    experienceForKill: {id: 'experienceForKill', offset: 0x0014, size: 4, type: 'cre', help: 'XP (gained for killing this creature)'},
    experiencePoints: {id: 'experiencePoints', offset: 0x0018, size: 4, type: 'cre', help: 'Experience points'},
    goldCarried: {id: 'goldCarried', offset: 0x001c, size: 4, type: 'cre', help: 'Gold carried'},
    permanentStatusFlags: {id: 'permanentStatusFlags', offset: 0x0020, size: 4, type: 'cre', help: 'Permanent Status Flags'},
    currentHitPoints: {id: 'currentHitPoints', offset: 0x0024, size: 2, type: 'cre', help: 'Current hit points'},
    maxHitPoints: {id: 'maxHitPoints', offset: 0x0026, size: 2, type: 'cre', help: 'Max hit points'},
    animation: {id: 'animation', offset: 0x0028, size: 4, type: 'cre', help: 'Animation ID'},
    metalColour: {id: 'metalColour', offset: 0x002c, size: 1, type: 'cre', help: 'Metal Colour Index'},
    minorColour: {id: 'minorColour', offset: 0x002d, size: 1, type: 'cre', help: 'Minor Colour Index'},
    majorColour: {id: 'majorColour', offset: 0x002e, size: 1, type: 'cre', help: 'Major Colour Index'},
    skinColour: {id: 'skinColour', offset: 0x002f, size: 1, type: 'cre', help: 'Skin Colour Index'},
    leatherColour: {id: 'leatherColour', offset: 0x0030, size: 1, type: 'cre', help: 'Leather Colour Index'},
    armorColour: {id: 'armorColour', offset: 0x0031, size: 1, type: 'cre', help: 'Armor Colour Index'},
    hairColour: {id: 'hairColour', offset: 0x0032, size: 1, type: 'cre', help: 'Hair Colour Index'},
    mediumPortrait: {id: 'mediumPortrait', offset: 0x0034, size: 8, type: 'cre', help: 'Medium portrait'},
    largePortrait: {id: 'largePortrait', offset: 0x003c, size: 8, type: 'cre', help: 'Large portrait'},
    reputation: {id: 'reputation', offset: 0x0044, size: 1, type: 'cre', help: 'Reputation'},
    acNatural: {id: 'acNatural', offset: 0x0046, size: 2, type: 'cre', help: 'AC (Natural)'},
    acEffective: {id: 'acEffective', offset: 0x0048, size: 2, type: 'cre', help: 'AC (Effective)'},
    acCrushing: {id: 'acCrushing', offset: 0x004a, size: 2, type: 'cre', help: 'AC (Crushing Attacks Modifier)'},
    acMissile: {id: 'acMissile', offset: 0x004c, size: 2, type: 'cre', help: 'AC (Missile Attacks Modifier)'},
    acPiercing: {id: 'acPiercing', offset: 0x004e, size: 2, type: 'cre', help: 'AC (Piercing Attacks Modifier)'},
    acSlashing: {id: 'acSlashing', offset: 0x0050, size: 2, type: 'cre', help: 'AC (Slashing Attacks Modifier)'},
    thac0: {id: 'thac0', offset: 0x0052, size: 1, type: 'cre', help: 'THAC0 (1-25)'},
    attacksPerRound: {id: 'attacksPerRound', offset: 0x0053, size: 1, type: 'cre', help: 'Number of attacks (1-5)'},
    saveVsDeath: {id: 'saveVsDeath', offset: 0x0054, size: 1, type: 'cre', help: 'Save versus death (0-20)'},
    saveVsWands: {id: 'saveVsWands', offset: 0x0055, size: 1, type: 'cre', help: 'Save versus wands (0-20)'},
    saveVsPolymorph: {id: 'saveVsPolymorph', offset: 0x0056, size: 1, type: 'cre', help: 'Save versus polymorph (0-20)'},
    saveVsBreath: {id: 'saveVsBreath', offset: 0x0057, size: 1, type: 'cre', help: 'Save versus breath attacks (0-20)'},
    saveVsSpells: {id: 'saveVsSpells', offset: 0x0058, size: 1, type: 'cre', help: 'Save versus spells (0-20)'},
    resistFire: {id: 'resistFire', offset: 0x0059, size: 1, type: 'cre', help: 'Resist Fire (0-100)'},
    resistCold: {id: 'resistCold', offset: 0x005a, size: 1, type: 'cre', help: 'Resist Cold (0-100)'},
    resistElectricity: {id: 'resistElectricity', offset: 0x005b, size: 1, type: 'cre', help: 'Resist Electricity (0-100)'},
    resistAcid: {id: 'resistAcid', offset: 0x005c, size: 1, type: 'cre', help: 'Resist Acid (0-100)'},
    resistMagic: {id: 'resistMagic', offset: 0x005d, size: 1, type: 'cre', help: 'Resist Magic (0-100)'},
    resistMagicFire: {id: 'resistMagicFire', offset: 0x005e, size: 1, type: 'cre', help: 'Resist Magic Fire (0-100)'},
    resistMagicCold: {id: 'resistMagicCold', offset: 0x005f, size: 1, type: 'cre', help: 'Resist Magic Cold (0-100)'},
    resistSlashing: {id: 'resistSlashing', offset: 0x0060, size: 1, type: 'cre', help: 'Resist Slashing (%) (0-100)'},
    resistCrushing: {id: 'resistCrushing', offset: 0x0061, size: 1, type: 'cre', help: 'Resist Crushing (%) (0-100)'},
    resistPiercing: {id: 'resistPiercing', offset: 0x0062, size: 1, type: 'cre', help: 'Resist Piercing (%) (0-100)'},
    resistMissile: {id: 'resistMissile', offset: 0x0063, size: 1, type: 'cre', help: 'Resist Missile (%) (0-100)'},
    hideInShadows: {id: 'hideInShadows', offset: 0x0045, size: 1, type: 'cre', help: 'Hide in Shadows (base)'},
    detectIllusion: {id: 'detectIllusion', offset: 0x0064, size: 1, type: 'cre', help: 'Detect illusion (min 0)'},
    setTraps: {id: 'setTraps', offset: 0x0065, size: 1, type: 'cre', help: 'Set traps (min 0)'},
    lockpicking: {id: 'lockpicking', offset: 0x0067, size: 1, type: 'cre', help: 'Lockpicking (min 0)'},
    moveSilently: {id: 'moveSilently', offset: 0x0068, size: 1, type: 'cre', help: 'Move silently (min 0)'},
    findDisarmTraps: {id: 'findDisarmTraps', offset: 0x0069, size: 1, type: 'cre', help: 'Find/disarm traps (min 0)'},
    pickPockets: {id: 'pickPockets', offset: 0x006a, size: 1, type: 'cre', help: 'Pick pockets (min 0)'},
    loreLevel: {id: 'loreLevel', offset: 0x0066, size: 1, type: 'cre', help: 'Lore level (0-100)'},
    fatigue: {id: 'fatigue', offset: 0x006b, size: 1, type: 'cre', help: 'Fatigue (0-100)'},
    intoxication: {id: 'intoxication', offset: 0x006c, size: 1, type: 'cre', help: 'Intoxication (0-100)'},
    luck: {id: 'luck', offset: 0x006d, size: 1, type: 'cre', help: 'Luck'},
    turnUndead: {id: 'turnUndead', offset: 0x0082, size: 1, type: 'cre', help: 'Turn undead level'},
    trackingSkill: {id: 'trackingSkill', offset: 0x0083, size: 1, type: 'cre', help: 'Tracking skill (0-100)'},
    level1: {id: 'level1', offset: 0x0234, size: 1, type: 'cre', help: 'Level first class (0-100)'},
    level2: {id: 'level2', offset: 0x0235, size: 1, type: 'cre', help: 'Level second class (0-100)'},
    level3: {id: 'level3', offset: 0x0236, size: 1, type: 'cre', help: 'Level third class (0-100)'},
    strength: {id: 'strength', offset: 0x0238, size: 1, type: 'cre', help: 'Strength (1-25)'},
    strengthBonus: {id: 'strengthBonus', offset: 0x0239, size: 1, type: 'cre', help: 'Strength % bonus (0-100)'},
    intelligence: {id: 'intelligence', offset: 0x023a, size: 1, type: 'cre', help: 'Intelligence (1-25)'},
    wisdom: {id: 'wisdom', offset: 0x023b, size: 1, type: 'cre', help: 'Wisdom (1-25)'},
    dexterity: {id: 'dexterity', offset: 0x023c, size: 1, type: 'cre', help: 'Dexterity (1-25)'},
    constitution: {id: 'constitution', offset: 0x023d, size: 1, type: 'cre', help: 'Constitution (1-25)'},
    charisma: {id: 'charisma', offset: 0x023e, size: 1, type: 'cre', help: 'Charisma (1-25)'},
    morale: {id: 'morale', offset: 0x023f, size: 1, type: 'cre', help: 'Morale (0-20)'},
    moraleBreak: {id: 'moraleBreak', offset: 0x0240, size: 1, type: 'cre', help: 'Morale break (0-20)'},
    moraleRecoveryTime: {id: 'moraleRecoveryTime', offset: 0x0242, size: 2, type: 'cre', help: 'Morale recovery time'},
    racialEnemy: {id: 'racialEnemy', offset: 0x0241, size: 1, type: 'cre', help: 'Racial enemy'},
    kit: {id: 'kit', offset: 0x0244, size: 4, type: 'cre', help: 'Kit'},
    enemyAlly: {id: 'enemyAlly', offset: 0x0270, size: 1, type: 'cre', help: 'Enemy-Ally'},
    general: {id: 'general', offset: 0x0271, size: 1, type: 'cre', help: 'General'},
    race: {id: 'race', offset: 0x0272, size: 1, type: 'cre', help: 'Race'},
    class: {id: 'class', offset: 0x0273, size: 1, type: 'cre', help: 'Class'},
    gender: {id: 'gender', offset: 0x0275, size: 1, type: 'cre', help: 'Gender'},
    alignment: {id: 'alignment', offset: 0x027b, size: 1, type: 'cre', help: 'Alignment'},
    nonPcCharsName: {id: 'nonPcCharsName', offset: 0x0280, size: 32, type: 'cre', help: 'NPC Characters Name'},
    specific: {id: 'specific', offset: 0x0274, size: 1, type: 'cre', help: 'Specific'},
    weaponProficiency: {id: 'weaponProficiency', offset: 0x000c, size: 1, type: 'proficiencies', help: 'Weapon proficiency level'},
    proficiencyType: {id: 'proficiencyType', offset: 0x0010, size: 1, type: 'proficiencies', help: 'Weapon proficiency name'},
}

/*
 * Lore is calculated as ((level * rate) + int_bonus + wis_bonus).
 * Intelligence and wisdom bonuses are from LOREBON.2DA and the rate is the lookup value in LORE.2DA, based on class.
 * For multiclass characters, (level * rate) is calculated for both classes separately and the higher of the
 * two values is used - they are not cumulative.
 *
 * Highest attained level in class (0-100).
 * For dual/multi class characters, the levels for each class are split between 0x0234, 0x0235 and 0x0236
 * according to the internal class name, i.e. for a FIGHTER_THIEF 0x0234 will hold the fighter level,
 * 0x0235 will hold the thief level and 0x0236 will be 0.
 *
 * Morale default value is 10 (capped 0 — 20)
 * It is unclear what increases/decreases Morale or by how much.
 * A party member dying, and taking damage while already low on health are the obvious ways to lose Morale.
 *
 * Morale break is the lower bound for avoiding a morale failure.
 * If Morale is lower than this value, morale failure occurs, if Morale is higher, any morale failure is removed.
 * A value of 0 is effectively immune to morale failure though.
 * No creature has a Morale break value higher than 10 as they would always be in morale failure.
 * Morale also fails if Morale break = current Morale value, so 20 Morale will fail if Morale break is also 20.
 * Except if Morale break is 0, which cannot fail.
 *
 * Morale recovery time is the period of time (should be seconds) it takes to recover some amount of Morale naturally
 * (towards a value of 10, from a higher or lower value).
 * It's unknown what's going on internally though, as it's not consistent, and even the details given by CTRL+M
 * don't update Morale in real-time.
 */
