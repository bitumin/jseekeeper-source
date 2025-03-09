import {fields} from "../data/fields"
import {secondsToDhms} from "../utils/time"

export class GamV20HexEditor {
    /*
     * Names                        Bytes   Bits    Value range                         # Values            Comment
     * -------------------------------------------------------------------------------------------------------------------------------
     * char, byte                   1       8       -128 to +127                        256                 Signed Byte or character
     * uchar, ubyte                 1       8       0 to 255                            256                 Unsigned Byte or character
     * short, int16                 2       16      −32,768 to +32,767                  65,536              Signed 16 bit integer
     * ushort, uint16, word         2       16      0 to 65535                          65,536              Unsigned 16 bit integer
     * int, int32, long             4       32      −2,147,483,648 to +2,147,483,647    4,294,967,295       Signed 32 bit integer
     * uint, uint32, ulong, dword   4       32      0 to 4,294,967,295                  4,294,967,295       Unsigned 32 bit integer
     */

    _hexArray
    _headerOffset
    _partyMembersStructsOffsets = []
    _partyMembersCreOffsets = []
    _partyMembersStatsOffsets = []
    _partyMembersProficienciesOffsets = []
    _isValidGamFile = false

    /**
     * @param {Array.<Number>} uint8array
     * @returns {Array.<String>}
     */
    constructor(uint8array) {
        let hexArray = []
        for (let i in uint8array) {
            hexArray.push((0 + uint8array[i].toString(16)).slice(-2))
        }
        this._hexArray = hexArray
        this._headerOffset = 0x0000
        this._isValidGamFile = this._validateGamFile()
        if (this._isValidGamFile) {
            this._locateCharactersOffsets()
        }
    }

    /**
     * @returns {Boolean}
     */
    get isValidGamFile() {
        return this._isValidGamFile
    }

    /**
     * @param {Number} characterIdx
     * @returns {Number}
     */
    getCharacterProficienciesCount(characterIdx) {
        return this._partyMembersProficienciesOffsets[characterIdx].length
    }

    exportAsInt8Array() {
        return new Uint8Array(this._hexArray.map(byte => parseInt(byte, 16)));
    }

    readField(fieldId, characterIdx, proficiencyIdx) {
        const field = fields[fieldId]
        if (!field) {
            throw `Invalid field ${fieldId}`
        }
        const startOffset = this._getStartOffset(field, characterIdx, proficiencyIdx)
        return this._readOffsetValue({...field, offset: startOffset + field.offset})
    }

    _getStartOffset(field, characterIdx, proficiencyIdx) {
        switch (field.type) {
            case 'header':
                return 0
            case 'cre':
                return this._partyMembersCreOffsets[characterIdx]
            case 'npc-struct':
                return this._partyMembersStructsOffsets[characterIdx]
            case 'char-stats':
                return this._partyMembersStatsOffsets[characterIdx]
            case 'proficiencies':
                return this._partyMembersProficienciesOffsets[characterIdx][proficiencyIdx]
            default:
                throw `Start offset not found for field ${field.id}`
        }
    }

    writeField(newValue, fieldId, characterIdx, proficiencyIdx) {
        const field = fields[fieldId]
        if (!field) {
            throw `Invalid field ${fieldId}`
        }
        const startOffset = this._getStartOffset(field, characterIdx, proficiencyIdx)
        return this._writeOffsetValue({...field, offset: startOffset + field.offset, value: newValue})
    }

    /**
     * @returns {Boolean}
     * @private
     */
    _validateGamFile() {
        return this.readField('signature') === 'GAME'
            && this.readField('version') === 'V2.0'
    }

    /**
     * @returns {Array.<Number>}
     * @private
     */
    _locateCharactersOffsets() {
        const partyMembersStructOffset = this.readField('partyMembersStructOffset')
        const partyMembersStructCount = this.readField('partyMembersStructCount')
        const structSize = 352

        for (let i = 0, iMax = partyMembersStructCount; i < iMax; i++) {
            this._partyMembersStructsOffsets.push(partyMembersStructOffset + (structSize * i))
        }
        for (let i = 0, iMax = partyMembersStructCount; i < iMax; i++) {
            this._partyMembersCreOffsets.push(this.readField('creOffset', i))
        }
        for (let i = 0, iMax = partyMembersStructCount; i < iMax; i++) {
            this._partyMembersStatsOffsets.push(this._partyMembersStructsOffsets[i] + 0x00e4)
        }

        // Locate proficiencies of party members by pattern.
        // TODO: investigate how to locate these offsets more efficiently
        // TODO: investigate how to distinguish proficiencies for 1st / 2nd dual class case
        const pattern = [
            'e9', '00', '00', '00',
            '??', '00', '00', '00', // ?
            '00', '00', '00', '00',
            '??', '00', '00', '00', // Weapon proficiency
            '??', '00', '00', '00', // Proficiency type
            '09', '00', '00', '00',
            '00', '00', '00', '00',
            '64', '00'
        ]
        for (let i = 0, iMax = partyMembersStructCount; i < iMax; i++) {
            let proficienciesOffsets = []
            let o = this.readField('creOffset', i)
            let oMax = o + this.readField( 'creSize', i)
            for (; o < oMax; o++) {
                for (let p = 0, pMax = pattern.length; p < pMax; p++) {
                    if (pattern[p] === '??') {
                        continue
                    }
                    if (this._hexArray[o + p] !== pattern[p]) {
                        break
                    }
                    if (p === (pattern.length - 1)) { // Pattern match!
                        proficienciesOffsets.push(o)
                    }
                }
            }
            this._partyMembersProficienciesOffsets.push(proficienciesOffsets)
        }
    }

    /**
     * @param offset Offset
     * @param size Size (in bytes)
     * @returns {number}
     * @private
     */
    _getIntLittleEndian(offset, size) {
        return parseInt('0x' + this._hexArray.slice(offset, offset + size).reverse().join(''), 16)
    }

    /**
     * @param offset Offset
     * @param size Size (in bytes)
     * @returns {number}
     * @private
     */
    _getIntBigEndian(offset, size) {
        return parseInt('0x' + this._hexArray.slice(offset, offset + size).join(''), 16)
    }

    /**
     * @param offset Offset
     * @param size Size (in bytes)
     * @returns {String}
     * @private
     */
    _toBinaryString(offset, size) {
        return this._getIntBigEndian(offset, size).toString(2).padStart(size * 8, '0')
    }

    /**
     * @param offset Offset
     * @param size Size (in bytes)
     * @param removePadding Remove empty bytes (0x00) from the end
     * @returns {number}
     */
    _getCharsString(offset, size, removePadding = true) {
        if (!removePadding) {
            return this._hexArray.slice(offset, offset + size)
                .map(hex => String.fromCharCode(parseInt(hex, 16)))
                .join('')
        }

        let bytes = this._hexArray.slice(offset, offset + size).reverse()
        let paddingCount = 0
        for (const i in bytes) {
            if (bytes[i] === '00') {
                ++paddingCount
                continue
            }
            break
        }

        if (paddingCount > 0) {
            return bytes.slice(paddingCount)
                .reverse()
                .map(hex => String.fromCharCode(parseInt(hex, 16)))
                .join('')
        }

        return bytes.reverse()
            .map(hex => String.fromCharCode(parseInt(hex, 16)))
            .join('')
    }

    _readOffsetValue({offset, size, id}) {
        switch (id) {
            case 'isPartyMember':
                return 1 === this._getIntLittleEndian(offset, size)
            case 'creatureFlags':
                return this._toBinaryString(offset, size)
            case 'gameTime':
                return secondsToDhms((this._getIntLittleEndian(offset, size) - 2100) * 12)
            case 'partyReputation':
            case 'reputation':
                return this._getIntLittleEndian(offset, size) / 10
            case 'timeInParty':
            case 'timeJoined':
                return secondsToDhms(this._getIntLittleEndian(offset, size) * 15)
            case 'signature':
            case 'version':
            case 'creSignature':
            case 'creVersion':
                return this._getCharsString(offset, size, false)
            case 'mediumPortrait':
            case 'largePortrait':
            case 'name':
            case 'characterName':
            case 'characterCurrentArea':
            case 'firstLetterOfCre':
            case 'nonPcCharsName':
                return this._getCharsString(offset, size)
            case 'thac0':
            case 'attacksPerRound':
            case 'saveVsDeath':
            case 'saveVsWands':
            case 'saveVsPolymorph':
            case 'saveVsBreath':
            case 'saveVsSpells':
                const int8 = this._getIntLittleEndian(offset, size)
                return int8 < 128 ? int8 : -(256 - int8)
            case 'acNatural':
            case 'acEffective':
            case 'acCrushing':
            case 'acMissile':
            case 'acPiercing':
            case 'acSlashing':
                const int16 = this._getIntLittleEndian(offset, size)
                return int16 < 32768 ? int16 : -(65536 - int16)
            case 'partyGold':
            case 'goldCarried':
            case 'experiencePoints':
            case 'experienceForKill':
            case 'currentHitPoints':
            case 'maxHitPoints':
            case 'resistFire':
            case 'resistCold':
            case 'resistElectricity':
            case 'resistAcid':
            case 'resistMagic':
            case 'resistMagicFire':
            case 'resistMagicCold':
            case 'resistSlashing':
            case 'resistCrushing':
            case 'resistPiercing':
            case 'resistMissile':
            case 'hideInShadows':
            case 'detectIllusion':
            case 'setTraps':
            case 'lockpicking':
            case 'moveSilently':
            case 'findDisarmTraps':
            case 'pickPockets':
            case 'loreLevel':
            case 'fatigue':
            case 'intoxication':
            case 'luck':
            case 'turnUndead':
            case 'trackingSkill':
            case 'level1':
            case 'level2':
            case 'level3':
            case 'strength':
            case 'strengthBonus':
            case 'intelligence':
            case 'wisdom':
            case 'dexterity':
            case 'constitution':
            case 'charisma':
            case 'morale':
            case 'moraleBreak':
            case 'moraleRecoveryTime':
            case 'partyMembersStructOffset':
            case 'partyMembersStructCount':
            case 'partyInventoryOffset':
            case 'partyInventoryCount':
            case 'nonPartyMembersStructOffset':
            case 'nonPartyMembersStructCount':
            case 'globalNamespaceVariablesOffset':
            case 'globalNamespaceVariablesCount':
            case 'racialEnemy':
            case 'enemyAlly':
            case 'general':
            case 'race':
            case 'class':
            case 'specific':
            case 'gender':
            case 'kit':
            case 'alignment':
            case 'strongestKillXP':
            case 'chapterKillsXP':
            case 'chapterKillsCount':
            case 'gameKillsXP':
            case 'gameKillsCount':
            case 'strongestKillName':
            case 'animation':
            case 'metalColour':
            case 'minorColour':
            case 'majorColour':
            case 'skinColour':
            case 'leatherColour':
            case 'armorColour':
            case 'hairColour':
            case 'creOffset':
            case 'creSize':
            case 'weaponProficiency':
            case 'proficiencyType':
                return this._getIntLittleEndian(offset, size)
            default:
                throw 'Field getter not defined'
        }
    }

    _writeIntLittleEndian(offset, size, value) {
        const newHexValues = parseInt(value, 10).toString(16).padStart(size * 2 , '0').match(/.{2}/g).reverse()
        for (let i = 0, iMax = size; i < iMax; i++) {
            this._hexArray[offset + i] = newHexValues[i]
        }
    }

    _writeOffsetValue({offset, size, id, value}) {
        switch (id) {
            case 'partyReputation':
            case 'reputation':
                this._writeIntLittleEndian(offset, size, parseInt(value, 10) * 10)
                break
            case 'thac0':
            case 'attacksPerRound':
            case 'saveVsDeath':
            case 'saveVsWands':
            case 'saveVsPolymorph':
            case 'saveVsBreath':
            case 'saveVsSpells':
                const int8 = parseInt(value)
                this._writeIntLittleEndian(offset, size, int8 < 0 ? 256 + int8 : int8)
                break
            case 'acNatural':
            case 'acEffective':
            case 'acCrushing':
            case 'acMissile':
            case 'acPiercing':
            case 'acSlashing':
                const int16 = parseInt(value)
                this._writeIntLittleEndian(offset, size, int16 < 0 ? 65536 + int16 : int16)
                break
            case 'partyGold':
            case 'goldCarried':
            case 'experiencePoints':
            case 'experienceForKill':
            case 'currentHitPoints':
            case 'maxHitPoints':
            case 'resistFire':
            case 'resistCold':
            case 'resistElectricity':
            case 'resistAcid':
            case 'resistMagic':
            case 'resistMagicFire':
            case 'resistMagicCold':
            case 'resistSlashing':
            case 'resistCrushing':
            case 'resistPiercing':
            case 'resistMissile':
            case 'hideInShadows':
            case 'detectIllusion':
            case 'setTraps':
            case 'lockpicking':
            case 'moveSilently':
            case 'findDisarmTraps':
            case 'pickPockets':
            case 'loreLevel':
            case 'fatigue':
            case 'intoxication':
            case 'luck':
            case 'turnUndead':
            case 'trackingSkill':
            case 'level1':
            case 'level2':
            case 'level3':
            case 'strength':
            case 'strengthBonus':
            case 'intelligence':
            case 'wisdom':
            case 'dexterity':
            case 'constitution':
            case 'charisma':
            case 'morale':
            case 'moraleBreak':
            case 'moraleRecoveryTime':
            case 'racialEnemy':
            case 'enemyAlly':
            case 'general':
            case 'race':
            case 'class':
            case 'specific':
            case 'gender':
            case 'kit':
            case 'alignment':
            case 'strongestKillXP':
            case 'chapterKillsXP':
            case 'chapterKillsCount':
            case 'gameKillsXP':
            case 'gameKillsCount':
            case 'weaponProficiency':
                this._writeIntLittleEndian(offset, size, value)
                break
            default:
                throw 'Field getter not defined'
        }
    }
}
