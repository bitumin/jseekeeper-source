<script>
    import {onMount} from "svelte";
    import {GamV20HexEditor} from "./lib/GamV20HexEditor";
    import {portraits} from "./data/portraits";
    import {genders} from "./data/genders";
    import {races} from "./data/races";
    import {alignments} from "./data/alignments";
    import {classes} from "./data/classes";
    import {kits} from "./data/kits";
    import {eas} from "./data/eas";
    import {proficiencies} from "./data/proficiencies";

    export let version;

    let fileinput
    let submitButton
    let filename
    let isReady = false
    let isLoading = false
    let hexEditor
    let activeTab = 0
    let currentCharIdx = 0
    let downloadLink

    onMount(async () => {
        const file = localStorage.getItem('file')
        if (file === null) {
            return
        }

        isLoading = true

        const uint8array = JSON.parse(file);
        hexEditor = new GamV20HexEditor(uint8array);

        if (hexEditor.isValidGamFile) {
            filename = localStorage.getItem('filename')
            if (null !== localStorage.getItem('activeTab')) {
                activeTab = parseInt(localStorage.getItem('activeTab'), 10)
            }
            if (null !== localStorage.getItem('current_character')) {
                currentCharIdx = parseInt(localStorage.getItem('current_character'), 10)
            }

            isReady = true
        } else {
            localStorage.removeItem('file');
            localStorage.removeItem('filename')
            localStorage.removeItem('current_character')

            isReady = false
        }
        isLoading = false
    });

    const onFileSelected = (e) => {
        if (!e.target.files || !e.target.files[0]) { // No file selected
            isReady = hexEditor && hexEditor.isValidGamFile // Check if we still have a valid file loaded
            return
        }

        isReady = false
        isLoading = true

        const inputFileName = e.target.files[0].name

        const reader = new FileReader()
        reader.readAsArrayBuffer(e.target.files[0])

        reader.onload = e => {
            let res = [];
            // noinspection JSCheckFunctionSignatures
            let uint8array = new Uint8Array(e.target.result);
            for (let i in uint8array) {
                res.push((0 + uint8array[i].toString(16)).slice(-2));
            }

            hexEditor = new GamV20HexEditor(uint8array);
            if (hexEditor.isValidGamFile) {
                localStorage.setItem('file', JSON.stringify(res))
                localStorage.setItem('filename', inputFileName)

                currentCharIdx = 0
                localStorage.setItem('current_character', currentCharIdx)

                filename = inputFileName

                isReady = true
            } else {
                localStorage.removeItem('file')
                localStorage.removeItem('filename')
                localStorage.removeItem('current_character')

                isReady = false
            }
            isLoading = false
        }
    }

    const getPcPortraitUrl = (characterIdx) => {
        const mediumPortrait = hexEditor?.readField('mediumPortrait', characterIdx);
        if (!portraits.includes(mediumPortrait)) {
            return '/portraits/UNKOWNM.png';
        }
        return '/portraits/' + mediumPortrait + '.png';
    }

    const onTabClick = (tabIdx) => {
        activeTab = tabIdx
        localStorage.setItem('activeTab', tabIdx)
    }

    const getCharacterName = (characterIdx) => {
        if (characterIdx === 0) {
            return hexEditor?.readField('name', characterIdx)
        }
        return hexEditor?.readField('nonPcCharsName', characterIdx)
    }

    const switchCharacter = (e) => {
        currentCharIdx = parseInt(e.target.value, 10)
        localStorage.setItem('current_character', currentCharIdx)
    }

    const saveChanges = (e) => {
        const formData = new FormData(e.target)
        for (const [fieldName, fieldValue] of formData.entries()) {
            const [fieldName2, characterIdx] = fieldName.split('_')
            const [fieldId, proficiencyIdx] = fieldName2.split('-')
            hexEditor.writeField(fieldValue, fieldId, parseInt(characterIdx, 10), parseInt(proficiencyIdx, 10))
        }
        const blob = new Blob([hexEditor.exportAsInt8Array()], {type: 'application/octet-stream'});

        downloadLink.download = filename
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.click()
    }
</script>

<main>
    <a href="#download" style="display: none;" download bind:this={downloadLink}>Download</a>
    <div class="window-container" style="">
        <div class="window outer-window">
            <div class="title-bar">
                <div class="title-bar-text"><span class="logo"></span> JSEE Keeper - Version {version}</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close"></button>
                </div>
            </div>
            <div class="toolbar">
                <button disabled>File</button>
                <button disabled>Edit</button>
                <button disabled>View</button>
                <button disabled>Tools</button>
                <button disabled>Settings</button>
                <button disabled>Window</button>
                <button disabled>Help</button>
            </div>
            <div class="toolbar-separator"></div>
            <div class="toolbar icons-toolbar">
                <input style="display: none;" type="file" accept=".gam" on:change={(e) => onFileSelected(e)} bind:this={fileinput}>
                <button id="file-button" class="open-button" on:click={() => {fileinput?.click()}}></button>
                <button class="save-button" on:click={() => {submitButton?.click()}}></button>
            </div>
            <div class="window-body">
                <div class="outer-inner-window-container inner-window-container">
                    {#if isReady}
                        <div class="window inner-window">
                            <div class="title-bar">
                                <div class="title-bar-text"><span class="logo"></span> {filename}</div>
                                <div class="title-bar-controls">
                                    <button aria-label="Minimize"></button>
                                    <button aria-label="Maximize"></button>
                                    <button aria-label="Close"></button>
                                </div>
                            </div>
                            <div class="window-body">
                                <div class="inner-window-container inner-inner-window-container">
                                    <form action="#" on:submit|preventDefault={saveChanges}>
                                    <div class="character-window">
                                        <div class="portrait-column">
                                            <div class="field-row character-name-row">
                                                {#each Array(hexEditor?.readField('partyMembersStructCount')).fill(null).map((_, i) => i) as idx}
                                                    <input class:hidden={currentCharIdx !== idx} id={`name_${idx}`} name={`name_${idx}`} disabled type="text" value="{getCharacterName(idx)}"/>
                                                {/each}
                                            </div>
                                            {#each Array(hexEditor?.readField('partyMembersStructCount')).fill(null).map((_, i) => i) as idx}
                                                <div class:hidden={currentCharIdx !== idx} class="portrait" style={`background-image: url("${getPcPortraitUrl(idx)}");`}></div>
                                            {/each}
                                            <button class="change-portrait" disabled>Change Portrait</button>
                                            <div class="field-row character-selector-row">
                                                <input id="character-selector" class="has-box-indicator"
                                                       type="range" min="0" step="1"
                                                       max="{hexEditor?.readField('partyMembersStructCount') - 1}"
                                                       on:change={e => switchCharacter(e)}
                                                       class:disabled={hexEditor?.readField('partyMembersStructCount') < 2}
                                                       value="{currentCharIdx}" />
                                            </div>
                                        </div>
                                        {#each Array(hexEditor?.readField('partyMembersStructCount')).fill(null).map((_, i) => i) as idx}
                                            <div class="tabs-column" class:hidden={currentCharIdx !== idx}>
                                                <div class="tabs">
                                                    <div class="tab" class:active={activeTab === 0} on:click={() => onTabClick(0)}><u>A</u>bilities</div>
                                                    <div class="tab" class:active={activeTab === 1} on:click={() => onTabClick(1)}>Characteristics</div>
                                                    <div class="tab" class:active={activeTab === 2} on:click={() => onTabClick(2)}>Resistances</div>
                                                    <div class="tab" class:active={activeTab === 3} on:click={() => onTabClick(3)}>Proficiencies</div>
                                                </div>
                                                <div class="tab-contents">
                                                    <div class="tab-content" class:active={activeTab === 0}>
                                                        <div class="abilities-column">
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`strength_${idx}`}>Strength</label>
                                                                    <input id={`strength_${idx}`} name={`strength_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('strength',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`constitution_${idx}`}>Constitution</label>
                                                                    <input id={`constitution_${idx}`} name={`constitution_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('constitution',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`charisma_${idx}`}>Charisma</label>
                                                                    <input id={`charisma_${idx}`} name={`charisma_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('charisma',idx)}" />
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`strengthBonus_${idx}`}>Strength +</label>
                                                                    <input id={`strengthBonus_${idx}`} name={`strengthBonus_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('strengthBonus',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`intelligence_${idx}`}>Intelligence</label>
                                                                    <input id={`intelligence_${idx}`} name={`intelligence_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('intelligence',idx)}" />
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`dexterity_${idx}`}>Dexterity</label>
                                                                    <input id={`dexterity_${idx}`} name={`dexterity_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('dexterity',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`wisdom_${idx}`}>Wisdom</label>
                                                                    <input id={`wisdom_${idx}`} name={`wisdom_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('wisdom',idx)}" />
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row-separator"></div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`maxHitPoints_${idx}`}>Base HP</label>
                                                                    <input id={`maxHitPoints_${idx}`} name={`maxHitPoints_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('maxHitPoints',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`attacksPerRound_${idx}`}>Attacks</label>
                                                                    <input id={`attacksPerRound_${idx}`} name={`attacksPerRound_${idx}`} class="long-input" type="text" value="{hexEditor?.readField('attacksPerRound',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`fatigue_${idx}`}>Fatigue</label>
                                                                    <input id={`fatigue_${idx}`} name={`fatigue_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('fatigue',idx)}" />
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`currentHitPoints_${idx}`}>Current HP</label>
                                                                    <input id={`currentHitPoints_${idx}`} name={`currentHitPoints_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('currentHitPoints',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`experiencePoints_${idx}`}>Experience</label>
                                                                    <input id={`experiencePoints_${idx}`} name={`experiencePoints_${idx}`} class="long-input" type="text" value="{hexEditor?.readField('experiencePoints',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`intoxication_${idx}`}>Intoxication</label>
                                                                    <input id={`intoxication_${idx}`} name={`intoxication_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('intoxication',idx)}" />
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`acNatural_${idx}`}>Base AC</label>
                                                                    <input id={`acNatural_${idx}`} name={`acNatural_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('acNatural',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`experienceForKill_${idx}`}>Exp for kill</label>
                                                                    <input id={`experienceForKill_${idx}`} name={`experienceForKill_${idx}`} class="long-input" type="text" value="{hexEditor?.readField('experienceForKill',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`morale_${idx}`}>Morale</label>
                                                                    <input id={`morale_${idx}`} name={`morale_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('morale',idx)}" />
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`acEffective_${idx}`}>Effective AC</label>
                                                                    <input id={`acEffective_${idx}`} name={`acEffective_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('acEffective',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`level1_${idx}`}>Levels</label>
                                                                    <input id={`level1_${idx}`} name={`level1_${idx}`} class="shorter-input" type="text" value="{hexEditor?.readField('level1',idx)}" />
                                                                    <input id={`level2_${idx}`} name={`level2_${idx}`} class="shorter-input" type="text" value="{hexEditor?.readField('level2',idx)}" />
                                                                    <input id={`level3_${idx}`} name={`level3_${idx}`} class="shorter-input" type="text" value="{hexEditor?.readField('level3',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`moraleBreak_${idx}`}>Morale Break</label>
                                                                    <input id={`moraleBreak_${idx}`} name={`moraleBreak_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('moraleBreak',idx)}" />
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`thac0_${idx}`}>THAC0</label>
                                                                    <input id={`thac0_${idx}`} name={`thac0_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('thac0',idx)}" />
                                                                </div>
                                                                <!--<div class="field-row">-->
                                                                <!--    <label for={`goldCarried_${idx}`}>Gold</label>-->
                                                                <!--    <input id={`goldCarried_${idx}`} name={`goldCarried_${idx}`} class="long-input" type="text" value="{hexEditor?.readCreField('goldCarried', idx)}" />-->
                                                                <!--</div>-->
                                                                <div class="field-row">
                                                                    <label for={`partyGold_${idx}`}>Gold</label>
                                                                    <input id={`partyGold_${idx}`} name={`partyGold_${idx}`} class="long-input" type="text" value="{hexEditor?.readField('partyGold')}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`moraleRecoveryTime_${idx}`}>Morale Recovery</label>
                                                                    <input id={`moraleRecoveryTime_${idx}`} name={`moraleRecoveryTime_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('moraleRecoveryTime',idx)}" />
                                                                </div>
                                                            </div>
                                                            <!--<div class="abilities-row">-->
                                                            <!--    <div class="field-row">-->
                                                            <!--        <label for={`reputation_${idx}`}>Reputation</label>-->
                                                            <!--        <input id={`reputation_${idx}`} name={`reputation_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('reputation', idx)}" />-->
                                                            <!--    </div>-->
                                                            <!--</div>-->
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`partyReputation_${idx}`}>Reputation</label>
                                                                    <input id={`partyReputation_${idx}`} name={`partyReputation_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('partyReputation')}" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="thieves-column">
                                                            <fieldset>
                                                                <legend>Thief Skills</legend>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`moveSilently_${idx}`}>Move Silently</label>
                                                                    <input id={`moveSilently_${idx}`} name={`moveSilently_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('moveSilently', idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`hideInShadows_${idx}`}>Hide in Shadows</label>
                                                                    <input id={`hideInShadows_${idx}`} name={`hideInShadows_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('hideInShadows', idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`lockpicking_${idx}`}>Open Locks</label>
                                                                    <input id={`lockpicking_${idx}`} name={`lockpicking_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('lockpicking', idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`pickPockets_${idx}`}>Pick Pockets</label>
                                                                    <input id={`pickPockets_${idx}`} name={`pickPockets_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('pickPockets', idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`findDisarmTraps_${idx}`}>Find Traps</label>
                                                                    <input id={`findDisarmTraps_${idx}`} name={`findDisarmTraps_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('findDisarmTraps', idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`setTraps_${idx}`}>Set Traps</label>
                                                                    <input id={`setTraps_${idx}`} name={`setTraps_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('setTraps', idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`detectIllusion_${idx}`}>Detect Illusions</label>
                                                                    <input id={`detectIllusion_${idx}`} name={`detectIllusion_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('detectIllusion', idx)}" />
                                                                </div>
                                                            </fieldset>
                                                        </div>
                                                    </div>
                                                    <div class="tab-content" class:active={activeTab === 1}>
                                                        <div class="characteristics-column">
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`gender_${idx}`}>Gender</label>
                                                                    <select id={`gender_${idx}`} name={`gender_${idx}`} value={hexEditor?.readField('gender',idx).toString()}>
                                                                        <option value=""></option>
                                                                        {#each Object.entries(genders) as [key, label]}
                                                                            <option value={key}>{label}</option>
                                                                        {/each}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`race_${idx}`}>Race</label>
                                                                    <select id={`race_${idx}`} name={`race_${idx}`} value={hexEditor?.readField('race',idx).toString()}>
                                                                        <option value=""></option>
                                                                        {#each Object.entries(races) as [key, label]}
                                                                            <option value="{key}">{label}</option>
                                                                        {/each}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`alignment_${idx}`}>Alignment</label>
                                                                    <select id={`alignment_${idx}`} name={`alignment_${idx}`} value={hexEditor?.readField('alignment',idx).toString()}>
                                                                        <option value=""></option>
                                                                        {#each Object.entries(alignments) as [key, label]}
                                                                            <option value="{key}">{label}</option>
                                                                        {/each}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`class_${idx}`}>Class</label>
                                                                    <select id={`class_${idx}`} name={`class_${idx}`} value={hexEditor?.readField('class',idx).toString()}>
                                                                        <option value=""></option>
                                                                        {#each Object.entries(classes) as [key, label]}
                                                                            <option value="{key}">{label}</option>
                                                                        {/each}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <!-- TODO Original class -->
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`kit_${idx}`}>Kit</label>
                                                                    <select id={`kit_${idx}`} name={`kit_${idx}`} value={hexEditor?.readField('kit',idx).toString()}>
                                                                        <option value=""></option>
                                                                        {#each Object.entries(kits) as [key, label]}
                                                                            <option value="{key}">{label}</option>
                                                                        {/each}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`racialEnemy_${idx}`}>Racial Enemy</label>
                                                                    <select id={`racialEnemy_${idx}`} name={`racialEnemy_${idx}`} value={hexEditor?.readField('racialEnemy',idx).toString()}>
                                                                        <option value=""></option>
                                                                        {#each Object.entries(races) as [key, label]}
                                                                            <option value="{key}">{label}</option>
                                                                        {/each}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`enemyAlly_${idx}`}>Enemy/Ally</label>
                                                                    <select id={`enemyAlly_${idx}`} name={`enemyAlly_${idx}`} value={hexEditor?.readField('enemyAlly',idx).toString()}>
                                                                        <option value=""></option>
                                                                        {#each Object.entries(eas) as [key, label]}
                                                                            <option value="{key}">{label}</option>
                                                                        {/each}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div class="abilities-row">
                                                                <div class="field-row">
                                                                    <label for={`movementSpeed_${idx}`}>Movement Speed</label>
                                                                    <!-- TODO -->
                                                                    <input id={`movementSpeed_${idx}`} name={`movementSpeed_${idx}`} disabled class="short-input" type="text" value="" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="stats-column">
                                                            <fieldset>
                                                                <legend>Kill Stats</legend>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`strongestKillName_${idx}`}>Strongest Kill</label>
                                                                    <!-- TODO hexEditor?.readCharacterStatField(idx, 'strongestKillName') -->
                                                                    <input disabled id={`strongestKillName_${idx}`} name={`strongestKillName_${idx}`} class="long-input" type="text" value="" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`strongestKillXP_${idx}`}>Strongest Kill XP</label>
                                                                    <input id={`strongestKillXP_${idx}`} name={`strongestKillXP_${idx}`} class="long-input" type="text" value="{hexEditor?.readField('strongestKillXP',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`chapterKillsCount_${idx}`}>Chapter Kills</label>
                                                                    <input id={`chapterKillsCount_${idx}`} name={`chapterKillsCount_${idx}`} class="long-input" type="text" value="{hexEditor?.readField('chapterKillsCount',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`chapterKillsXP_${idx}`}>Chapter Kills XP</label>
                                                                    <input id={`chapterKillsXP_${idx}`} name={`chapterKillsXP_${idx}`} class="long-input" type="text" value="{hexEditor?.readField('chapterKillsXP',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`gameKillsCount_${idx}`}>Game Kills</label>
                                                                    <input id={`gameKillsCount_${idx}`} name={`gameKillsCount_${idx}`} class="long-input" type="text" value="{hexEditor?.readField('gameKillsCount',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label class="long-label" for={`gameKillsXP_${idx}`}>Game Kills XP</label>
                                                                    <input id={`gameKillsXP_${idx}`} name={`gameKillsXP_${idx}`} class="long-input" type="text" value="{hexEditor?.readField('gameKillsXP',idx)}" />
                                                                </div>
                                                            </fieldset>
                                                        </div>
                                                    </div>
                                                    <div class="tab-content" class:active={activeTab === 2}>
                                                        <div class="resistances-column">
                                                            <fieldset>
                                                                <legend>Resistances</legend>
                                                                <div class="field-row">
                                                                    <label for={`resistAcid_${idx}`}>Acid</label>
                                                                    <input id={`resistAcid_${idx}`} name={`resistAcid_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('resistAcid',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`resistSlashing_${idx}`}>Slashing</label>
                                                                    <input id={`resistSlashing_${idx}`} name={`resistSlashing_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('resistSlashing',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`resistCold_${idx}`}>Cold</label>
                                                                    <input id={`resistCold_${idx}`} name={`resistCold_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('resistCold',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`resistMissile_${idx}`}>Missile</label>
                                                                    <input id={`resistMissile_${idx}`} name={`resistMissile_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('resistMissile',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`resistElectricity_${idx}`}>Electricity</label>
                                                                    <input id={`resistElectricity_${idx}`} name={`resistElectricity_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('resistElectricity',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`resistMagic_${idx}`}>Magic</label>
                                                                    <input id={`resistMagic_${idx}`} name={`resistMagic_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('resistMagic',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`resistFire_${idx}`}>Fire</label>
                                                                    <input id={`resistFire_${idx}`} name={`resistFire_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('resistFire',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`resistMagicFire_${idx}`}>Magic Fire</label>
                                                                    <input id={`resistMagicFire_${idx}`} name={`resistMagicFire_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('resistMagicFire',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`resistCrushing_${idx}`}>Crushing</label>
                                                                    <input id={`resistCrushing_${idx}`} name={`resistCrushing_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('resistCrushing',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`resistMagicCold_${idx}`}>Magic Cold</label>
                                                                    <input id={`resistMagicCold_${idx}`} name={`resistMagicCold_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('resistMagicCold',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`resistPiercing_${idx}`}>Piercing</label>
                                                                    <input id={`resistPiercing_${idx}`} name={`resistPiercing_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('resistPiercing',idx)}" />
                                                                </div>
                                                            </fieldset>
                                                        </div>
                                                        <div class="saving-throws-column">
                                                            <fieldset>
                                                                <legend>Saving Throws</legend>
                                                                <div class="field-row">
                                                                    <label for={`saveVsDeath_${idx}`}>Paralyzation, Poison, Death</label>
                                                                    <input id={`saveVsDeath_${idx}`} name={`saveVsDeath_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('saveVsDeath',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`saveVsWands_${idx}`}>Rod, Staff, Wand</label>
                                                                    <input id={`saveVsWands_${idx}`} name={`saveVsWands_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('saveVsWands',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`saveVsPolymorph_${idx}`}>Petrification, Polymorph</label>
                                                                    <input id={`saveVsPolymorph_${idx}`} name={`saveVsPolymorph_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('saveVsPolymorph',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`saveVsBreath_${idx}`}>Breath Weapons</label>
                                                                    <input id={`saveVsBreath_${idx}`} name={`saveVsBreath_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('saveVsBreath',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`saveVsSpells_${idx}`}>Spells</label>
                                                                    <input id={`saveVsSpells_${idx}`} name={`saveVsSpells_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('saveVsSpells',idx)}" />
                                                                </div>
                                                            </fieldset>
                                                        </div>
                                                        <div class="armour-class-column">
                                                            <fieldset>
                                                                <legend>Armour Class Modifiers</legend>
                                                                <div class="field-row">
                                                                    <label for={`acSlashing_${idx}`}>Slashing</label>
                                                                    <input id={`acSlashing_${idx}`} name={`acSlashing_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('acSlashing',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`acMissile_${idx}`}>Missile</label>
                                                                    <input id={`acMissile_${idx}`} name={`acMissile_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('acMissile',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`acCrushing_${idx}`}>Crushing</label>
                                                                    <input id={`acCrushing_${idx}`} name={`acCrushing_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('acCrushing',idx)}" />
                                                                </div>
                                                                <div class="field-row">
                                                                    <label for={`acPiercing_${idx}`}>Piercing</label>
                                                                    <input id={`acPiercing_${idx}`} name={`acPiercing_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('acPiercing',idx)}" />
                                                                </div>
                                                            </fieldset>
                                                        </div>
                                                    </div>
                                                    <div class="tab-content" class:active={activeTab === 3}>
                                                        <div class="weapons-proficiencies-column">
                                                            {#each Array(hexEditor?.getCharacterProficienciesCount(idx)).fill(null).map((_, i) => i) as pIdx}
                                                                <div class="field-row">
                                                                    <label for={`weaponProficiency-${pIdx}_${idx}`}>{proficiencies[hexEditor?.readField('proficiencyType', idx, pIdx)]}</label>
                                                                    <input id={`weaponProficiency-${pIdx}_${idx}`} name={`weaponProficiency-${pIdx}_${idx}`} class="short-input" type="text" value="{hexEditor?.readField('weaponProficiency', idx, pIdx)}"/>
                                                                </div>
                                                            {/each}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                    <button style="display: none;" type="submit" bind:this={submitButton}></button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
            <div class="status-bar">
                <div class="status">
                    {#if isLoading}Loading...{:else if isReady}Ready{:else}&nbsp;{/if}
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .title-bar {
        position: relative;
    }

    .title-bar-text {
        padding-left: 22px;
    }

    .window-container {
        width: 100%;
        text-align: center;
    }

    .logo {
        display: inline-block;
        height: 20px;
        width: 20px;
        background-image: url('/favicon.png');
        background-position: center center;
        background-size: 20px 20px;
        position: absolute;
        top: 0;
        left: 2px;
    }

    .outer-window {
        width: 800px;
        height: 626px;
        display: inline-block;
    }

    .toolbar {
        text-align: left;
        padding-left: 4px;
    }

    .window-body {
        margin: 0;
    }

    .toolbar > button {
        display: inline-block;
        padding: 0 5px;
        box-shadow: none;
        min-width: unset;
    }

    .inner-window-container {
        box-shadow: inset -1px -1px #fff, inset 1px 1px grey, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a;
        display: block;
        margin: 0;
        padding: 2px 2px;
    }

    .outer-inner-window-container {
        background: #808080;
        height: 532px;
        text-align: left;
    }

    .inner-window {
        width: 770px;
        height: 330px;
        display: inline-block;
    }

    .inner-inner-window-container {
        height: 306px;
    }

    .status {
        min-height: 23px;
        line-height: 23px;
        padding-left: 4px;
    }

    .character-window {
        padding-top: 8px;
        padding-left: 8px;
    }

    .portrait-column {
        width: 110px;
        display: block;
        float: left;
    }

    .tabs-column {
        display: block;
        float: left;
        height: 270px;
        margin-left: 8px;
        width: 630px;
    }

    .portrait {
        width: 110px;
        height: 173px;
        margin: 2px 0;
        box-shadow: inset -1px -1px #fff, inset 1px 1px grey, inset -1px -1px #dfdfdf, inset 1px 1px #0a0a0a;
        background-size: cover;
    }

    .character-name-row input {
        width: 110px;
    }

    .change-portrait {
        width: 100%;
    }

    .shorter-input {
        width: 32px;
    }

    input[name^=level2], input[name^=level3] {
        margin-left: 1px;
    }

    .short-input {
        width: 38px;
    }

    .long-input {
        width: 98px;
    }

    .abilities-row-separator {
        width: 100%;
        border: 1px solid black;
        margin-top: 6px;
    }

    .tabs {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: flex-start;
        justify-content: flex-start;
        align-items: flex-end;
    }

    .tab-contents {
        margin-top: -4px;
        box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;
        background-color: silver;
        height: 264px;
    }

    .tab {
        position: relative;
        display: inline-block;
        padding: 5px 8px 7px 8px;
        box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;
        border-radius: 3px 2px 0 0;
        background-color: silver;
        clip-path: inset(0 0 2px 0);
        cursor: default;
        height: 10px;
        margin-left: -2px;
        margin-bottom: 2px;
    }

    .tab:first-child {
        margin-left: 0;
    }

    .tab.active {
        height: 14px;
        margin-bottom: 0;
        z-index: 1;
    }

    .tab-content {
        display: none;
        width: 100%;
        height: 100%;
    }

    .tab-content.active {
        display: block;
    }

    .abilities-column {
        display: block;
        float: left;
        padding: 4px 12px 0 12px;
    }

    .thieves-column {
        display: block;
        float: left;
        padding: 10px 0;
        width: 172px;
    }

    .resistances-column {
        display: block;
        float: left;
        width: 250px;
        padding: 10px 0 0 12px;
    }

    .resistances-column .field-row {
        margin-left: 4px;
    }

    .resistances-column input {
        margin-right: 6px;
    }

    .saving-throws-column {
        display: block;
        float: left;
        width: 205px;
        padding: 10px 0 0 7px;
    }

    .saving-throws-column .field-row {
        margin-left: 4px;
    }

    .saving-throws-column label {
        width: 130px;
    }

    .armour-class-column {
        display: block;
        float: left;
        width: 135px;
        padding: 10px 0 0 7px;
    }

    .weapons-proficiencies-column {
        display: block;
        float: left;
        width: 400px;
        padding: 10px 0 0 12px;
    }

    .weapons-proficiencies-column label {
        width: 125px;
    }

    .weapons-proficiencies-column input {
        margin-right: 15px;
    }

    label {
        min-width: 60px;
    }

    .long-label {
        min-width: 80px;
    }

    .tab-content .field-row {
        display: inline-flex;
        margin-top: 6px;
    }

    .tab-content > .thieves-column .field-row,
    .tab-content > .stats-column .field-row {
        margin-left: 4px;
    }

    .abilities-row div:nth-child(2),
    .abilities-row div:nth-child(3) {
        margin-left: 12px;
    }

    .characteristics-column {
        display: block;
        float: left;
        padding: 4px 12px 0 12px;
    }

    .stats-column {
        display: block;
        float: left;
        padding: 10px 0;
        width: 247px;
    }

    .characteristics-column label {
        min-width: 83px;
    }

    .characteristics-column select {
        min-width: 172px;
    }

    select:focus {
        color: black;
        background-color: white;
    }

    .character-selector-row {
        width: 110px;
        margin-top: 12px;
    }

    #character-selector.disabled {
        opacity: 0.5;
    }

    .toolbar-separator {
        box-shadow: inset -1px -1px #fff, inset 0 1px grey, inset 1px -2px grey, inset 2px 2px #fff;
        clip-path: inset(0 2px 2px 2px);
        height: 5px;
    }

    .icons-toolbar {
        height: 21px;
    }

    .icons-toolbar button {
        margin-right: 2px;
    }

    .open-button {
        display: inline-block !important;
        float: left;
        height: 24px;
        width: 23px;
        padding: 0 !important;
        background-image: url(/open.png);
        background-position: center center;
        background-size: contain;
        margin-top: -3px;
    }

    .save-button {
        display: inline-block !important;
        float: left;
        height: 24px;
        width: 23px;
        padding: 0 !important;
        background-image: url(/save.png);
        background-position: center center;
        background-size: contain;
        margin-top: -3px;
    }

    .hidden {
        display: none;
        visibility: hidden;
        height: 0;
        width: 0;
    }

    .character-name-row input {
        margin-left: 0;
    }
</style>
