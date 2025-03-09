export const states = {
    0x00000000: "STATE_NORMAL",
    0x00000001: "STATE_SLEEPING", // Set by opcode #39
    0x00000002: "STATE_BERSERK", // Set by opcode #3
    0x00000004: "STATE_PANIC", // Set by opcode #24
    0x00000008: "STATE_STUNNED", // Set by opcode #45
    0x00000010: "STATE_INVISIBLE", // Set by opcode #20
    0x00000020: "STATE_HELPLESS", // Set by opcode #109, opcode #157, opcode #175 and opcode #185
    0x00000029: "STATE_IMMOBILE",
    0x00000040: "STATE_FROZEN_DEATH", // Set by opcode #13
    0x00000080: "STATE_STONE_DEATH", // Set by opcode #13
    0x00000100: "STATE_EXPLODING_DEATH", // Set by opcode #13
    0x00000200: "STATE_FLAME_DEATH", // Set by opcode #13
    0x00000400: "STATE_ACID_DEATH", // Set by opcode #13
    0x00000800: "STATE_DEAD",
    0x00000FC0: "STATE_REALLY_DEAD",
    0x00001000: "STATE_SILENCED", // Set by opcode #38
    0x00002000: "STATE_CHARMED", // Set by opcode #5 and opcode #241
    0x00004000: "STATE_POISONED", // Set by opcode #25
    0x00008000: "STATE_HASTED", // Set by opcode #16 and opcode #317
    0x00010000: "STATE_SLOWED", // Set by opcode #40
    0x00020000: "STATE_INFRAVISION", // Set by opcode #63
    0x00040000: "STATE_BLIND", // Set by opcode #74
    0x00080000: "STATE_DISEASED",
    0x00100000: "STATE_FEEBLEMINDED", // Set by opcode #76
    0x00102029: "STATE_HARMLESS",
    0x00200000: "STATE_NONDETECTION", // Set by opcode #69
    0x00400000: "STATE_IMPROVEDINVISIBILITY", // Set by opcode #20
    0x00400010: "STATE_NOT_TARGETABLE",
    0x00800000: "STATE_BLESS", // Set by opcode #130
    0x01000000: "STATE_CHANT", // Set by opcode #131
    0x02000000: "STATE_DRAWUPONHOLYMIGHT", // Set by opcode #132
    0x04000000: "STATE_LUCK", // Set by opcode #133
    0x08000000: "STATE_AID", // Set by opcode #129
    0x10000000: "STATE_CHANTBAD", // Set by opcode #137
    0x20000000: "STATE_BLUR", // Set by opcode #65
    0x40000000: "STATE_MIRRORIMAGE", // Set by opcode #159
    0x60400010: "STATE_ILLUSIONS",
    0x80000000: "STATE_CONFUSED", // Set by opcode #128
    0x80040004: "STATE_RANGED_TARGET",
    0x80101FEF: "CD_STATE_NOTVALID",
    0x8010202D: "STATE_DISABLED",
    0x8010302D: "STATE_DISABLED_CASTING",
    0x8015302D: "STATE_DEBUFF",
    0x80002006: "STATE_NOT_APPROACHABLE",
}
