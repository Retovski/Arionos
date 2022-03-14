//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Core.js            (Required by all OcRam MZ -plugins)
//=============================================================================

"use strict"; var Imported = Imported || {};
Imported.OcRam_Core = true; let $temp_OcRam_Core_Ver = "1.06";
// This is for my webparser // OcRam.addPlugin("Core", "1.06");

/*:
 * @target MZ
 * @plugindesc v1.06 Core plugin for other OcRam RPG Maker MZ -plugins.
 * @author OcRam
 * @url https://ocram-codes.net
 *
 * @param Show BGS2/3 Volume
 * @desc true = Shown in options menu, false = Linked to main BGS
 * @type boolean
 * @default true
 *
 * @param BGS2/3 Option Caption
 * @parent Show BGS2/3 Volume
 * @desc Caption for BGS2 and BGS3 shown in options menu
 * @type text
 * @default Weather Volume
 *
 * @param Merge ME/BGM Volume
 * @desc Merge ME Volume to BGM Volume option?
 * @type boolean
 * @default true
 * 
 * @param Enable D-pads
 * @type boolean
 * @desc Enable D-pad on gamepads where available.
 * @default true
 * 
 * @param Event through fix
 * @type boolean
 * @desc Event "Through" option won't stop player movement anymore (applies only to "Player/Event touch" triggers).
 * @default true
 *
 * @param Debug mode
 * @type boolean
 * @desc Write some events to console log (F8 or F12).
 * @default false
 *
 * @help
 * ----------------------------------------------------------------------------
 * Introduction                                         (Made for RPG Maker MZ)
 * ============================================================================
 * This plugin is utilized by all OcRam RMMZ -plugins. Import this plugin 
 * before any other OcRam RMMZ -plugin 
 * 
 * OcRam_Core is FrameWork, which will offer centralized aliases for most
 * commonly used functions. This will help us to save some memory and will 
 * also free up some CPU time for other tasks!
 * 
 * This plugin adds 2 BGS channels which will play also in battles.
 * These BGS channels are intended for things like rain/storm/wind etc...
 * Extra channels are utilized by OcRam_Weather_System for example.
 * To add dynamic BGS/SE channels use OcRam_Audio -plugin.
 * 
 * ----------------------------------------------------------------------------
 * Notetags
 * ============================================================================
 * To set any tileset and/or map as "indoors" write <indoors> notetag to
 * notefield. Map notes will always override tileset notes.
 * To check if map/tileset is marked as "Indoors" use JS call:
 *     OcRam.isIndoors(); // Will return true if tag is found else false
 *
 * OcRam_Weather_System and OcRam_Time_System will utilize indoors feature
 * a lot. Indoors feature can be used also without those plugins (with 
 * OcRam.isIndoors() -JS call).
 * 
 * TIP: Use map notetag <outdoors> to override tileset <indoors> notetag.
 * 
 * ----------------------------------------------------------------------------
 * Plugin commands
 * ============================================================================
 * PlayBGS      Play BGS on desired "static" channel
 * StopBGS      Stop BGS on desired or all "static" channels
 *
 * ----------------------------------------------------------------------------
 * Usage - JavaScript (New methods / functions)
 * ============================================================================
 * OcRam.isOmitted(object) // Return true if parameter is null or undefined
 * OcRam.getBoolean(object) // Safe boolean - Force to boolean
 * OcRam.getFloat(object) // Safe float - Force to float
 * OcRam.getArray(object, default_values) // Safe array - Force to array
 * OcRam.getJSON(object) // Try to get JSON object returns null if fails
 * OcRam.getJSONArray(object) // Try to get JSON array returns [] if fails
 * OcRam.regulateRGBG(RGBG_object) // Regulate RGBG values
 * OcRam.regulateHexRGBA(RGBA_hex_string) // Regulate RGBA values
 * OcRam.isIndoors() // Returns true if tileset or map is set to <indoors>
 * OcRam.readMapNotetags() // Refresh meta tags (force to read meta tags NOW)
 * OcRam.runCE(common_event_id) // Run common event with this id
 * OcRam.scene() // Get current scene = SceneManager._scene
 * OcRam.isCurrentScene(Scene_Map) // true if current scene is Scene_Map
 * OcRam.getSpriteByEventId(event_id) // Returns character sprite by event id
 * OcRam.setSelfSwitch(event, key, value) // Set self switch by event id/name
 *
 * $gameMap.getEventsByName(event_name) // Get all events with this name
 * $gameMap.getEventById(event_id) // Get event by it's unique id
 * this.event() // Used from event page/moveroute to get this event
 * ImageManager.loadOcRamBitmap(file, hue) // Load bitmap from "./img/ocram"
 * Game_Event.getComments() // Return {comment, commandIndex} as Array
 * Game_Event.getStringComments() // Return comments as Array of String
 * Game_Event.isPlayerInRadius(radius) // Is player in radius of given range?
 * 
 * ['Hello', 'World'].toLowerCase() // Convert all items to UPPER CASE
 * ['Hello', 'World'].toLowerCase() // Convert all items to lower case
 * ['Hello', 'World'].remove('World') // Remove desired item from array
 * 'Hello World'.width('12px Arial') // Returns width of the text in pixels
 * '<tag>test</tag>'.getClosedTags(tag) // returns ['test']
 * '<tag:1:2>'.getOpenTags(tag) // returns ['1:2']
 * 'Hello'.left(2) // Returns 'He'
 * 'Hello'.right(2) // Returns 'lo'
 * 'Hello World'.replaceAll('o', 'a') // Returns 'Hella Warld'
 * Math.randomBetween(min, max) // Random integer between given range
 * Math.setSeed(seed) // Seed RNG generator (for seeded randoms)
 * Math.random$() // Give SEEDED random 0 to 1 (Example: 0.65433241...)
 * Math.randomBetween$(min, max) // SEEDED random int between given range
 * 
 * bgs_obj = {name: 'bgs_name', volume: 90, pitch: 100, pan: 0, pos: 0}
 * AudioManager.playBgs2({bgs_obj}, pos) // Play BGS on channel 2
 * AudioManager.stopBgs2() // Stop BGS on channel 2
 * AudioManager.fadeInBgs2(duration) // Fade in BGS on channel 2
 * AudioManager.fadeOutBgs2(duration) // Fade out BGS on channel 2
 * AudioManager.playBgs3({bgs_obj}, pos) // Play BGS on channel 3
 * AudioManager.stopBgs3() // Stop BGS on channel 3
 * AudioManager.fadeInBgs3(duration) // Fade in BGS on channel 3
 * AudioManager.fadeOutBgs3(duration) // Fade out BGS on channel 3
 * 
 * ----------------------------------------------------------------------------
 * Terms of Use
 * ============================================================================
 * Edits are allowed as long as "Terms of Use" is not changed in any way.
 * Exception: Obfuscating and/or minifying JS, where ALL comments are removed
 * (incluging these "Terms of Use"), is allowed (won't change ToU).
 *
 * NON-COMMERCIAL & COMMERCIAL USE: Free to use with credits to 'OcRam'
 * 
 * OcRam -plugins available at https://ocram-codes.net/plugins.aspx?engine=mz
 * 
 * DO NOT COPY, RESELL OR CLAIM ANY PIECE OF THIS PLUGIN AS YOUR OWN!
 * Copyright (c) 2020, Marko Paakkunainen // mmp_81 (at) hotmail.com
 *
 * ----------------------------------------------------------------------------
 * Version History
 * ============================================================================
 * 2020/09/03 v1.00 - Initial release
 * 2020/09/05 v1.01 - <indoors> tag is now working (Credits to blade911)
 * 2020/09/19 v1.02 - New alias to detect autosaves + JS call OcRam.isOmitted
 * 2020/09/20 v1.03 - String.getOpenTags() bug fixed!
 * 2020/09/27 v1.04 - String.width() prototype added!
 *                    OcRam.getSpriteByEventId(event_id) added!
 * 2020/10/10 v1.05 - Array.remove -polyfill bug fixed (Credits to Kneeshaw)
 * 2020/10/25 v1.06 - Possibility to enable D-pad on gamepads!
 *                    OcRam.setSelfSwitch(event, key, value);
 *                    New plugin parameter "Event through fix"
 * 
 * ----------------------------------------------------------------------------
 * Overrides (destructive declarations) are listed here
 * ============================================================================
 * ConfigManager.bgsVolume (IF "Show BGS2/3 Volume" is off/false)
 * Window_Options.addVolumeOptions (IF "Merge ME/BGM Volume" is on/true)
 * Input._updateGamepadState (IF D-pads is enabled)
 * 
 * @command playBGS
 * @text Play BGS
 * @desc Play BGS on desired channel.
 * 
 * @arg channel
 * @type number
 * @min 1
 * @max 3
 * @default 1
 * @text Channel
 * @desc Play BGS playing on this channel.
 * 
 * @arg name
 * @type file
 * @dir audio/bgs
 * @default 
 * @text BGS Name
 * @desc Name of the BGS file.
 *
 * @arg volume
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * @text Volume
 * @desc Volume of this BGS.
 * 
 * @arg pitch
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * @text Pitch
 * @desc Pitch of this BGS.
 * 
 * @arg pan
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * @text Pan
 * @desc Pan of this BGS.
 * 
 * @arg fadeIn
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * @text Fade in
 * @desc Fade in time in seconds.
 * 
 * @command stopBGS
 * @text Stop BGS
 * @desc Stop BGS on desired channel. 0 = All channels.
 * 
 * @arg channel
 * @type number
 * @min 0
 * @max 3
 * @default 0
 * @text Channel
 * @desc Stop BGS playing on this channel. 0 = All channels.
 * 
 * @arg fadeOut
 * @type number
 * @min 0
 * @max 100
 * @default 0
 * @text Fade out
 * @desc Fade out time in seconds.
 */

// ----------------------------------------------------------------------------
// New JS Generic protypes and global name space
// ============================================================================

var VisuMZ = VisuMZ || {}; // In case there's no VisuMZ plugins in use

// ----------------------------------------------------------------------------
// CanvasRenderingContext2D object prototype (line, radialGradient?)
// ============================================================================
(function () {

    // Pre-calculate for faster processing...
    const _pi = Math.PI; const _pi2 = _pi / 180;

    /**
     * Draw line to canvas context
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     */
    this.prototype.line = function (x1, y1, x2, y2) {
        this.beginPath(); this.moveTo(x1, y1); this.lineTo(x2, y2); this.stroke();
    };

    /**
    * Draw radialGradient to canvas context
    * @param {Number} x1 X pos
    * @param {Number} y1 Y pos
    * @param {Number} r1 Radius
    * @param {Number} c Color as RGBA
    */
    this.prototype.radialGradient = function (x1, y1, r1, c) {
        let grd = this.createRadialGradient(x1, y1, 0, x1, y1, r1);
        grd.addColorStop(0, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')');
        grd.addColorStop(1, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0)');
        this.fillStyle = grd; this.fillRect(x1 - r1, y1 - r1, r1 * 2, r1 * 2);
    };

    /**
    * Draw radialCone to canvas context
    * @param {Number} x1 X pos
    * @param {Number} y1 Y pos
    * @param {Number} r1 Radius
    * @param {Number} c Color as RGBA
    * @param {Number} angle Angle
    * @param {Number} deg Degrees
    * @param {Number} start_at Start gradient at pos
    */
    this.prototype.radialCone = function (x1, y1, r1, c, angle, deg, start_at) {

        const deg50 = parseInt(deg * 0.5);

        let grd = this.createRadialGradient(x1, y1, 0, x1, y1, r1);
        if (start_at != 0) {
            grd.addColorStop(0, 'transparent');
            grd.addColorStop(start_at, 'transparent');
            grd.addColorStop(start_at, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')');
            grd.addColorStop(1, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0)');
        } else {
            grd.addColorStop(0, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')');
            grd.addColorStop(1, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0)');
        }

        this.fillStyle = grd; this.beginPath(); this.moveTo(x1, y1); // Center

        if (deg >= 180) { // Irregular Hexagon
            let x = x1 + r1 * Math.cos(-(angle - deg50) * _pi2) * 3;
            let y = y1 + r1 * Math.sin(-(angle - deg50) * _pi2) * 3;
            this.lineTo(parseInt(x), parseInt(y));
            x = x1 + r1 * Math.cos(-(angle - deg50 * 0.5) * _pi2) * 3;
            y = y1 + r1 * Math.sin(-(angle - deg50 * 0.5) * _pi2) * 3;
            this.lineTo(parseInt(x), parseInt(y));
            x = x1 + r1 * Math.cos(-(angle) * _pi2) * 3;
            y = y1 + r1 * Math.sin(-(angle) * _pi2) * 3;
            this.lineTo(parseInt(x), parseInt(y));
            x = x1 + r1 * Math.cos(-(angle + deg50 * 0.5) * _pi2) * 3;
            y = y1 + r1 * Math.sin(-(angle + deg50 * 0.5) * _pi2) * 3;
            this.lineTo(parseInt(x), parseInt(y));
            x = x1 + r1 * Math.cos(-(angle + deg50) * _pi2) * 3;
            y = y1 + r1 * Math.sin(-(angle + deg50) * _pi2) * 3;
            this.lineTo(parseInt(x), parseInt(y));
        } else if (deg > 90) { // Irregular Square
            let x = x1 + r1 * Math.cos(-(angle - deg50) * _pi2) * 3;
            let y = y1 + r1 * Math.sin(-(angle - deg50) * _pi2) * 3;
            this.lineTo(parseInt(x), parseInt(y));
            x = x1 + r1 * Math.cos(-(angle) * _pi2) * 3;
            y = y1 + r1 * Math.sin(-(angle) * _pi2) * 3;
            this.lineTo(parseInt(x), parseInt(y));
            x = x1 + r1 * Math.cos(-(angle + deg50) * _pi2) * 3;
            y = y1 + r1 * Math.sin(-(angle + deg50) * _pi2) * 3;
            this.lineTo(parseInt(x), parseInt(y));
        } else { // Triangle
            let x = x1 + r1 * Math.cos(-(angle - deg50) * _pi2) * 3;
            let y = y1 + r1 * Math.sin(-(angle - deg50) * _pi2) * 3;
            this.lineTo(parseInt(x), parseInt(y));
            x = x1 + r1 * Math.cos(-(angle + deg50) * _pi2) * 3;
            y = y1 + r1 * Math.sin(-(angle + deg50) * _pi2) * 3;
            this.lineTo(parseInt(x), parseInt(y));
        } this.closePath(); this.fill();

    };

}.bind(CanvasRenderingContext2D))();

// ----------------------------------------------------------------------------
// Array object prototype
// ============================================================================
(function () {

    /** Convert array to UPPER CASE strings */
    this.prototype.toUpperCase = function () {
        for (let i = 0; i < this.length; i++) {
            this[i] = (this[i] + '').toUpperCase();
        } return this;
    };

    /** Convert array to lower case strings */
    this.prototype.toLowerCase = function () {
        for (let i = 0; i < this.length; i++) {
            this[i] = (this[i] + '').toLowerCase();
        } return this;
    };

    /** Polyfill for Array.remove() */
    if (![].remove) {
        this.prototype.remove = function (itm) {
            let i = this.indexOf(itm);
            this.splice(i, 1); return this;
        };
    }

}.bind(Array))();

// ----------------------------------------------------------------------------
// String object prototype
// ============================================================================
(function () {

    /**
     * Calculate width of desired string.
     * @param {String} font Desired font example '12px Arial'
     */
    String.prototype.width = function (font) {

        const f = font || $gameSystem.mainFontSize() + 'px ' + $gameSystem.mainFontFace();
        let o = document.createElement('div');

        o.innerText = this;
        o.style.padding = '0px';
        o.style.margin = '0px';
        o.style.position = 'absolute';
        o.style.whiteSpace = 'nowrap';
        o.style.visibility = 'hidden';
        o.style.font = f;

        document.body.appendChild(o);
        let w = o.getBoundingClientRect().width;
        o.remove();

        return w;

    };

    /**
     * Return closed tag content array. NOTE: Null char will terminate String.
     * '<tag>something</tag>'.getClosedTags('tag') returns ['something']
     * @param {String} tag Tagname to parse
     */
    this.prototype.getClosedTags = function (tag) {
        // test string: 'fdas<tag>test</tag>\n<tag>a\nb</tag>'.getClosedTags('tag');
        // should return: ['test', 'a\nb']
        const rex = new RegExp("<" + tag + ">([^\0]*?)\</" + tag + ">", "gmi");
        const matches = [...this.matchAll(rex)]; let ret = [];
        matches.forEach(m => {
            if (m.length > 1) ret.push(m[1]);
        }); return ret;
    };

    /**
     * Return open tag content array. NOTE: Null char will terminate String.
     * '<tag:2:400>'.getOpenTags('tag') returns ['2:400']
     * @param {String} tag Tagname to parse
     */
    this.prototype.getOpenTags = function (tag) {
        // test string: 'fdas<tag:2:300:131>fads<tag:2>\n<tag>a'.getOpenTags('tag');
        // should return: ['2:300:131', '2', '']
        const rex = new RegExp("\<" + tag + "[\:\>]([^\0]*?)\>", "gmi");
        const matches = [...this.matchAll(rex)];
        let ret = []; const rl = ('</' + tag).length;
        matches.forEach(m => {
            if (m.length > 1 && m[1].right(rl) != '</' + tag) ret.push(m[1]);
        }); return ret;
    };

    /**
     * Return desired amount of characters from string - starting from left.
     * @param {Number} len Amount of characters to return
     */
    this.prototype.left = function (len) {
        return this.substr(0, len);
    };

    /**
     * Return desired amount of characters from string - starting from right.
     * @param {Number} len Amount of characters to return
     */
    this.prototype.right = function (len) {
        return this.substr(this.length - len, this.length);
    };

    // Polyfill... just in case...
    if (!this.replaceAll) {
        /**
        * Replace all occurances in String
        * @param {String} search_string Text to be replaced
        * @param {String} replace_string Replace with this
        */
        this.prototype.replaceAll = function (search_string, replace_string) {
            return this.split(search_string).join(replace_string);
        };
    }

}.bind(String))();

// ----------------------------------------------------------------------------
// Math object prototype (seededRandom and randomBetween)
// ============================================================================
(function () {

    // Number.MAX_SAFE_INTEGER = 9007199254740990;
    const MAX_SEED = 244837814099629; // Maximum seed value not as HEX...

    // Initialize seed in case that setSeed() is never used... 
    let _seed = ((Date.now() * 3735928559) % MAX_SEED) + 1;
    let _newRandom = 0; // Just a private variable...

    /**
     * Give seed for new RNG!
     * @param {Number} seed Positive number
     */
    this.setSeed = seed => {
        _seed = seed < 1 ? Date.now() : (seed % MAX_SEED) + 1;
    };

    /** Give SEEDED random */
    this.random$ = () => {
        _newRandom = this.sin(_seed) * 12345; _seed = (_seed % MAX_SEED) + 1;
        return _newRandom - this.floor(_newRandom);
    };

    /**
     * Generates a SEEDED random integer between given range.
     * @param {Number} min Minimum number to generata
     * @param {Number} max Maximum number to generata
     */
    this.randomBetween$ = (min, max) => {
        return min + this.floor((max - min + 1) * this.random$());
    };

    /**
     * Generates a random integer between given range.
     * @param {Number} min Minimum number to generata
     * @param {Number} max Maximum number to generata
     */
    this.randomBetween = (min, max) => {
        return min + this.floor((max - min + 1) * this.random());
    };

    /** Tests seeded 2d6 statistics >> F12 >> Console tab >> Math.run2d6Tests() */
    this.run2d6Test = () => {
        let results = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; let started = Date.now();
        for (let i = 0; i < 6000; i++) {
            results[this.randomBetween$(0, 5) + this.randomBetween$(0, 5)]++;
        } console.log("time:" + (Date.now() - started), results);
    };

    /** Tests seeded 1d6 statistics >> F12 >> Console tab >> Math.run1d6Tests() */
    this.run1d6Test = () => {
        let results = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 6000; i++) {
            results[this.randomBetween$(0, 5)]++;
        } console.log(results);
    };

}.bind(Math))();

// ----------------------------------------------------------------------------
// Here we add BGS2 and BGS3 channels to AudioManager class
// ============================================================================
(function () {

    // Common to both channels
    Object.defineProperty(this, "bgsVolume23", {
        get: function () {
            return this._bgsVolume23;
        },
        set: function (value) {
            this._bgsVolume23 = value;
            this.updateBgsParameters2(this._currentBgs2);
            this.updateBgsParameters3(this._currentBgs3);
        },
        configurable: true
    }); this._bgsVolume23 = 100;

    // Here we add BGS2 channel
    this.playBgs2 = (bgs, pos) => {
        if (this.isCurrentBgs2(bgs)) {
            this.updateBgsParameters2(bgs);
        } else {
            this.stopBgs2();
            if (bgs.name) {
                this._bgsBuffer2 = this.createBuffer("bgs/", bgs.name);
                this.updateBgsParameters2(bgs);
                this._bgsBuffer2.play(true, pos || 0);
            }
        }
        this.updateCurrentBgs2(bgs, pos);
    };

    this.replayBgs2 = bgs => {
        if (this.isCurrentBgs2(bgs)) {
            this.updateBgsParameters2(bgs);
        } else {
            this.playBgs2(bgs, bgs.pos);
            if (this._bgsBuffer2) {
                this._bgsBuffer2.fadeIn(this._replayFadeTime);
            }
        }
    };

    this.isCurrentBgs2 = bgs => {
        return (
            this._currentBgs2 &&
            this._bgsBuffer2 &&
            this._currentBgs2.name === bgs.name
        );
    };

    this.updateBgsParameters2 = bgs => {
        this.updateBufferParameters(this._bgsBuffer2, this._bgsVolume23, bgs);
    };

    this.updateCurrentBgs2 = (bgs, pos) => {
        this._currentBgs2 = {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: pos
        };
    };

    this.stopBgs2 = () => {
        if (this._bgsBuffer2) {
            this._bgsBuffer2.destroy();
            this._bgsBuffer2 = null;
            this._currentBgs2 = null;
        }
    };

    this.fadeOutBgs2 = duration => {
        if (this._bgsBuffer2 && this._currentBgs2) {
            this._bgsBuffer2.fadeOut(duration);
            this._currentBgs2 = null;
        }
    };

    this.fadeInBgs2 = duration => {
        if (this._bgsBuffer2 && this._currentBgs2) {
            this._bgsBuffer2.fadeIn(duration);
        }
    };

    // Here we add BGS3 channel
    this.playBgs3 = (bgs, pos) => {
        if (this.isCurrentBgs3(bgs)) {
            this.updateBgsParameters3(bgs);
        } else {
            this.stopBgs3();
            if (bgs.name) {
                this._bgsBuffer3 = this.createBuffer("bgs/", bgs.name);
                this.updateBgsParameters3(bgs);
                this._bgsBuffer3.play(true, pos || 0);
            }
        }
        this.updateCurrentBgs3(bgs, pos);
    };

    this.replayBgs3 = bgs => {
        if (this.isCurrentBgs3(bgs)) {
            this.updateBgsParameters3(bgs);
        } else {
            this.playBgs3(bgs, bgs.pos);
            if (this._bgsBuffer3) {
                this._bgsBuffer3.fadeIn(this._replayFadeTime);
            }
        }
    };

    this.isCurrentBgs3 = bgs => {
        return (
            this._currentBgs3 &&
            this._bgsBuffer3 &&
            this._currentBgs3.name === bgs.name
        );
    };

    this.updateBgsParameters3 = bgs => {
        this.updateBufferParameters(this._bgsBuffer3, this._bgsVolume23, bgs);
    };

    this.updateCurrentBgs3 = (bgs, pos) => {
        this._currentBgs3 = {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: pos
        };
    };

    this.stopBgs3 = () => {
        if (this._bgsBuffer3) {
            this._bgsBuffer3.destroy();
            this._bgsBuffer3 = null;
            this._currentBgs3 = null;
        }
    };

    this.fadeOutBgs3 = duration => {
        if (this._bgsBuffer3 && this._currentBgs3) {
            this._bgsBuffer3.fadeOut(duration);
            this._currentBgs3 = null;
        }
    };

    this.fadeInBgs3 = duration => {
        if (this._bgsBuffer3 && this._currentBgs3) {
            this._bgsBuffer3.fadeIn(duration);
        }
    };

    this.saveBgs2 = () => {
        if (this._currentBgs2) {
            const bgs = this._currentBgs2;
            return {
                name: bgs.name,
                volume: bgs.volume,
                pitch: bgs.pitch,
                pan: bgs.pan,
                pos: this._bgsBuffer2 ? this._bgsBuffer2.seek() : 0
            };
        } else {
            return this.makeEmptyAudioObject();
        }
    };

    this.saveBgs3 = () => {
        if (this._currentBgs3) {
            const bgs = this._currentBgs3;
            return {
                name: bgs.name,
                volume: bgs.volume,
                pitch: bgs.pitch,
                pan: bgs.pan,
                pos: this._bgsBuffer3 ? this._bgsBuffer3.seek() : 0
            };
        } else {
            return this.makeEmptyAudioObject();
        }
    };

}.bind(AudioManager))();

// ----------------------------------------------------------------------------
// Now to the OcRam_Core declarations...
// ============================================================================
class OcRam_Core {

    constructor() { // Init some stuff...
        this.name = "Core"; this.version = '' + $temp_OcRam_Core_Ver;
        $temp_OcRam_Core_Ver = undefined; // Release this temp var
        this.plugins = []; // List of imported OcRam plugins as string...
        this.twh = [48, 48]; // Tile width and height
        this.twh50 = [24, 24]; // 50% of tile width and height
        this.radian = Math.PI / 180; // Pre-calc this
        this._screenTWidth = Graphics.width / 48; // Screen width in tiles?
        this._screenTHeight = Graphics.height / 48; // Screen height in tiles?
        this._isIndoors = false; this._menuCalled = false; this._autoSaving = false;
    }

    /** Make copy from object... */
    makeCopy() {
        return { ...this };
    }
    makeCopy(p) {
        return { ...p };
    }

    /**
     * Return true if parameter is omitted.
     * @param {any} p
     */
    isOmitted(p) {
        return p == null || p == undefined;
    }

    /**
     * Force any object to boolean. Return false if fails.
     * @param {Object} obj
     */
    getBoolean(obj) {
        if (!obj) return false; obj = obj.toString().toLowerCase();
        return (obj == "true" && obj != "0") ? true : false;
    }

    /**
     * Force any object to float. Return 0 if fails.
     * @param {Object} obj
     */
    getFloat(obj) {
        return isNaN(obj - parseFloat(obj)) ? 0 : parseFloat(obj);
    }

    /**
     * Force any object to array. Return [] if everything fails.
     * @param {Object} obj Array as any (also accepted in String format).
     * @param {Array} default_values Default values to be used
     */
    getArray(obj, default_values) {
        if (Array.isArray(obj)) return obj;
        let tmp = eval(obj); if (Array.isArray(tmp)) return tmp;
        if (!default_values || !Array.isArray(default_values)) default_values = [];
        return default_values;
    }

    /**
     * Force any object JSON object. Returns null if JSON parsing fails.
     * @param {Object} obj JSON object (also accepted in String format).
     */
    getJSON(obj) {
        try { return JSON.parse(obj); } catch (ex) { return null; }
    }

    /**
     * Force any object to JSON array. Returns [] if JSON parsing fails.
     * @param {Object} obj JSON object array (also accepted in String format).
     */
    getJSONArray(obj) {
        let tmp = [];
        if (obj) {
            OcRam.getArray(obj, []).forEach((s) => {
                tmp.push(OcRam.getJSON(s));
            });
        } return tmp;
    }

    /**
     * Regulate RGBG -object representing RGBG values.
     * @param {Object} rgbg_obj {Red: 0, Green: 0, Blue: 0, Gray: 0}
     */
    regulateRGBG(rgbg_obj) {
        rgbg_obj.Red = parseInt(rgbg_obj.Red).clamp(-255, 255);
        rgbg_obj.Green = parseInt(rgbg_obj.Green).clamp(-255, 255);
        rgbg_obj.Blue = parseInt(rgbg_obj.Blue).clamp(-255, 255);
        rgbg_obj.Gray = parseInt(rgbg_obj.Gray).clamp(-255, 255);
        return rgbg_obj;
    }

    /**
     * Regulate hex string representing RGBA values.
     * @param {String} hex_string #rrggbbaa
     */
    regulateHexRGBA(hex_string) {
        if (hex_string.substr(0, 1) !== "#") hex_string = "#" + hex_string;
        if (hex_string.length == 7) hex_string = hex_string + "ff";
        return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex_string)[0] || "#ffffffff";
    }

    // hexToRGB & hexToRGBA Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb?rq=1

    hexToRGBA(p) {
        if (p.length < 9) p = p + "ff";
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(p);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: parseFloat(parseFloat(parseInt(result[4], 16) / 255).toFixed(2))
        } : null;
    }

    rgbaToHex(rgba) {
        return "#" + this.padHex(rgba.r) + this.padHex(rgba.g) + this.padHex(rgba.b) + this.padHex((255 * rgba.a));
    }

    padHex(p) {
        return ("00" + p.toString(16)).substr(-2);
    }

    /** Is this map set as <indoors>? Return true if it is else false. */
    isIndoors() { return this._isIndoors; }

    /**
     * Get game object (player, follower, vehicle or event) by id
     * @param {Number} event_id -1 player, -2 to -4 follower, -100 to -102 vehicle else event id
     */
    getGameObject(event_id) {
        if (event_id < -1 && event_id > -100) {
            return $gamePlayer._followers._data[-(event_id + 2)];
        } else {
            switch (event_id) {
                case -102: return $gameMap.airship();
                case -101: return $gameMap.ship();
                case -100: return $gameMap.boat();
                case -1: return $gamePlayer;
                default: return $gameMap.getEventById(event_id);
            }
        }
    }

    /**
     * Get game object id
     * @param {any} obj Game_Player, Game_Follower, Game_Vehicle or Game_Event
     */
    getGameObjectId(obj) {
        if (!obj || !obj.isPlayer) return 0;
        if (obj.isFollower()) {
            return -(obj._memberIndex + 1);
        } else if (obj.isPlayer()) {
            return -1;
        } else if (obj.isVehicle()) {
            switch (obj._type) {
                case "airship": return -100; break;
                case "ship": return -101; break;
                case "boat": return -102; break;
            }
        } else {
            return obj._eventId;
        }
    }

    /** Shortcut to: $gamePlayer._followers.visibleFollowers() */
    followers() {
        return $gamePlayer && $gamePlayer._followers ? $gamePlayer._followers.visibleFollowers() : [];
    }

    /** Shortcut to: SceneManager._scene */
    scene() {
        return SceneManager._scene;
    }

    /**
     * Return true if current scene constructor is desired scene else returns false
     * Usage example: OcRam.isCurrentScene(Scene_Map)
     * @param {Object} scene
     */
    isCurrentScene(scene) {
        return SceneManager._scene && SceneManager._scene.constructor === scene;
    }

    /**
     * Set self switch to any event in current map.
     * @param {any} event Event id or name
     * @param {String} key Key A, B, C or D
     * @param {Boolean} value true/false
     */
    setSelfSwitch(event, key, value) {
        if (isNaN(event)) {
            $gameMap.getEventsByName(event).forEach(ev => {
                $gameSelfSwitches.setValue([$gameMap._mapId, ev._eventId, key], value);
            });
        } else {
            $gameSelfSwitches.setValue([$gameMap._mapId, event, key], value);
        }
    }

    /**
     * Run common event with desired id.
     * @param {Number} ce_id Common event id
     */
    runCE(ce_id) {
        if ($gameTemp.isCommonEventReserved()) { //let tmpId = ce_id; let tc = this;
            setTimeout(() => { //tc.runCE(tmpId);
                this.runCE(ce_id);
            }, 17);
        } else {
            $gameTemp.reserveCommonEvent(ce_id);
        }
    }

    /**
     * Returns character sprite by event id
     * @param {Number} event_id
     */
    getSpriteByEventId(event_id) {
        let sc = SceneManager._scene; let ret = null;
        if (!sc) return ret;
        if (!sc._spriteset) return ret;
        sc = sc._spriteset;
        if (!sc._characterSprites) return ret;
        sc = sc._characterSprites;
        sc.forEach(cs => {
            if (cs._character._eventId == event_id) ret = cs;
        }); return ret;
    }

    /**
     * Add plugin to OcRam_Core. Call it later like this: OcRam.Plugin_Name
     * @param {String} name Name of the plugin (without OcRam_) prefix
     * @param {Float} version Version of the plugin [Major].[Minor]
     */
    addPlugin(name, version) {

        this[name] = {}; let new_plugin = this[name];
        Imported["OcRam_" + name] = true; this.plugins.push(name);

        new_plugin.name = name; new_plugin.version = version;
        new_plugin.parameters = PluginManager.parameters("OcRam_" + new_plugin.name);

        // Should be overwritten in plugin itself...
        new_plugin.clearPluginData = () => { };
        new_plugin.savePluginData = gs => { };
        new_plugin.loadPluginData = gs => { };
        new_plugin.onMapStart = sm => { };
        new_plugin.onMapTerminate = sm => { };
        new_plugin.createLowerMapLayer = sm => { };
        new_plugin.createLowerBattleLayer = sb => { };
        new_plugin.onMapLoaded = sm => { };

        if (this.getBoolean(new_plugin.parameters["Debug mode"])) {
            /** Debug function enabled */
            new_plugin.debug = function () {
                let args = [].slice.call(arguments);
                args.unshift("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", ":");
                console.log.apply(console, args);
            }; console.log("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", "Debug mode:", "Enabled");
            console.log("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", "Parameters:", new_plugin.parameters);
        } else { /** Debug function disabled - No extra if clauses needed !!! */
            new_plugin.debug = () => { };
        }

        /**
         * Extend any function defined in cb.
         * @param {Object} c Base class
         * @param {String} b Base function
         * @param {Function} cb Callback
         */
        new_plugin.extend = (c, b, cb) => {
            let cb_name = c.name + "_" + b;
            if (c[b]) {
                new_plugin[cb_name] = c[b];
                c[b] = function () {
                    return cb.apply(this, arguments);
                };
            } else {
                new_plugin[cb_name] = c.prototype[b];
                c.prototype[b] = function () {
                    return cb.apply(this, arguments);
                };
            }
        };

    }

    /** Read map notetags (uses tileset as fallback) */
    readMapNotetags() {
        if (DataManager.isEventTest()) return;
        this.refreshIndoorsFlag(); // Indoors used by several plugins
    }

    /**
     * Extends any function
     * @param {Object} c Base class
     * @param {String} b Base function
     * @param {Function} cb Callback
     */
    extend(c, b, cb) {
        let cb_name = c.name + "_" + b;
        if (c[b]) {
            this[cb_name] = c[b];
            c[b] = function () {
                return cb.apply(this, arguments);
            };
        } else {
            this[cb_name] = c.prototype[b];
            c.prototype[b] = function () {
                return cb.apply(this, arguments);
            };
        }
    }

    /** Debug is disabled by default for optimization reasons */
    debug() { /* Will be extended if debug is enabled */ }

    /** Refresh indoors flag - NOW */
    refreshIndoorsFlag() {
        if ($dataMap.meta["outdoors"]) {
            this.debug("Outdoors meta tag found in MAP note field!", $dataMap.meta);
            this._isIndoors = false;
        } else if ($dataMap.meta["indoors"] !== undefined) {
            this.debug("Indoors meta tag found in MAP note field!", $dataMap.meta); this._isIndoors = true;
        } else {
            if ($dataTilesets[$dataMap.tilesetId].meta["indoors"] !== undefined) {
                this.debug("Indoors meta tag found in TILESET note field!", $dataTilesets[$dataMap.tilesetId].meta); this._isIndoors = true;
            } else {
                this.debug("Indoors meta tag was NOT found!", undefined); this._isIndoors = false;
            }
        }
    }

} let OcRam = new OcRam_Core(); // Create new OcRam_Core!

// ----------------------------------------------------------------------------
// OcRam_Core prototyping / aliasing etc...
// ============================================================================
(function () {

    // ----------------------------------------------------------------------------
    // Plugin init (parameters and private variables)
    // ============================================================================
    const _this = this; this.parameters = PluginManager.parameters('OcRam_' + this.name);
    const _showBGS23Volume = OcRam.getBoolean(this.parameters['Show BGS2/3 Volume']);
    const _bgs23Caption = this.parameters['BGS2/3 Option Caption'] || 'Weather Volume';
    const _mergeMEtoBGM = OcRam.getBoolean(this.parameters['Merge ME/BGM Volume']);
    const _enableDPad = OcRam.getBoolean(this.parameters['Enable D-pads']);
    const _eventThroughFix = OcRam.getBoolean(this.parameters['Event through fix']);

    if (this.getBoolean(this.parameters["Debug mode"])) { // Debug enabled?
        OcRam_Core.prototype.debug = function () {
            let args = [].slice.call(arguments);
            args.unshift("OcRam_" + this.name + " (v" + this.version + ")", ":");
            console.log.apply(console, args);
        }
    }

    // ----------------------------------------------------------------------------
    // RMMZ core extensions to existing methods
    // ============================================================================

    // Add BGS2 and BGS3 to RMMZ ConfigManager
    if (_showBGS23Volume) { // Re-define BGS2/3 getters and setters - if BGS2/3 volume control is disabled
        Object.defineProperty(ConfigManager, 'bgsVolume23', {
            get: function () {
                return AudioManager.bgsVolume23;
            },
            set: function (value) {
                AudioManager.bgsVolume23 = value;
            },
            configurable: true
        });
    } else { // Override ConfigManager.bgsVolume
        Object.defineProperty(ConfigManager, 'bgsVolume', {
            get: function () {
                return AudioManager.bgsVolume;
            },
            set: function (value) {
                AudioManager.bgsVolume = value;
                AudioManager.bgsVolume23 = value;
            },
            configurable: true
        });
    }

    if (_mergeMEtoBGM) {
        Object.defineProperty(ConfigManager, "bgmVolume", {
            get: function () {
                return AudioManager.bgmVolume;
            },
            set: function (value) {
                AudioManager.bgmVolume = value;
                AudioManager.meVolume = value;
            },
            configurable: true
        });
        Object.defineProperty(AudioManager, "meVolume", {
            get: function () {
                return this._bgmVolume;
            },
            set: function (value) {
                this._meVolume = this._bgmVolume;
                this.updateMeParameters(this._currentMe);
            },
            configurable: true
        });
    }

    this.extend(ConfigManager, "makeData", function () {
        let config = _this["ConfigManager_makeData"].apply(this, arguments);
        config.bgsVolume23 = this.bgsVolume23;
        return config;
    });

    this.extend(ConfigManager, "applyData", function (config) {
        _this["ConfigManager_applyData"].apply(this, arguments);
        if (_showBGS23Volume) {
            this.bgsVolume23 = this.readVolume(config, 'bgsVolume23');
        } else {
            this.bgsVolume23 = this.readVolume(config, 'bgsVolume');;
        }
    });

    // Add BGS2/3 volume control to options if enabled...
    this.extend(Window_Options, "addVolumeOptions", function () {
        if (_mergeMEtoBGM) {
            this.addCommand(TextManager.bgmVolume, "bgmVolume");
            this.addCommand(TextManager.bgsVolume, "bgsVolume");
            this.addCommand(TextManager.seVolume, "seVolume");
        } else {
            _this["Window_Options_addVolumeOptions"].apply(this, arguments);
        } if (_showBGS23Volume) this.addCommand(_bgs23Caption, 'bgsVolume23');
    });

    /** Stop all audio - Including our new 2 channels */
    this.extend(AudioManager, "stopAll", function () {
        _this["AudioManager_stopAll"].apply(this, arguments);
        this.stopBgs2(); this.stopBgs3();
    });

    /** Check errors also in new BGS channels */
    this.extend(AudioManager, "checkErrors", function () {
        _this["AudioManager_checkErrors"].apply(this, arguments);
        if (this._bgsBuffer2 && this._bgsBuffer2.isError()) this.throwLoadError(this._bgsBuffer2);
        if (this._bgsBuffer3 && this._bgsBuffer3.isError()) this.throwLoadError(this._bgsBuffer3);
    });

    /** Handle new channels also in Game_System (Save/Load) */
    this.extend(Game_System, "initialize", function () {
        _this["Game_System_initialize"].apply(this, arguments);
        this._bgsOnSave2 = null; this._bgsOnSave3 = null;
    });

    /** Is autosaving? */
    this.extend(Scene_Base, "executeAutosave", function () {
        _this._autoSaving = true;
        _this["Scene_Base_executeAutosave"].apply(this, arguments);
        _this._autoSaving = false;
    });

    /** Menu called? */
    this.extend(Scene_Map, "callMenu", function () {
        _this["Scene_Map_callMenu"].apply(this, arguments);
        OcRam.debug("Menu called:", true);
        OcRam._menuCalled = true;
    }); this.extend(Scene_Save, "initialize", function () {
        _this["Scene_Save_initialize"].apply(this, arguments);
        OcRam._menuCalled = true;
    });

    if (_eventThroughFix) { /** Event "Through" fix for player/event touch triggers */
        this.extend(Game_Player, "canMove", function () {

            const ret = _this["Game_Player_canMove"].apply(this, arguments);
            const ev = $gameMap.event($gameMap._interpreter.eventId());
            if (!ev) return ret; if (ev._trigger < 1 || ev._trigger > 2) return ret;

            if (!!$gameMap._interpreter._list.find(function (itm) {
                switch (itm.code) {
                    case 401: case 402: case 404: case 103: case 104: case 205: return true;
                }
            })) return false;

            if (ev.isThrough()) return true;

        });
    }

    // ----------------------------------------------------------------------------
    // "Must override" functions (clear-, load- and savePluginData)
    // ============================================================================
    // "To title command"
    this.extend(Scene_GameEnd, "commandToTitle", function () {
        OcRam.plugins.forEach(p => { OcRam[p].clearPluginData(); });
        _this["Scene_GameEnd_commandToTitle"].apply(this, arguments);
    });

    // Return to Title Screen
    this.extend(Game_Interpreter, "command354", function () {
        OcRam.plugins.forEach(p => { OcRam[p].clearPluginData(); });
        _this["Game_Interpreter_command354"].apply(this, arguments); return true;
    });

    // Game over
    this.extend(Scene_Gameover, "gotoTitle", function () {
        OcRam.plugins.forEach(p => { OcRam[p].clearPluginData(); });
        _this["Scene_Gameover_gotoTitle"].apply(this, arguments);
    });

    // Save plugin data
    this.extend(Game_System, "onBeforeSave", function () {
        _this["Game_System_onBeforeSave"].apply(this, arguments);
        this._bgsOnSave2 = AudioManager.saveBgs2();
        this._bgsOnSave3 = AudioManager.saveBgs3();
        OcRam.plugins.forEach(p => { OcRam[p].savePluginData(this); });
    });

    // Load plugin data
    this.extend(Game_System, "onAfterLoad", function () {
        _this["Game_System_onAfterLoad"].apply(this, arguments);
        AudioManager.playBgs2(this._bgsOnSave2);
        AudioManager.playBgs3(this._bgsOnSave3);
        OcRam.plugins.forEach(p => { OcRam[p].loadPluginData(this); });
    });

    // onMapStart
    this.extend(Scene_Map, "start", function () {
        _this["Scene_Map_start"].apply(this, arguments);
        OcRam.plugins.forEach(p => { OcRam[p].onMapStart(this); });
        OcRam._menuCalled = false; // onMapLoaded >> createLowerLayer >> start
    });

    // onMapTerminate
    this.extend(Scene_Map, "terminate", function () {
        OcRam.plugins.forEach(p => { OcRam[p].onMapTerminate(this); });
        _this["Scene_Map_terminate"].apply(this, arguments);
    });

    // createLowerMapLayer
    this.extend(Spriteset_Map, "createLowerLayer", function () {
        _this["Spriteset_Map_createLowerLayer"].apply(this, arguments);
        OcRam.plugins.forEach(p => { OcRam[p].createLowerMapLayer(this); });
    });

    // createLowerBattleLayer
    this.extend(Spriteset_Battle, "createLowerLayer", function () {
        _this["Spriteset_Battle_createLowerLayer"].apply(this, arguments);
        OcRam.plugins.forEach(p => { OcRam[p].createLowerBattleLayer(this); });
    });

    // onMapLoaded - Refresh tile dimensions, menu called and indoors flag */
    this.extend(Scene_Map, "onMapLoaded", function () {

        OcRam.readMapNotetags();

        _this["Scene_Map_onMapLoaded"].apply(this, arguments);

        if (!OcRam._menuCalled) {
            OcRam.twh = [$gameMap.tileWidth(), $gameMap.tileHeight()];
            OcRam.twh50 = [OcRam.twh[0] * 0.5, OcRam.twh[1] * 0.5];
            OcRam._screenTWidth = Graphics.width / OcRam.twh[0];
            OcRam._screenTHeight = Graphics.height / OcRam.twh[1];
            OcRam.debug("Tile w/h:", OcRam.twh);
        }

        OcRam.plugins.forEach(p => {
            OcRam[p].onMapLoaded(this);
        });

    });

    /*this.extend(Scene_Boot, "isReady", function () {
        let ret = _this["Scene_Boot_isReady"].apply(this, arguments);
        if (ret) { // Boot is ready and database is loaded...
            
        } return ret;
    });*/

    // ----------------------------------------------------------------------------
    // New methods to RMMZ core classes
    // ============================================================================

    // Simple test is Character a player, follower, event or vehicle
    Game_CharacterBase.prototype.isPlayer = function () { return false; };
    Game_CharacterBase.prototype.isFollower = function () { return false; };
    Game_CharacterBase.prototype.isVehicle = function () { return false; };
    Game_CharacterBase.prototype.isEvent = function () { return false; };
    Game_Player.prototype.isPlayer = function () { return true; };
    Game_Follower.prototype.isFollower = function () { return true; };
    Game_Vehicle.prototype.isVehicle = function () { return true; };
    Game_Event.prototype.isEvent = function () { return true; };

    // Scene tests
    Scene_Base.prototype.isTitle = function () { return false; }
    Scene_Base.prototype.isMap = function () { return false; }
    Scene_Title.prototype.isTitle = function () { return true; }
    Scene_Map.prototype.isMap = function () { return true; }

    /** Make copy of sprite object: let my_copy = my_sprite.makeCopy(); */
    Sprite.prototype.makeCopy = function () {
        _this.makeCopy.bind(this);
    };

    /** Get Game_Event in event editor like: this.event(); */
    Game_Interpreter.prototype.event = function () {
        return ($gameMap) ? $gameMap.event(this._eventId) : null;
    };

    /**
     * Get Game_Map events by name
     * @param {String} event_name
     */
    Game_Map.prototype.getEventsByName = function (event_name) {
        return this._events.filter(ev => {
            return (ev) ? ev.event().name == event_name : false;
        });
    };

    /**
     * Get Game_Map event by id
     * @param {Number} event_id
     */
    Game_Map.prototype.getEventById = function (event_id) { return this.event(event_id); };

    /**
     * Return true if player is in range of given radius. Else returns false.
     * @param {Number} radius in tiles
     */
    Game_Event.prototype.isPlayerInRadius = function (radius) { // Must have valid light source - else will return always false

        // If there's no radius return false
        if (radius < 1) return false;

        // Check impossible
        const ax = Math.abs($gamePlayer._x - this._x); if (ax > radius) return false;
        const ay = Math.abs($gamePlayer._y - this._y); if (ay > radius) return false;
        if ((ax + ay) > (radius * 1.5)) return false; // To make radius as circle - Other wise would be square
        return true; // PLAYER IN RADIUS !!!

    };

    /** Returns all comments + commandIndex from Game_Event as Array */
    Game_Event.prototype.getComments = function () {
        if (this._erased || this._pageIndex < 0) return [];
        let comments = []; let i = 0;
        this.list().forEach(p => {
            if (p.code == 108 || p.code == 408) {
                p.commandIndex = i; comments.push(p);
            } i++;
        }); return comments;
    };

    /** Returns all comments from Game_Event as String Array */
    Game_Event.prototype.getStringComments = function () {
        const arr = this.getComments(); let comments = [];
        arr.forEach(c => {
            if (c.code == 108) {
                comments.push(c.parameters[0]);
            } else if (c.code == 408) {
                comments[comments.length - 1] += "\n" + c.parameters[0];
            }
        }); return comments;
    };

    /** Returns all open tags from Game_Event as String Array + adds command index to start */
    Game_Event.prototype.getOpenTags = function (tag) {
        let ret = [];
        this.getComments().forEach(c => {
            (c.parameters[0] + '').getOpenTags(tag).forEach(t => {
                ret.push(c.commandIndex + ":" + t);
            });
        }); return ret;
    };

    /** Returns all closed tags from Game_Event as String Array */
    Game_Event.prototype.getClosedTags = function (tag) {
        let ret = [];
        this.getStringComments().forEach(s => {
            (s + '').getClosedTags(tag).forEach(t => {
                ret.push(t);
            });
        }); return ret;
    };

    /**
     * Load bitmap from ./img/ocram folder
     * @param {String} filename
     * @param {Number} hue
     */
    ImageManager.loadOcRamBitmap = function (filename, hue) {
        return this.loadBitmap('img/ocram/', filename, hue, false);
    };

    /**
     * More optimized core adjustX
     * @param {Number} x
     */
    Game_Map.prototype.adjustX_OC = function (x) {
        if (this.isLoopHorizontal()) {
            if (x < this._displayX - (this.width() - this.screenTileX()) * 0.5) {
                return x - this._displayX + $dataMap.width;
            } else {
                return x - this._displayX;
            }
        } else {
            return x - this._displayX;
        }
    };

    /**
     * More optimized core adjustY
     * @param {Number} y
     */
    Game_Map.prototype.adjustY_OC = function (y) {
        if (this.isLoopVertical()) {
            if (y < this._displayY - (this.height() - this.screenTileY()) * 0.5) {
                return y - this._displayY + $dataMap.height;
            } else {
                return y - this._displayY;
            }
        } else {
            return y - this._displayY;
        }
    };

    /** More optimized core screenX */
    Game_CharacterBase.prototype.screenX_OC = function () {
        return Math.round($gameMap.adjustX_OC(this._realX) * OcRam.twh[0] + OcRam.twh50[0]);
    };

    /** More optimized core screenY */
    Game_CharacterBase.prototype.screenY_OC = function () {
        return Math.round($gameMap.adjustY_OC(this._realY) * OcRam.twh[1] + OcRam.twh50[0] - this.shiftY() - this.jumpHeight());
    };

    /** Shortcut to this.contents.fontSize */
    Window_Base.prototype.fontSize = function () {
        return this.contents.fontSize;
    };

    // ----------------------------------------------------------------------------
    // Overwrites
    // ============================================================================
    let _dashing = false;

    Game_Player.prototype.isDashButtonPressed = function () {
        const shift = Input.isPressed("shift") || _dashing;
        if (ConfigManager.alwaysDash) {
            return !shift;
        } else {
            return shift;
        }
    };

    if (_enableDPad) {
        Input._updateGamepadState = function (gamepad) {
            const lastState = this._gamepadStates[gamepad.index] || [];
            const newState = [];
            const buttons = gamepad.buttons;
            const axes = gamepad.axes;
            const threshold = 0.25;
            const d_pad = axes[axes.length - 1].toFixed(2);
            newState[12] = false; newState[13] = false;
            newState[14] = false; newState[15] = false;
            if (d_pad != 3.29) { /* D-Pad */
                if (d_pad == -1.00) { newState[12] = true; } // up
                else if (d_pad == -0.43) { newState[15] = true; } // right
                else if (d_pad == 0.14) { newState[13] = true; } // down
                else if (d_pad == 0.71) { newState[14] = true; } // left
                else if (d_pad == 0.43) { newState[13] = true; newState[14] = true; } // 1
                else if (d_pad == -0.14) { newState[13] = true; newState[15] = true; } // 3
                else if (d_pad == 1.00) { newState[12] = true; newState[14] = true; } // 7
                else if (d_pad == -0.71) { newState[12] = true; newState[15] = true; } // 9
            }
            for (let i = 0; i < buttons.length; i++) {
                newState[i] = buttons[i].pressed;
            }
            if (axes[1] < -threshold) {
                newState[12] = true; // up
            } else if (axes[1] > threshold) {
                newState[13] = true; // down
            }
            if (axes[0] < -threshold) {
                newState[14] = true; // left
            } else if (axes[0] > threshold) {
                newState[15] = true; // right
            }
            for (let j = 0; j < newState.length; j++) {
                if (newState[j] !== lastState[j]) {
                    const buttonName = this.gamepadMapper[j];
                    if (buttonName) {
                        this._currentState[buttonName] = newState[j];
                    }
                }
            }
            this._gamepadStates[gamepad.index] = newState;
        };
    }

    // ----------------------------------------------------------------------------
    // Plugin commands - Do not use leximate scope with: args => { ... }
    // ============================================================================
    PluginManager.registerCommand("OcRam_" + this.name, "playBGS", function (args) {
        const tmp_bgs = {
            name: args.name || '',
            volume: Number(args.volume),
            pitch: Number(args.pitch),
            pan: Number(args.pan),
            pos: 0
        }; _this.debug("Plugin command: playBGS (channel:" + args.channel + ")", tmp_bgs);
        switch (Number(args.channel)) {
            case 1: AudioManager.playBgs(tmp_bgs); if (Number(args.fadeIn) > 0) AudioManager.fadeInBgs(Number(args.fadeIn)); break;
            case 2: AudioManager.playBgs2(tmp_bgs); if (Number(args.fadeIn) > 0) AudioManager.fadeInBgs2(Number(args.fadeIn)); break;
            case 3: AudioManager.playBgs3(tmp_bgs); if (Number(args.fadeIn) > 0) AudioManager.fadeInBgs3(Number(args.fadeIn)); break;
        }
    });

    PluginManager.registerCommand("OcRam_" + this.name, "stopBGS", function (args) {
        _this.debug("Plugin command: stopBGS", args);
        if (Number(args.fadeOut) > 0) {
            switch (Number(args.channel)) {
                case 0: // Fade out all
                    AudioManager.fadeOutBgs(Number(args.fadeOut));
                    AudioManager.fadeOutBgs2(Number(args.fadeOut));
                    AudioManager.fadeOutBgs3(Number(args.fadeOut));
                    break;
                case 1: AudioManager.fadeOutBgs(Number(args.fadeOut)); break;
                case 2: AudioManager.fadeOutBgs2(Number(args.fadeOut)); break;
                case 3: AudioManager.fadeOutBgs3(Number(args.fadeOut)); break;
            }
        } else {
            switch (Number(args.channel)) {
                case 0: // Stop all
                    AudioManager.stopBgs();
                    AudioManager.stopBgs2();
                    AudioManager.stopBgs3();
                    break;
                case 1: AudioManager.stopBgs(); break; // BGS channel 1
                case 2: AudioManager.stopBgs2(); break; // BGS channel 2
                case 3: AudioManager.stopBgs3(); break; // BGS channel 3
            };
        }
    });

}.bind(OcRam)());

/*//Handling OcRam_Core later on...
OcRam_Core = class extends OcRam_Core {

    constructor() { super(); }

    // Overwrite
    oldMethodToOverwrite(a, b) {
        console.log("oldMethodToOverwrite - is now overwritten", a, b);
    }

    // Alias
    doSomethingOld(p1, p2) {
        super.doSomethingOld(p1);
        this.doSomethingNew(p2);
    }

    // New method
    doSomethingNew(p) {
        console.log("doSomethingNew", p);
    }

}//...or then just prototype it...*/