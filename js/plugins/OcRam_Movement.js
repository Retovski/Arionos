//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Movement.js
//=============================================================================

"use strict"; if (!Imported || !Imported.OcRam_Core) alert('OcRam_Core.js ' +
    'is required!'); if (parseFloat(OcRam.version) < 1.06) alert("OcRam core v1.06 or greater is required!");

OcRam.addPlugin("Movement", "1.01");

/*:
 * @target MZ
 * @plugindesc v1.01 This plugin provides diagonal/pseudo-pixel movement features for your RMMZ -project!
 * @author OcRam
 * @url https://ocram-codes.net
 * @base OcRam_Core
 * @orderAfter OcRam_Core
 * @orderBefore OcRam_Audio
 * @orderBefore OcRam_Lights
 * @orderBefore OcRam_Passages
 * @orderBefore OcRam_Local_Coop
 * 
 * @param Enable pixel movement
 * @type boolean
 * @desc Enable pixel movement feature? false = will use only diagonal movement.
 * @default true
 * 
 * @param Default to pixel
 * @parent Enable pixel movement
 * @type boolean
 * @desc Default all events to pixel movement?
 * @default false
 * 
 * @param Center on gather
 * @parent Enable pixel movement
 * @type boolean
 * @desc Center player x/y pos on gather command to nearest tile?
 * @default true
 * 
 * @param Adjust diagonal speed
 * @type boolean
 * @desc Adjust diagonal speed to feel more natural?
 * @default false
 * 
 * @param Default to diagonal
 * @type boolean
 * @desc Default all events to diagonal movement?
 * @default false
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
 * Sub-/pseudo pixel movement is used in this plugin to to give nice 
 * performance boost while feeling like actual pixel move!
 * 
 * Features:
 *  - Pseudo pixel movement (16 sub tiles per 1 tile)
 *    So shortest passage for 1 tile is four (4) steps.
 *  - Diagonal movement
 *  - Smart event collide check (glides only on most top/bottom corners)
 *  - Corner glide (won't get stuck to corners)
 *  - Above features also applies to events if desired so
 * 
 * NOTE: Pixel movement always includes also diagonal movement!
 * 
 * ----------------------------------------------------------------------------
 * Notetags
 * ============================================================================
 * Event notetags (specific for 'this' event only)
 *    <movement:normal>        Enables tile based movement
 *    <movement:diagonal>      Enables diagonal movement
 *    <movement:pixel>         Enables pixel movement (and diagonal)
 * 
 * ----------------------------------------------------------------------------
 * Plugin commands
 * ============================================================================
 * -
 * 
 * ----------------------------------------------------------------------------
 * JavaScript commands
 * ============================================================================
 * OcRam.Movement.isDiagonalDir(dir)    // true if diagonal else is false
 * OcRam.Movement.getHorzVert(dir)      // Return [xdir, ydir]
 * OcRam.Movement.getHorzVertDir(dir)   // Return 1, 3, 7 or 9
 * 
 * Game_CharacterBase.prototype.setPixelMove(bool)
 * Game_CharacterBase.prototype.setDiagonalMove(bool)
 * Example in event:        this.event().setPixelMove(true);
 * -OR- If in move route:   this.setPixelMove(true);
 * 
 * ----------------------------------------------------------------------------
 * Terms of Use
 * ============================================================================
 * Edits are allowed as long as "Terms of Use" is not changed in any way.
 * Exception: Obfuscating and/or minifying JS, where ALL comments are removed
 * (incluging these "Terms of Use"), is allowed (won't change ToU).
 *
 * NON-COMMERCIAL USE: Free to use with credits to 'OcRam'
 *
 * If you gain money with your game by ANY MEANS (inc. ads, crypto-mining,
 * micro-transactions etc..) it's considered as COMMERCIAL use of this plugin!
 *
 * COMMERCIAL USE: (Standard license: 5 EUR, No-credits license: 40 EUR)
 * Payment via PayPal (https://paypal.me/MarkoPaakkunainen), please mention
 * PLUGIN NAME(S) you are buying / ALL plugins and your PROJECT NAME(S).
 *
 * Licenses are purchased per project and standard license requires credits.
 * If you want to buy several licenses: Every license purhased will give you
 * discount of 2 EUR for the next license purchase until minimum price of
 * 2 EUR / license. License discounts can be used to any of my plugins!
 * ALL of my plugins for 1 project = 40 EUR (standard licenses)
 *
 * OcRam -plugins available at https://ocram-codes.net/plugins.aspx?engine=mz
 *
 * DO NOT COPY, RESELL OR CLAIM ANY PIECE OF THIS PLUGIN AS YOUR OWN!
 * Copyright (c) 2020, Marko Paakkunainen // mmp_81 (at) hotmail.com
 *
 * ----------------------------------------------------------------------------
 * Version History
 * ============================================================================
 * 2020/10/10 v1.00 - Initial release
 * 2020/10/25 v1.01 - Compatibility patch for OcRam_Followers
 *                    New JS call to center character to tile
 *                    Center characters on "Jump" and "Gather" command
 *                    Endless loop in diagonal "find to" func is now fixed
 * 
 * ----------------------------------------------------------------------------
 * Overrides (destructive declarations) are listed here
 * ============================================================================
 * Game_Player.prototype.getInputDirection
 * Game_Character.prototype.findDirectionTo
 * Game_CharacterBase.prototype.canPassDiagonally
 * Game_CharacterBase.prototype.moveDiagonally
 * Game_Character.prototype.turnTowardCharacter (if diagonal)
 * Game_Character.prototype.moveTowardCharacter
 * Game_Character.prototype.turnAwayFromCharacter (if diagonal)
 * Game_Character.prototype.moveAwayFromCharacter
 * Game_Character.prototype.moveRandom (if diagonal)
 * Game_Player.prototype.forceMoveForward (if pixel)
 * Game_Follower.prototype.chaseCharacter (if pixel)
 * Game_Vehicle.prototype.pos (if pixel)
 * 
 */

(function () {
    
    // ------------------------------------------------------------------------------
    // Plugin variables and parameters
    // ==============================================================================
    const _this = this; // Refers to this plugin - To be used in subscopes...
    const _adjustDiagonalSpeed = OcRam.getBoolean(this.parameters['Adjust diagonal speed']);
    const _pixelMovementEnabled = OcRam.getBoolean(this.parameters['Enable pixel movement']);
    const _defaultToDiagonal = OcRam.getBoolean(this.parameters['Default to diagonal']);
    const _defaultToPixel = OcRam.getBoolean(this.parameters['Default to pixel']);
    const _centerOnGather = OcRam.getBoolean(this.parameters['Center on gather']);

    /* // TODO: Minimum gap in steps between followers?
     * @param Follower gap
     * @parent Enable pixel movement
     * @type number
     * @min 1
     * @max 4
     * @desc Minimum gap in steps between followers?
     * @default 3
     *///const _followerGap = 0.25 * Number(this.parameters['Follower gap']);

    // Arrays to optimize base code...
    const _rightTurn45Array = [0, 4, 1, 2, 7, 0, 3, 8, 9, 6];
    const _leftTurn45Array = [0, 2, 3, 6, 1, 0, 9, 4, 7, 8];
    const _dirArr = [1, 2, 3, 4, 6, 7, 8, 9];
    const SP_GRID = 0.25; // Sub/pseudo pixel movement 4x4
    let _twSP = [1 - SP_GRID, 1 - SP_GRID];
    let _stepsToTrigger = 0;

    // ------------------------------------------------------------------------------
    // Private Utility functions - Inherited to all sub scopes here
    // ==============================================================================
    const isDiagonalDir = dir => {
        switch (dir) {
            case 1: case 3: case 7: case 9:
                return true; break;
            default: return false;
        }
    };

    const getHorzVert = direction => {
        switch (direction) {
            case 1: return [4, 2]; break;
            case 3: return [6, 2]; break;
            case 7: return [4, 8]; break;
            case 9: return [6, 8]; break;
            default: [0, 0]; break;
        }
    };

    const getHorzVertDir = (horz, vert) => {
        // Just in case [horz, vert] needs to be converted to single digit...
        if (horz == 4 && vert == 2) return 1;
        if (horz == 6 && vert == 2) return 2;
        if (horz == 4 && vert == 8) return 7;
        if (horz == 6 && vert == 8) return 9;
    };

    const turnRight45 = direction => {
        return _rightTurn45Array[direction];
    };

    const turnLeft45 = direction => {
        return _leftTurn45Array[direction];
    };

    const roundUpSPX = (n, d) => {
        if (d == 4) {
            return Math.floor(n + _twSP[0]);
        } else {
            return Math.ceil(n - _twSP[0]);
        }
    };

    const roundUpSPY = (n, d) => {
        if (d == 8) {
            return Math.floor(n + _twSP[1]);
        } else {
            return Math.ceil(n - _twSP[1]);
        }
    };

    const centerCharacter = character => {
        character.centerToTile();
    };

    // ------------------------------------------------------------------------------
    // Public plugin functions - Usage: OcRam.PluginName.myFunction(arguments)
    // ==============================================================================
    this.isDiagonalDir = direction => {
        return isDiagonalDir(direction);
    };

    this.getHorzVert = direction => {
        return getHorzVert(direction);
    };

    this.getHorzVertDir = (horz, vert) => {
        return getHorzVertDir(horz, vert);
    };

    this.centerCharacter = character => {
        centerCharacter(character);
    };

    // ------------------------------------------------------------------------------
    // Plugin Classes - Class_Name
    // ==============================================================================

    // ------------------------------------------------------------------------------
    // New methods
    // ==============================================================================
    Game_CharacterBase.prototype.setPixelMove = function (v) {
        this._pixelMovementDisabled = !v;
    };

    Game_CharacterBase.prototype.setDiagonalMove = function (v) {
        this._diagonalMovementDisabled = !v;
    };

    Game_CharacterBase.prototype.centerToTile = function () {
        this._x = Math.round(this._x);
        this._y = Math.round(this._y);
    };

    Game_Character.prototype.turnRight45 = function () {
        this.setDirection(turnRight45(this.direction));
    };

    Game_Character.prototype.turnLeft45 = function () {
        this.setDirection(turnLeft45(this.direction));
    };

    Game_CharacterBase.prototype.executeMove = function (direction) {
        if (isDiagonalDir(direction)) {
            const hv = OcRam.Movement.getHorzVert(direction);
            this.moveDiagonally(hv[0], hv[1]);
        } else {
            this.moveStraight(direction);
        }
    };

    Game_CharacterBase.prototype.isCollidedWithEvents_OC = function (x, y, d, mx, my) {

        if (this.isPlayer()) {
            if (this.isInAirship()) return false;
            let idir = this.getInputDirection();
            if (isDiagonalDir(idir)) return false;
        }

        let events = $gameMap.eventsXyNt(x, y);
        let ret = events.some(event => event.isNormalPriority());

        ret = ret && ((mx < 0.5 && my < 0.1) || (my < 0.5 && mx < 0.1));

        if (!ret) {
            switch (d) {
                case 2: case 8:
                    if (mx > 0.5 && my < 0.1) {
                        events = $gameMap.eventsXyNt(x + 1, y);
                        ret = events.some(event => event.isNormalPriority());
                    } break;
                case 4: case 6:
                    if (my > 0.5 && mx < 0.1) {
                        events = $gameMap.eventsXyNt(x, y + 1);
                        ret = events.some(event => event.isNormalPriority());
                    } break;
            }
        }

        return ret;

    };

    Game_Map.prototype.roundXSPWithDirection = function (x, d) {
        return this.roundX(x + (d === 6 ? SP_GRID : d === 4 ? -SP_GRID : 0));
    };

    Game_Map.prototype.roundYSPWithDirection = function (y, d) {
        return this.roundY(y + (d === 2 ? SP_GRID : d === 8 ? -SP_GRID : 0));
    };

    Game_Map.prototype.xSPWithDirection = function (x, d) {
        return x + (d === 6 ? SP_GRID : d === 4 ? -SP_GRID : 0);
    };

    Game_Map.prototype.ySPWithDirection = function (y, d) {
        return y + (d === 2 ? SP_GRID : d === 8 ? -SP_GRID : 0);
    };

    // ------------------------------------------------------------------------------
    // Aliases
    // ==============================================================================
    if (_pixelMovementEnabled) {

        const _specialAliases = [
            Game_Map.prototype.autotileType,
            Game_Map.prototype.checkLayeredTilesFlags,
            Game_Map.prototype.eventIdXy,
            Game_Map.prototype.eventsXy,
            Game_Map.prototype.eventsXyNt,
            Game_Map.prototype.regionId,
            Game_Map.prototype.terrainTag,
            Game_Map.prototype.tileEventsXy,
            Game_Player.prototype.startMapEvent,
            Game_Vehicle.prototype.isLandOk
        ]; // Only parameters are manipulated... We need integers NOT floats...

        Game_Map.prototype.autotileType = function (x, y) {
            return _specialAliases[0].call(this, Math.round(x), Math.round(y));
        }; Game_Map.prototype.checkLayeredTilesFlags = function (x, y, bit) {
            return _specialAliases[1].call(this, Math.round(x), Math.round(y), bit);
        }; Game_Map.prototype.eventIdXy = function (x, y) {
            return _specialAliases[2].call(this, Math.round(x), Math.round(y));
        }; Game_Map.prototype.eventsXy = function (x, y) {
            return _specialAliases[3].call(this, Math.round(x), Math.round(y));
        }; Game_Map.prototype.eventsXyNt = function (x, y) {
            return _specialAliases[4].call(this, Math.round(x), Math.round(y));
        }; Game_Map.prototype.regionId = function (x, y) {
            return _specialAliases[5].call(this, Math.round(x), Math.round(y));
        }; Game_Map.prototype.terrainTag = function (x, y) {
            return _specialAliases[6].call(this, Math.round(x), Math.round(y));
        }; Game_Map.prototype.tileEventsXy = function (x, y) {
            return _specialAliases[7].call(this, Math.round(x), Math.round(y));
        }; Game_Player.prototype.startMapEvent = function (x, y, triggers, normal) {
            return _specialAliases[8].call(this, Math.round(x), Math.round(y), triggers, normal);
        }; Game_Vehicle.prototype.isLandOk = function (x, y, d) {
            return _specialAliases[9].call(this, Math.round(x), Math.round(y), d);
        };

        this.extend(Game_Player, "increaseSteps", function () {
            _this["Game_Player_increaseSteps"].apply(this, arguments);
            if (!this._followers.areMoving()) {
                this._followers.updateMove();
            } if (_stepsToTrigger > 0) _stepsToTrigger -= 1;
        });

        this.extend(Game_Player, "jump", function () {
            if (this._x % 1 != 0 || this._y % 1 != 0) this.centerToTile();
            _this["Game_Player_jump"].apply(this, arguments);
        });

        if (_centerOnGather) {
            this.extend(Game_Followers, "gather", function () {
                if (this._x % 1 != 0 || this._y % 1 != 0) {
                    $gamePlayer.centerToTile();
                    requestAnimationFrame(() => {
                        _this["Game_Followers_gather"].apply(this, arguments);
                    });
                } else {
                    _this["Game_Followers_gather"].apply(this, arguments);
                }
            });
        }

        this.extend(Game_Vehicle, "getOn", function () {
            _this["Game_Vehicle_getOn"].apply(this, arguments);
            if (this.isAirship()) $gamePlayer._pixelMovementDisabled = true;
        });

        this.extend(Game_Vehicle, "getOff", function () {
            _this["Game_Vehicle_getOff"].apply(this, arguments);
            if (this.isAirship()) $gamePlayer._pixelMovementDisabled = !_pixelMovementEnabled;
        });

        // New method
        Game_CharacterBase.prototype.pos_OC = function (x, y) {
            return Math.round(this._x) === Math.round(x) && Math.round(this._y) === Math.round(y);
        };

    }

    this.extend(Game_CharacterBase, "initMembers", function () {
        _this["Game_CharacterBase_initMembers"].apply(this, arguments);
        if (!this.isEvent()) {
            this._pixelMovementDisabled = !_pixelMovementEnabled;
            this._diagonalMovementDisabled = false;
        }
    });

    this.extend(Game_CharacterBase, "moveStraight", function (d) {

        this._hvDir = false;

        if (_pixelMovementEnabled && !this._pixelMovementDisabled) { /* Override */

            const rx = roundUpSPX(this._x, d);
            const ry = roundUpSPY(this._y, d);

            const mx = this._x % 1;
            const my = this._y % 1;

            const ux = $gameMap.roundXWithDirection(rx, d);
            const uy = $gameMap.roundYWithDirection(ry, d);

            let suc = false;

            if (this.isCollidedWithEvents_OC(ux, uy, d, mx, my)) {
                /* do nada... */
            } else {
                suc = this.canPass(rx, ry, d);
                if (suc) { // Glide for smoother movement
                    if (this._x % 1 != 0 && (d == 8 || d == 2)) {
                        suc = this.canPass(roundUpSPX(this._x + 1, d), ry, d);
                        if (!suc) { this.moveStraight(4); return; }
                    } else if (this._y % 1 != 0 && (d == 4 || d == 6)) {
                        suc = this.canPass(rx, roundUpSPY(this._y + 1, d), d);
                        if (!suc) { this.moveStraight(8); return; }
                    }
                } else {
                    if (this._x % 1 != 0 && (d == 8 || d == 2)) {
                        suc = this.canPass(roundUpSPX(this._x + 1, d), ry, d);
                        if (suc) { this.moveStraight(6); return; }
                    } else if (this._y % 1 != 0 && (d == 4 || d == 6)) {
                        suc = this.canPass(rx, roundUpSPY(this._y + 1, d), d);
                        if (suc) { this.moveStraight(2); return; }
                    }
                }
            }

            this.setMovementSuccess(suc);

            if (this.isMovementSucceeded()) {
                this.setDirection(d);
                this._x = $gameMap.roundXSPWithDirection(this._x, d);
                this._y = $gameMap.roundYSPWithDirection(this._y, d);
                this._realX = $gameMap.xSPWithDirection(this._x, this.reverseDir(d));
                this._realY = $gameMap.ySPWithDirection(this._y, this.reverseDir(d));
                this.increaseSteps();
            } else {
                this.setDirection(d);
                this.checkEventTriggerTouchFront(d);
            }

        } else {
            _this["Game_CharacterBase_moveStraight"].apply(this, arguments);
        }

    });

    if (_adjustDiagonalSpeed) {
        this.extend(Game_CharacterBase, "distancePerFrame", function () {
            let distance = _this["Game_CharacterBase_distancePerFrame"].apply(this, arguments);
            if (this._hvDir) distance *= 0.8; return distance;
        });
    }

    this.extend(Game_Character, "turnAwayFromCharacter", function (character) {
        if (this._diagonalMovementDisabled) {
            _this["Game_Character_turnAwayFromCharacter"].apply(this, arguments);
        } else {
            const sx = this.deltaXFrom(character.x);
            const sy = this.deltaYFrom(character.y);
            if (sx !== 0 && sy !== 0) {
                if (sx < 0 && sy > 0) { this._hvDir = [4, 2]; }
                if (sx > 0 && sy > 0) { this._hvDir = [6, 2]; }
                if (sx < 0 && sy < 0) { this._hvDir = [4, 8]; }
                if (sx > 0 && sy < 0) { this._hvDir = [6, 8]; }
            } else {
                if (Math.abs(sx) > Math.abs(sy)) {
                    this.setDirection(sx > 0 ? 6 : 4);
                } else if (sy !== 0) {
                    this.setDirection(sy > 0 ? 2 : 8);
                }
            }
        }
    });

    this.extend(Game_Character, "turnTowardCharacter", function (character) {
        if (this._diagonalMovementDisabled) {
            _this["Game_Character_turnTowardCharacter"].apply(this, arguments);
        } else {
            const sx = this.deltaXFrom(character.x);
            const sy = this.deltaYFrom(character.y);
            if (sx !== 0 && sy !== 0) {
                if (sx > 0 && sy < 0) { this._hvDir = [4, 2]; }
                if (sx < 0 && sy < 0) { this._hvDir = [6, 2]; }
                if (sx > 0 && sy > 0) { this._hvDir = [4, 8]; }
                if (sx < 0 && sy > 0) { this._hvDir = [6, 8]; }
            } else {
                if (Math.abs(sx) > Math.abs(sy)) {
                    this.setDirection(sx > 0 ? 4 : 6);
                } else if (sy !== 0) {
                    this.setDirection(sy > 0 ? 8 : 2);
                }
            }
        }
    });

    this.extend(Game_Player, "executeMove", function (direction) {
        if (isDiagonalDir(direction)) {
            const hv = getHorzVert(direction);
            this.moveDiagonally(hv[0], hv[1]);
        } else {
            _this["Game_Player_executeMove"].apply(this, arguments);
        }
    });

    this.extend(Game_Actor, "checkFloorEffect", function () {
        if ($gamePlayer.isOnDamageFloor()) {
            if (_stepsToTrigger < 1) {
                _this["Game_Actor_checkFloorEffect"].apply(this, arguments);
                _stepsToTrigger = 4;
            }
        }
    });

    this.extend(Game_Player, "clearTransferInfo", function () {
        _stepsToTrigger = 4; _this["Game_Player_clearTransferInfo"].apply(this, arguments);
    });

    this.extend(Game_Event, "initialize", function () {

        _this["Game_Event_initialize"].apply(this, arguments);

        this._pixelMovementDisabled = !_defaultToPixel;
        if (!_pixelMovementEnabled) this._pixelMovementDisabled = true;
        this._diagonalMovementDisabled = !_defaultToDiagonal;

        if (this.event() && this.event().meta) {
            const mm = this.event().meta.movement;
            if (mm) {
                switch (mm.toLowerCase()) {
                    case "pixel": this._pixelMovementDisabled = false; this._diagonalMovementDisabled = false; break;
                    case "diagonal": this._diagonalMovementDisabled = false; break;
                    case "normal": this._pixelMovementDisabled = true; this._diagonalMovementDisabled = true; break;
                }
            }
        }

    });

    this.extend(Game_Event, "start", function () {
        if (_pixelMovementEnabled && (this._trigger == 1 || this._trigger == 2)) {
            if (_stepsToTrigger > 0) return;
            _stepsToTrigger = 4;
        } _this["Game_Event_start"].apply(this, arguments);
    });

    this.extend(Game_Character, "moveRandom", function () {
        if (this._diagonalMovementDisabled) {
            _this["Game_Character_moveRandom"].apply(this, arguments);
        } else {
            const d = _dirArr[Math.randomInt(8)];
            if (isDiagonalDir(d)) {
                const hv = getHorzVert(d); this.moveDiagonally(hv[0], hv[1]);
            } else {
                this.moveStraight();
            }
        }
    });

    // ------------------------------------------------------------------------------
    // Overrides
    // ==============================================================================
    if (_pixelMovementEnabled) {

        Game_Player.prototype.forceMoveForward = function () {
            this.setThrough(true);
            this._pixelMovementDisabled = true;
            this.moveForward();
            this._pixelMovementDisabled = !_pixelMovementEnabled;
            this.setThrough(false);
        };

        Game_Vehicle.prototype.pos = function (x, y) {
            if (this._mapId === $gameMap.mapId()) {
                if (!this._driving) {
                    return Game_Character.prototype.pos_OC.call(this, x, y);
                } else {
                    return Game_Character.prototype.pos.call(this, x, y);
                }
            } else {
                return false;
            }
        };

        Game_Player.prototype.getOnVehicle = function () {
            const direction = this.direction();
            const x1 = Math.round(this.x);
            const y1 = Math.round(this.y);
            const x2 = $gameMap.roundXWithDirection(x1, direction);
            const y2 = $gameMap.roundYWithDirection(y1, direction);
            if ($gameMap.airship().pos(x1, y1)) {
                this._vehicleType = "airship";
            } else if ($gameMap.ship().pos(x2, y2)) {
                this._vehicleType = "ship";
            } else if ($gameMap.boat().pos(x2, y2)) {
                this._vehicleType = "boat";
            }
            if (this.isInVehicle()) {
                this._vehicleGettingOn = true;
                if (!this.isInAirship()) {
                    this.forceMoveForward();
                }
                this.gatherFollowers();
            }
            return this._vehicleGettingOn;
        };

        /*Game_Follower.prototype.chaseCharacter = function (character) {
            const sx = this.deltaXFrom(character.x); const sy = this.deltaYFrom(character.y);
            if ((sy > -_followerGap && sy < _followerGap) && (sx > -_followerGap && sx < _followerGap)) return;
            if (sx !== 0 && sy !== 0) {
                this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
            } else if (sx !== 0) {
                this.moveStraight(sx > 0 ? 4 : 6);
            } else if (sy !== 0) {
                this.moveStraight(sy > 0 ? 8 : 2);
            }
            this.setMoveSpeed($gamePlayer.realMoveSpeed());
        };*/

    }

    Game_Character.prototype.moveTowardCharacter = function (character) {
        this.turnTowardCharacter(character); this.executeMove(this._direction);
    };

    Game_Character.prototype.moveAwayFromCharacter = function (character) {
        this.turnAwayFromCharacter(character); this.executeMove(this._direction);
    };

    Game_CharacterBase.prototype.moveDiagonally = function (horz, vert) {

        this._hvDir = [horz, vert];

        let suc = this.canPassDiagonally(roundUpSPX(this._x, horz), roundUpSPY(this._y, vert), horz, vert);
        let inv = false;

        if (!suc) { // Diagonal pass failed ...Can pass horz / vert?

            if (vert == 8) {
                if (!this.canPass(roundUpSPX(this._x, horz), roundUpSPY(this._y, horz) + 1, horz)) inv = true;
            } else {
                if (!this.canPass(roundUpSPX(this._x, horz), roundUpSPY(this._y, horz) - 1, horz)) inv = true;
            }

            if (inv) {
                suc = this.canPass(roundUpSPX(this._x, horz), roundUpSPY(this._y, horz), horz);
                if (suc) { this.moveStraight(horz); return; }
                suc = this.canPass(roundUpSPX(this._x, vert), roundUpSPY(this._y, vert), vert);
                if (suc) { this.moveStraight(vert); return; }
            } else {
                suc = this.canPass(roundUpSPX(this._x, vert), roundUpSPY(this._y, vert), vert);
                if (suc) { this.moveStraight(vert); return; }
                suc = this.canPass(roundUpSPX(this._x, horz), roundUpSPY(this._y, horz), horz);
                if (suc) { this.moveStraight(horz); return; }
            }

        }

        this.setMovementSuccess(suc);

        if (this.isMovementSucceeded()) {
            if (_pixelMovementEnabled && !this._pixelMovementDisabled) {
                this._x = $gameMap.roundXSPWithDirection(this._x, horz);
                this._y = $gameMap.roundYSPWithDirection(this._y, vert);
                this._realX = $gameMap.xSPWithDirection(this._x, this.reverseDir(horz));
                this._realY = $gameMap.ySPWithDirection(this._y, this.reverseDir(vert));
            } else {
                this._x = $gameMap.roundXWithDirection(this._x, horz);
                this._y = $gameMap.roundYWithDirection(this._y, vert);
                this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
                this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
            }
            this.increaseSteps();
        }

        if (this._direction === this.reverseDir(horz)) {
            this.setDirection(horz);
        }

        if (this._direction === this.reverseDir(vert)) {
            this.setDirection(vert);
        }

    };

    Game_CharacterBase.prototype.canPassDiagonally = function (x, y, horz, vert) {
        const x2 = $gameMap.roundXWithDirection(x, horz);
        const y2 = $gameMap.roundYWithDirection(y, vert);
        if (this.canPass(x, y, vert) && this.canPass(x, y2, horz) &&
            this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
            return true;
        } return false;
    };

    Game_Character.prototype.findDirectionTo = function (goalX, goalY) {

        const searchLimit = this.searchLimit();
        const mapWidth = $gameMap.width();
        const nodeList = [];
        const openList = [];
        const closedList = [];
        const start = {};
        let best = start;

        let hv = []; let x2 = 0; let y2 = 0;

        if (this.x === goalX && this.y === goalY) return 0;

        start.parent = null;
        if (_pixelMovementEnabled) {
            start.x = Math.round(this.x);
            start.y = Math.round(this.y);
        } else {
            start.x = this.x;
            start.y = this.y;
        }
        
        start.g = 0;
        start.f = $gameMap.distance(start.x, start.y, goalX, goalY);

        nodeList.push(start);
        openList.push(start.y * mapWidth + start.x);

        while (nodeList.length > 0) {

            let bestIndex = 0;

            for (let i = 0; i < nodeList.length; i++) {
                if (nodeList[i].f < nodeList[bestIndex].f) {
                    bestIndex = i;
                }
            }

            const current = nodeList[bestIndex];
            const x1 = current.x;
            const y1 = current.y;
            const pos1 = y1 * mapWidth + x1;
            const g1 = current.g;

            nodeList.splice(bestIndex, 1);
            openList.splice(openList.indexOf(pos1), 1);
            closedList.push(pos1);

            if (current.x === goalX && current.y === goalY) {
                best = current; break;
            }

            if (g1 >= searchLimit) continue;

            for (let j = 0; j < 8; j++) {

                const direction = _dirArr[j];
                const diagonal = isDiagonalDir(direction);

                if (diagonal) {
                    x2 = $gameMap.roundXWithDirection(x1, (direction == 3 || direction == 9) ? 6 : 4);
                    y2 = $gameMap.roundYWithDirection(y1, (direction == 7 || direction == 9) ? 8 : 2);
                } else {
                    x2 = $gameMap.roundXWithDirection(x1, direction);
                    y2 = $gameMap.roundYWithDirection(y1, direction);
                }

                const pos2 = y2 * mapWidth + x2;

                if (closedList.includes(pos2)) continue;

                if (diagonal) {
                    hv = getHorzVert(direction);
                    if (!this.canPassDiagonally(x1, y1, hv[0], hv[1])) continue;
                } else {
                    if (!this.canPass(x1, y1, direction)) continue;
                }

                const g2 = g1 + 1;
                const index2 = openList.indexOf(pos2);

                if (index2 < 0 || g2 < nodeList[index2].g) {
                    let neighbor = {};
                    if (index2 >= 0) {
                        neighbor = nodeList[index2];
                    } else {
                        nodeList.push(neighbor);
                        openList.push(pos2);
                    }
                    neighbor.parent = current;
                    neighbor.x = x2;
                    neighbor.y = y2;
                    neighbor.g = g2;
                    neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                    if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                        best = neighbor;
                    }
                }

            }

        }

        let node = best;
        while (node.parent && node.parent !== start) {
            node = node.parent;
        }

        const deltaX1 = $gameMap.deltaX(node.x, start.x);
        const deltaY1 = $gameMap.deltaY(node.y, start.y);

        if (deltaY1 > 0) {
            return (deltaX1 < 0) ? 1 : (deltaX1 > 0) ? 3 : 2;
        } else if (deltaX1 < 0) {
            return (deltaY1 < 0) ? 7 : (deltaY1 > 0) ? 1 : 4;
        } else if (deltaX1 > 0) {
            return (deltaY1 < 0) ? 9 : (deltaY1 > 0) ? 3 : 6;
        } else if (deltaY1 < 0) {
            return (deltaX1 < 0) ? 7 : (deltaX1 > 0) ? 9 : 8;
        }

        // If dead end...
        const deltaX2 = this.deltaXFrom(goalX);
        const deltaY2 = this.deltaYFrom(goalY);
        const daX = Math.abs(deltaX2);
        const daY = Math.abs(deltaY2);

        if (daX == 1 && daY == 0.5) { this.moveStraight(2); return 2; }
        if (daX == 0.5 && daY == 1) { this.moveStraight(6); return 6; }

        if (daX > daY) {
            return deltaX2 > 0 ? (deltaY2 > 0 ? 7 : deltaY2 < 0 ? 1 : 4) : (deltaY2 > 0 ? 9 : deltaY2 < 0 ? 3 : 6);
        } else if (deltaY2 !== 0) {
            return deltaY2 > 0 ? (deltaX2 > 0 ? 7 : deltaX2 < 0 ? 9 : 8) : (deltaX2 > 0 ? 1 : deltaX2 < 0 ? 3 : 2);
        }

        

        return 0;

    };

    Game_Player.prototype.getInputDirection = function () {
        return Input.dir8;
    };

    // ------------------------------------------------------------------------------
    // Core "must overrides"
    // ==============================================================================
    this.clearPluginData = () => { };
    this.loadPluginData = gs => { };
    this.savePluginData = gs => { };
    this.onMapStart = sm => { };
    this.onMapTerminate = sm => { };
    this.createLowerMapLayer = sm => { };
    this.createLowerBattleLayer = sb => { };
    this.onMapLoaded = sm => { };

    // ------------------------------------------------------------------------------
    // Plugin commands
    // ==============================================================================
    /*PluginManager.registerCommand("OcRam_" + this.name, "command", function (args) {
        _this.debug("Plugin command: command", args);
    });*/

}.bind(OcRam.Movement)());