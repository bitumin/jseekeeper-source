export const eas = {
    0: "ANYONE", // Includes all allegiances.
    1: "INANIMATE", // E.g. Sun Statue in Temple of Amaunator (rngsta01.cre)
    2: "PC", // Regular party members.
    3: "FAMILIAR", // Familiars of mages.
    4: "ALLY",
    5: "CONTROLLED", // Creatures fully under control of the player.
    6: "CHARMED", // Uncontrolled ally (green selection circle) of the player.
    7: "REALLYCHARMED", // Creatures fully under control of the player.
    28: "GOODBUTRED", // Creatures of same allegiance as party, but uses red (hostile) selection circles. Can not be controlled by the player.
    29: "GOODBUTBLUE", // Creatures of same allegiance as party, but uses blue (neutral) selection circles. Can not be controlled by the player.
    30: "GOODCUTOFF", // Used by script actions and triggers. Includes all party-friendly allegiances.
    31: "NOTGOOD", // Used by script actions and triggers. Includes everything except party-friendly allegiances.
    126: "ANYTHING",
    127: "AREAOBJECT", // Doors, Containers, Regions and Animations. It is included in EA groups NOTGOOD, ANYTHING, and NOTEVIL.
    128: "NEUTRAL",
    198: "NOTNEUTRAL", // Used by neutrals when targeting with enemy-only spells.
    199: "NOTEVIL", // Used by script actions and triggers. Includes everything except hostile allegiances.
    200: "EVILCUTOFF", // Used by script actions and triggers. Includes all hostile allegiances.
    201: "EVILBUTGREEN", // Hostile creatures, but uses green (friendly) selection circles.
    202: "EVILBUTBLUE", // Hostile creatures, but uses blue (neutral) selection circles.
    254: "CHARMED_PC", // This is just a separate EA from ENEMY for detection purposes. They're still valid objects for EVILCUTOFF and NearestEnemyOf(), but not by ENEMY. It's not specific to PCs.
    255: "ENEMY", // Creatures that are hostile to the party and allied creatures.
}
