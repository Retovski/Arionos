//===========================================================================
//=== TSR_MapPopups === A Plugin by The Northern Frog =======================
//===========================================================================

var TSR = TSR || {};
TSR.mapPopups = TSR.mapPopups || {};
TSR.mapPopups.version = 1.39;
TSR.mapPopups.pluginName = 'TSR_MapPopups';

var Imported = Imported || {};
Imported[TSR.mapPopups.pluginName] = true;

//===========================================================================

/*:
 * @target MZ
 * @plugindesc v1.3.9 This Plugin add popups on the map to show text, items,
 *                    gold or damage/recovery.
 * @author TSR, The Northern Frog, 2021      
 * @help 
 * ==========================================================================
 * == About this Plugin =====================================================
 * ==========================================================================
 * Use the following Plugin Commands to display map popups.
 * 
 *     -START TEXT POPUP
 *              Text: The text to be displayed by the popup.
 *                      *You can use the following escape characters
 *                       in text popups: \V[x], \N[x], \P[x] and \G
 * 
 *            Target: The event Id of the target on which the popup will
 *                    show (set it to 0 for targeting the Player).
 *        Text color: The text color code to change the color of the 
 *                    popup text.
 * 
 *     -START ITEM POPUP
 *            Target: The event Id of the target on which the popup will
 *                    show (set it to 0 for targeting the Player).
 *          Category: The item category (Items, Weapons or Armors).
 *           Item Id: The database Id of the item.
 *          Quantity: The quantity displayed with the item.
 *        Text color: The text color code to change the color of the 
 *                    popup text.
 *      Apply effect: When set to true, the plugin will make the change
 *                    in the inventory in addition to showing the popup.
 * 
 *     -START GOLD POPUP
 *            Target: The event Id of the target on which the popup will
 *                    show (set it to 0 for targeting the Player).
 *            Amount: The amount of gold to be displayed by the popup.
 *        Text color: The text color code to change the color of the 
 *                    popup text.
 *              Icon: The icon index of you gold icon, if any.
 *                    (leave it to 0 if none)
 *      Apply effect: When set to true, the plugin will make the change
 *                    in the party gold in addition to showing the popup.
 * 
 *     -START DAMAGE POPUP
 *            Target: The event Id of the target on which the popup will
 *                    show (set it to 0 for targeting the Player).
 *       Damage type: The damage type. This change the text color, and
 *                    will be use as suffix if you use that option.
 *      Damage value: The value that is to be displayed by the popup.
 *                    Use negatives values for recovery popups. This will
 *                    change the text color accordingly.
 *                          *you can use the escape code \V[x] to set
 *                           the damage to a variable value
 * 
 *      Apply effect: When set to true, the plugin will make the change
 *                    to party status in addition to showing the popup.
 *                    (no effect on events)
 *      Affect party: When set to true, the effect will affect the whole
 *                    party, not just the player (Apply effect must be true).
 * 
 * 
 * 
 * POPUPS DURATION
 * ===============
 * The default duration of the map popups is 60 frames. This can be changed
 * for all popups within the parameters. Alternatively, all popups commands
 * have the 'Duration' argument. This argument will overwrite the setting
 * in the parameters so you can set specific duration for eacb popups.
 * 
 *  *The minimal value for popups duration is 60 frames, because anything
 *   bellow that doesn't look good.
 * 
 * 
 * 
 * POPUPS POSITION
 * ===============
 * Map popups will appear just above their targeted characters. This is
 * meant for default 48x48 images. If you're using images of a different
 * size, you may want to change the popups position. This can be done
 * in the general parameters (see next section), or by setting specific
 * offset for each popups through the plugin commands.
 * 
 * In addition to the above, all popups have the followings commands:
 * 
 *       Position X: set the horizontal offset* in pixel, relative to
 *                   the targeted character position.
 *  
 *       Position Y: set the vertical offset* in pixel, relative to
 *                   the targeted character position.
 * 
 * 
 *    *the value entered in the commands are offset values. To make
 *     the popup appear at an absolute position on the screen, use
 *     the keyword 'pos' along with the value.
 * 
 *          Example:
 *            
 *             Position X: 100
 * 
 *                  The above will make the popup appear 100 pixels
 *                  on the right of the targeted character.
 * 
 *             Position X: pos 100
 * 
 *                  Adding 'pos' with the value will make the popup
 *                  appear at 100 pixels from the left of the screen.
 *                  You can add 'pos' before or after the value, and
 *                  white spaces doesn't matter.
 * 
 * 
 *    **The position values entered in the plugin command will overide
 *      the position settings of the general parameters, if any.
 *   
 *         
 * 
 * PLUGIN PARAMETERS
 * =================
 * Set the following parameters to your liking in the Plugin Manager.
 * 
 *     -POPUPS OFFSET X
 *         Add an horizontal offset in pixels to all popups. This
 *         is relative to the targeted event/player position. 
 * 
 *     -POPUPS OFFSET Y
 *         Add a vertical offset in pixels to all popups. This
 *         is relative to the targeted event/player position.
 * 
 *     -SHOW CURRENCY UNIT
 *         Show the default currency unit in gold popups?
 * 
 *     -CURRENCY ABBREVIATION
 *         Enter the currency abbreviation to be used in the gold
 *         popups if your currency unit name in the database is too
 *         long. Leave that parameter blank to use the database cur-
 *         rency unit as is.
 * 
 *     -DAMAGE POPUP PREFIX
 *         Show an operator in front of the value of damage popups
 *         to indicate gain or loss?
 * 
 *     -DAMAGE POPUP SUFFIX
 *         Show the damage type following the value of damage popups?
 * 
 * 
 * 
 * AUTO ITEM POPUPS
 * ================
 * When this parameter is set to true, item popups will show auto-
 * matically when you use the event command 'Change Item' to add
 * or remove items from the party inventory. No matter how you set
 * the parameters, you can always toggle on and off this feature with
 * the following script call:
 * 
 *          $gameSystem.setAutoItemPopups(set)
 * 
 *              *replace 'set' by true or false.
 * 
 *      ITEM COLOR TAGS
 *      ===============
 *      When using the 'Auto Item Popup' feature, the plugin will check
 *      for color meta tag in the Items database noteboxes to assign
 *      text color for the auto popups. The colors set in the tag can
 *      be either one of the default window colors (1 to 31), or an hex
 *      value. If there's no color meta tags, the color will be 0 (white).
 * 
 * 
 * 
 * AUTO GOLD POPUPS
 * ================
 * When this parameter is set to true, gold popups will show auto-
 * matically when you use the event command 'Change Gold' to add or
 * remove gold from the party. There's a parameter to set the text
 * color and icon index of the auto gold popups. No matter how you
 * set the parameters, you can always toggle on and off this feature 
 * with the following script call:
 * 
 *          $gameSystem.setAutoGoldPopups(set)
 * 
 *              *replace 'set' by true or false.
 *
 * 
 * 
 * AUTO EXP POPUPS
 * ================
 * When this parameter is set to true, a text popup will show auto-
 * matically when you use the event command 'Change Exp'. There's a 
 * parameter to set the text color of the auto exp popups. If the 
 * gain/loss of exp leads to a level up or down, an additional popup
 * will show the gain/loss in levels. No matter how you set the 
 * parameters, you can always toggle on and off this feature  with 
 * the following script call:
 * 
 *          $gameSystem.setAutoExpPopups(set)
 * 
 *              *replace 'set' by true or false.
 * 
 * 
 * DAMAGE POPUPS MOTION
 * ====================
 * When this parameter is turned ON, the damage popups will move in
 * a similar way than the default damage popups in battle (each digits
 * makes a short drop, than tilt a bit and fade out). You can turn this
 * parameter OFF if you want the damage popups to move like other map 
 * popups of this plugin (digits makes a drop, tilt, than rise up as 
 * they fade out).
 * 
 * 
 * 
 * SCRIPT CALLS
 * ============
 * Alternatively, those script calls can be used:
 * 
 *   **character can be either $gamePlayer or $gameMap._events[eventId]
 *   **to target a specific follower, use: $gamePlayer.followers().follower(index)
 * 
 *     -character.startTextPopup(text, color)
 *             text: Text to be displayed
 *            color: Text color code       
 * 
 *     -character.startItemPopup(category, itemId, quantity, color, goldIndex, apEffect)
 *         category: Item category ('ITEMS', 'WEAPONS' or 'ARMORS')
 *           itemId: Item Id in the database
 *         quantity: Quantity of the item
 *            color: Text color code
 *        goldIndex: Gold icon index
 *         apEffect: Apply the change to party inventory
 * 
 *              *For gold popups, use the same call and set itemId to 0, and
 *               set any category.
 * 
 *     -character.startDamageMapPopup(type, value, apEffect, affectAll) 
 *             type: Damage type ('hp', 'mp' or 'tp')
 *            value: Damage value. Use positive values for damages, and
 *                   negatives values for recovery. You can use \V[x]
 *                   to assign a variable value as damage
 *         apEffect: Apply the change to party inventory
 *        affectAll: Apply effect to the whole party (apEffect must be true)
 * 
 * 
 * 
 * =========================================================================
 * == Term of Usage ========================================================
 * =========================================================================
 * 
 * Use in any independant RPG Maker MZ projects, including commercials.
 *
 * Credit is required for using this Plugin. 
 * For crediting, use 'TSR' along with one of
 * the following terms: 
 *      'The Northern Frog' or 'A frog from the north'
 * 
 * Do not change the Header or the Terms of usage.
 *
 * DO NOT REDISTRIBUTE!
 * If you want to share it, share the link to my itch.io account: 
 * https://the-northern-frog.itch.io/
 * 
 *
 * ==========================================================================
 * == Dev Log ===============================================================
 * ==========================================================================
 * 12/02/21 completed plugin,                                     v1.00
 * 14/02/21 add 'apply effect' and 'affect all' arguments,        v1.01
 * 08/08/21 add escape characters for text popups,                v1.02
 * 15/08/21 add currency abbreviation and accord damage popups
 *          suffixes to the TextManager entries and positions
 *          parameters for popups,                                v1.12
 * 02/09/21 add the popup duration parameter and command argument v1.22
 * 23/09/21 add the auto item popup feature and item meta colors  v1.23
 * 24/09/21 fix problem with item meta colors                     v1.24
 * 26/09/21 add the option to target the calling event itself     v1.25
 * 28/09/21 add the auto popups feature to gold and exp           v1.35
 * 29/09/21 change the damage popups motion                       v1.36
 * 01/10/21 fix damage popups stacking up                         v1.37
 * 14/10/21 fix stacking up of non auto popups                    v1.38
 * 17/10/21 disable the auto popups when changing equipments      v1.39
 * 
 * ==========================================================================
 * == END ===================================================================                                           
 * ==========================================================================
 *
 *                              "Have fun!"
 *                                                  TSR, The Northern Frog
 *
 * ==========================================================================
 *
 * @param ---General---
 *
 * @param Popups Duration
 * @parent ---General---
 * @type number
 * @min 60
 * @desc Enter the duration of all popups in frames.
 * Default: 60
 * @default 60
 * 
 * @param Popups Offset X
 * @parent ---General---
 * @desc Enter the horizontal offset for all popups.
 * @default
 * 
 * @param Popups Offset Y
 * @parent ---General---
 * @desc Enter the vertical offset for all popups.
 * @default
 * 
 * @param Show Currency Unit
 * @parent ---General---
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Show currency unit in gold popups?
 * OFF - false  ON - true
 * @default true
 * 
 * @param Currency Abbreviation
 * @parent ---General---
 * @desc Enter the currency abbreviation for the gold popups.
 * Leave it blank to use the database currency unit entry.
 * @default
 * 
 * @param Damage Popups Prefix
 * @parent ---General---
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Show an operator (+ or -) before damage/recovery popups?
 * OFF - false  ON - true
 * @default true
 * 
 * @param Damage Popups Suffix
 * @parent ---General---
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Show the damage type after the damage values?
 * OFF - false  ON - true
 * @default true
 * 
 * 
 * @param ---Item Popups---
 * 
 * @param Auto Item Popups
 * @parent ---Item Popups---
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Enable auto item popups with the Change Items event command?
 * OFF - false  ON - true
 * @default false
 *   
 *
 * @param ---Gold Popups---
 * 
 * @param Auto Gold Popups
 * @parent ---Gold Popups---
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Enable auto gold popups with the Change Gold event command?
 * OFF - false  ON - true
 * @default false
 * 
 * @param Auto Gold Color
 * @parent ---Gold Popups---
 * @type number
 * @min 0
 * @desc Enter the text color for gold popups.
 * Default: 0
 * @default 0
 * 
 * @param Auto Gold Icon
 * @parent ---Gold Popups---
 * @type number
 * @min 0
 * @desc Enter the icon index for gold popups (0 for none).
 * Default: 0
 * @default 0
 * 
 * 
 * @param ---Exp Popups---
 * 
 * @param Auto Exp Popups
 * @parent ---Exp Popups---
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Enable auto exp popups with the Change Exp event command?
 * OFF - false  ON - true
 * @default false
 * 
 * @param Exp Color
 * @parent ---Exp Popups---
 * @type number
 * @min 0
 * @desc Enter the text color for exp popups.
 * Default: 0
 * @default 0
 * 
 * 
 * @param ---Damage Popups---
 * 
 * @param Damage Motion
 * @parent ---Damage Popups---
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Enable the damage motion for damage opups digits?
 * OFF - false  ON - true
 * @default true
 * 
 * 
 * @command text
 * @text Start text popup
 * @desc Create a map popup with some text.
 * @min -1
 * @arg text
 * @default
 * @text Map popup text
 * @desc Set the text of the map popup.
 * 
 * @arg target
 * @type number
 * @min 0
 * @default 0
 * @text Target event Id
 * @desc Set the event Id of the target (0 for player).
 * 
 * @arg color
 * @type number
 * @min 0
 * @default 0
 * @text Text Color
 * @desc Set the text color of the popup.
 *
 * @arg duration
 * @type number
 * @min 0
 * @default
 * @text Popup Duration
 * @desc Set the duration of the popup (overwrite the parameter setting).
 * 
 * @arg posX
 * @default
 * @text Position X
 * @desc Set the horizontal position of the popup.
 * 
 * @arg posY
 * @default
 * @text Position Y
 * @desc Set the vertical position of the popup.
 * 
 * 
 * @command item
 * @text Start item popup
 * @desc Create a map popup that show an item name, icon and quantity.
 *
 * @arg target
 * @type number
 * @min -1
 * @default 0
 * @text Target event Id
 * @desc Set the event Id of the target (0 for player).
 * 
 * @arg category
 * @type combo
 * @option Items
 * @option Weapons
 * @option Armors
 * @default Items
 * @text Item category
 * @desc Set the category of the item popup.
 * 
 * @arg itemId
 * @type number
 * @min 1
 * @default 1
 * @text Item Id
 * @desc Set the database id of the item.
 * 
 * @arg quantity
 * @type number
 * @min -99
 * @max 99
 * @default 1
 * @text Item quantity
 * @desc Set the quantity of the item.
 *
 * @arg color
 * @type number
 * @min 0
 * @default 0
 * @text Text Color
 * @desc Set the text color of the popup.
 * 
 * @arg effect
 * @type boolean
 * @on ON
 * @off OFF
 * @text Apply effect
 * @desc Apply item quantity changes on party inventory?
 * OFF - false  ON - true
 * @default true
 * 
 * @arg duration
 * @type number
 * @min 0
 * @default
 * @text Popup Duration
 * @desc Set the duration of the popup (overwrite the parameter setting).
 * 
 * @arg posX
 * @default
 * @text Position X
 * @desc Set the horizontal position of the popup.
 * 
 * @arg posY
 * @default
 * @text Position Y
 * @desc Set the vertical position of the popup.
 * 
 * 
 * @command gold
 * @text Start gold popup
 * @desc Create a gold popup.
 *
 * @arg target
 * @type number
 * @min -1
 * @default 0
 * @text Target event Id
 * @desc Set the event Id of the target (0 for player).
 * 
 * @arg value
 * @type number
 * @min -999999
 * @default 1
 * @text Gold amount
 * @desc Set the amount of gold to show in the popup.
 * 
 * @arg color
 * @type number
 * @min 0
 * @default 0
 * @text Text Color
 * @desc Set the text color of the popup.
 * 
 * @arg icon
 * @type number
 * @min 0
 * @default 0
 * @text Gold icon
 * @desc Set the icon index for gold icon (0 for none).
 * 
 * @arg effect
 * @type boolean
 * @on ON
 * @off OFF
 * @text Apply effect
 * @desc Apply changes on party gold?
 * OFF - false  ON - true
 * @default true
 * 
 * @arg duration
 * @type number
 * @min 0
 * @default
 * @text Popup Duration
 * @desc Set the duration of the popup (overwrite the parameter setting).
 * 
 * @arg posX
 * @default
 * @text Position X
 * @desc Set the horizontal position of the popup.
 * 
 * @arg posY
 * @default
 * @text Position Y
 * @desc Set the vertical position of the popup.
 * 
 * 
 * @command damage
 * @text Start damage popup
 * @desc Create a map damage popup.
 *
 * @arg target
 * @type number
 * @min -1
 * @default 0
 * @text Target event Id
 * @desc Set the event Id of the target (0 for player).
 * 
* @arg category
 * @type combo
 * @option hp
 * @option mp
 * @option tp
 * @default hp
 * @text Damage type
 * @desc Set the damage type of the popup.
 * 
 * @arg value
 * @default 1
 * @text Damage value
 * @desc Set the amount of damage to show. (negative values for recovery)
 * 
 * @arg effect
 * @type boolean
 * @on ON
 * @off OFF
 * @text Apply effect
 * @desc Apply changes on Player?
 * OFF - false  ON - true
 * @default true
 * 
 * @arg all
 * @type boolean
 * @on ON
 * @off OFF
 * @text Affect all
 * @desc Apply changes on whole party?
 * OFF - false  ON - true
 * @default false
 * 
 * @arg duration
 * @type number
 * @min 0
 * @default
 * @text Popup Duration
 * @desc Set the duration of the popup (overwrite the parameter setting).
 * 
 * @arg posX
 * @default
 * @text Position X
 * @desc Set the horizontal position of the popup.
 * 
 * @arg posY
 * @default
 * @text Position Y
 * @desc Set the vertical position of the popup.
 * 
 * 
 */

(() => {
const _0x10cbb6=_0x3f29;(function(_0x104426,_0xdd440a){const _0x2a0e68=_0x3f29,_0x25c9ad=_0x104426();while(!![]){try{const _0xcf17a8=parseInt(_0x2a0e68(0x178))/0x1+parseInt(_0x2a0e68(0xd9))/0x2*(parseInt(_0x2a0e68(0xd7))/0x3)+parseInt(_0x2a0e68(0x156))/0x4*(parseInt(_0x2a0e68(0xe7))/0x5)+-parseInt(_0x2a0e68(0x103))/0x6+-parseInt(_0x2a0e68(0xf5))/0x7*(parseInt(_0x2a0e68(0xff))/0x8)+parseInt(_0x2a0e68(0x17a))/0x9*(-parseInt(_0x2a0e68(0xdd))/0xa)+parseInt(_0x2a0e68(0x183))/0xb*(-parseInt(_0x2a0e68(0x135))/0xc);if(_0xcf17a8===_0xdd440a)break;else _0x25c9ad['push'](_0x25c9ad['shift']());}catch(_0x4b53be){_0x25c9ad['push'](_0x25c9ad['shift']());}}}(_0x1b63,0x40a6e),TSR[_0x10cbb6(0x106)]=PluginManager[_0x10cbb6(0xde)](TSR[_0x10cbb6(0x115)]['pluginName']),TSR[_0x10cbb6(0x115)]['_popupDuration']=Number(TSR[_0x10cbb6(0x106)][_0x10cbb6(0x10e)])||0x3c,TSR['mapPopups'][_0x10cbb6(0xd2)]=String(TSR[_0x10cbb6(0x106)][_0x10cbb6(0x154)])||null,TSR[_0x10cbb6(0x115)][_0x10cbb6(0xd3)]=String(TSR['Parameters']['Popups\x20Offset\x20Y'])||null,TSR['mapPopups'][_0x10cbb6(0xcc)]=String(TSR[_0x10cbb6(0x106)]['Currency\x20Abbreviation'])||null,TSR[_0x10cbb6(0x115)][_0x10cbb6(0xe6)]=eval(String(TSR[_0x10cbb6(0x106)][_0x10cbb6(0x118)])),TSR['mapPopups']['_currencyAbb']=String(TSR[_0x10cbb6(0x106)][_0x10cbb6(0x121)])||null,TSR[_0x10cbb6(0x115)][_0x10cbb6(0x185)]=eval(String(TSR[_0x10cbb6(0x106)][_0x10cbb6(0xf9)])),TSR[_0x10cbb6(0x115)][_0x10cbb6(0x102)]=eval(String(TSR[_0x10cbb6(0x106)][_0x10cbb6(0xce)])),TSR['mapPopups'][_0x10cbb6(0xf8)]=eval(String(TSR[_0x10cbb6(0x106)][_0x10cbb6(0xdc)])),TSR[_0x10cbb6(0x115)][_0x10cbb6(0xeb)]=eval(String(TSR[_0x10cbb6(0x106)][_0x10cbb6(0x13e)])),TSR[_0x10cbb6(0x115)]['_autoGoldColor']=Number(TSR[_0x10cbb6(0x106)][_0x10cbb6(0xfe)])||0x0,TSR[_0x10cbb6(0x115)][_0x10cbb6(0x148)]=Number(TSR['Parameters']['Auto\x20Gold\x20Icon'])||0x0,TSR[_0x10cbb6(0x115)][_0x10cbb6(0x10a)]=eval(String(TSR[_0x10cbb6(0x106)][_0x10cbb6(0x153)])),TSR[_0x10cbb6(0x115)][_0x10cbb6(0xcd)]=Number(TSR[_0x10cbb6(0x106)]['Exp\x20Color'])||0x0,TSR[_0x10cbb6(0x115)][_0x10cbb6(0x15b)]=eval(String(TSR[_0x10cbb6(0x106)]['Damage\x20Motion'])),PluginManager['registerCommand'](TSR['mapPopups']['pluginName'],_0x10cbb6(0x11d),_0xef0607=>{const _0x35725b=_0x10cbb6,_0x1264e0=String(_0xef0607[_0x35725b(0x11d)]),_0x1f20cc=Number(_0xef0607[_0x35725b(0x11e)])<0x0?$gameMap[_0x35725b(0xcb)][_0x35725b(0xea)]:Number(_0xef0607[_0x35725b(0x11e)]),_0x5189ad=Number(_0xef0607['color']),_0xe18f77=Number(_0xef0607[_0x35725b(0x145)])||TSR[_0x35725b(0x115)][_0x35725b(0x176)],_0xa9cf8=String(_0xef0607[_0x35725b(0x13b)]),_0x21adb8=String(_0xef0607['posY']);let _0x444e99=_0x1f20cc?$gameMap['_events'][_0x1f20cc]:$gamePlayer;_0x444e99[_0x35725b(0x101)](_0x1264e0,_0x5189ad,_0xe18f77,_0xa9cf8,_0x21adb8);}),PluginManager[_0x10cbb6(0x162)](TSR[_0x10cbb6(0x115)][_0x10cbb6(0x158)],_0x10cbb6(0x16c),_0x5455e0=>{const _0x5901d2=_0x10cbb6,_0x584ce1=Number(_0x5455e0[_0x5901d2(0x177)]),_0x18dfa7=Number(_0x5455e0['quantity']),_0x3c828c=String(_0x5455e0['category']),_0x4a4a2e=Number(_0x5455e0[_0x5901d2(0x15c)]),_0x414456=eval(String(_0x5455e0[_0x5901d2(0xcf)])),_0x3c3845=Number(_0x5455e0[_0x5901d2(0x11e)])<0x0?$gameMap[_0x5901d2(0xcb)][_0x5901d2(0xea)]:Number(_0x5455e0['target']),_0xd705d3=Number(_0x5455e0[_0x5901d2(0x145)])||TSR[_0x5901d2(0x115)][_0x5901d2(0x176)],_0x2eee6a=String(_0x5455e0[_0x5901d2(0x13b)]),_0x584d4f=String(_0x5455e0[_0x5901d2(0xd1)]);let _0x211a87=_0x3c3845?$gameMap[_0x5901d2(0xfa)][_0x3c3845]:$gamePlayer;_0x211a87['startItemPopup'](_0x3c828c,_0x584ce1,_0x18dfa7,_0x4a4a2e,0x0,_0x414456,_0xd705d3,_0x2eee6a,_0x584d4f);}),PluginManager[_0x10cbb6(0x162)](TSR[_0x10cbb6(0x115)][_0x10cbb6(0x158)],_0x10cbb6(0x17b),_0x1e5c63=>{const _0x3085b8=_0x10cbb6,_0x3397e0=0x0,_0x438a55=Number(_0x1e5c63[_0x3085b8(0x127)]),_0x30a5b9=_0x3085b8(0x165),_0x4fa750=Number(_0x1e5c63['color']),_0x4c0a70=Number(_0x1e5c63[_0x3085b8(0x104)]),_0x15ccb7=eval(String(_0x1e5c63[_0x3085b8(0xcf)])),_0x557096=Number(_0x1e5c63[_0x3085b8(0x11e)])<0x0?$gameMap[_0x3085b8(0xcb)][_0x3085b8(0xea)]:Number(_0x1e5c63[_0x3085b8(0x11e)]),_0x205644=Number(_0x1e5c63[_0x3085b8(0x145)])||TSR[_0x3085b8(0x115)][_0x3085b8(0x176)],_0x1e4fdc=String(_0x1e5c63[_0x3085b8(0x13b)]),_0x90509d=String(_0x1e5c63[_0x3085b8(0xd1)]);let _0x2d88e2=_0x557096?$gameMap['_events'][_0x557096]:$gamePlayer;_0x2d88e2['startItemPopup'](_0x30a5b9,_0x3397e0,_0x438a55,_0x4fa750,_0x4c0a70,_0x15ccb7,_0x205644,_0x1e4fdc,_0x90509d);}),PluginManager['registerCommand'](TSR[_0x10cbb6(0x115)][_0x10cbb6(0x158)],_0x10cbb6(0x184),_0x275e0b=>{const _0x1415c1=_0x10cbb6,_0x1ebac1=String(_0x275e0b['category']),_0x42dc0c=String(_0x275e0b[_0x1415c1(0x127)]),_0xf54d26=eval(String(_0x275e0b[_0x1415c1(0xcf)])),_0x1a0ca5=eval(String(_0x275e0b[_0x1415c1(0x151)])),_0x374821=Number(_0x275e0b['target'])<0x0?$gameMap[_0x1415c1(0xcb)]['_eventId']:Number(_0x275e0b[_0x1415c1(0x11e)]),_0x4535e5=Number(_0x275e0b['duration'])||TSR[_0x1415c1(0x115)]['_popupDuration'],_0x5826aa=String(_0x275e0b[_0x1415c1(0x13b)]),_0x474bdb=String(_0x275e0b[_0x1415c1(0xd1)]);let _0x44820d=_0x374821?$gameMap[_0x1415c1(0xfa)][_0x374821]:$gamePlayer;_0x44820d['startDamageMapPopup'](_0x1ebac1,_0x42dc0c,_0xf54d26,_0x1a0ca5,_0x4535e5,_0x5826aa,_0x474bdb);}),TSR['mapPopups'][_0x10cbb6(0x170)]=ColorManager[_0x10cbb6(0xf4)],ColorManager[_0x10cbb6(0xf4)]=function(_0xef0c71){const _0x621f9f=_0x10cbb6;if(_0xef0c71>0x3)switch(_0xef0c71){case 0x4:return _0x621f9f(0x143);case 0x5:return _0x621f9f(0x17c);default:return'#808080';}else return TSR['mapPopups'][_0x621f9f(0x170)][_0x621f9f(0x109)](this,_0xef0c71);},Game_System[_0x10cbb6(0x12a)][_0x10cbb6(0x12f)]=function(_0x5a2bf4){const _0x50c4fe=_0x10cbb6;TSR[_0x50c4fe(0x115)][_0x50c4fe(0xf8)]=_0x5a2bf4;},Game_System[_0x10cbb6(0x12a)][_0x10cbb6(0x113)]=function(_0x5c1565){const _0x34978a=_0x10cbb6;TSR[_0x34978a(0x115)]['_autoGoldPopup']=_0x5c1565;},Game_System[_0x10cbb6(0x12a)][_0x10cbb6(0x12c)]=function(_0x43c2f6){const _0x4577ca=_0x10cbb6;TSR[_0x4577ca(0x115)][_0x4577ca(0x10a)]=_0x43c2f6;},Game_Character[_0x10cbb6(0x12a)][_0x10cbb6(0xe4)]=function(){const _0x3016ba=_0x10cbb6;return this[_0x3016ba(0x15f)];},Game_Character[_0x10cbb6(0x12a)][_0x10cbb6(0x149)]=function(){this['_requestMapPopups']=![];},Game_Character['prototype'][_0x10cbb6(0x15d)]=function(){const _0x55cff8=_0x10cbb6;return this[_0x55cff8(0xfc)];},Game_Character[_0x10cbb6(0x12a)][_0x10cbb6(0x117)]=function(){this['_requestSecondPopups']=![];},Game_Character['prototype']['startTextPopup']=function(_0x416ea9,_0x3b3034,_0x2f4ae2,_0x201f91,_0x261756,_0x3d9ba5){const _0x300e78=_0x10cbb6,_0x57b919=ColorManager[_0x300e78(0x142)](_0x3b3034);this['_requestMapPopups']=[_0x300e78(0x11d),_0x416ea9,_0x57b919,_0x2f4ae2,_0x201f91,_0x261756];if(_0x3d9ba5){const _0x21967d=_0x3d9ba5>0x0?'+':'',_0x3b4908=_0x21967d+_0x3d9ba5+'\x20'+TextManager['levelA'];this[_0x300e78(0xfc)]=[_0x300e78(0x11d),_0x3b4908,_0x57b919,_0x2f4ae2,_0x201f91,_0x261756];}},Game_Character[_0x10cbb6(0x12a)][_0x10cbb6(0x16f)]=function(_0x1b57b1,_0x4b8b95,_0x4e9672,_0x2aa647,_0x302151,_0x4a3f73,_0x842d9,_0x5e5f77,_0x331af9,_0x29eb0c){const _0x408acd=_0x10cbb6,_0x1d8eca=eval(_0x408acd(0x126)+_0x1b57b1+'['+_0x4b8b95+']'),_0x585d74=_0x1d8eca?_0x408acd(0x16c):_0x408acd(0x17b),_0x340274=_0x1d8eca?_0x1d8eca['name']:0x0,_0x38e09a=_0x1d8eca?_0x1d8eca[_0x408acd(0x182)]:_0x302151,_0x24fbb9=_0x29eb0c?_0x2aa647:ColorManager['textColor'](_0x2aa647);this['_requestMapPopups']=[_0x585d74,_0x340274,_0x38e09a,_0x4e9672,_0x24fbb9,_0x842d9,_0x5e5f77,_0x331af9,_0x29eb0c],_0x4a3f73&&!_0x29eb0c&&(_0x585d74==='item'?$gameParty[_0x408acd(0x15a)](_0x1d8eca,_0x4e9672,!![],!![]):$gameParty[_0x408acd(0x116)](_0x4e9672,!![]));},Game_Character[_0x10cbb6(0x12a)][_0x10cbb6(0x141)]=function(_0x152a1c,_0x46734e,_0x3a38b1,_0x5bcb63,_0x3666fa,_0x769004,_0x1afbf7){const _0x18a333=_0x10cbb6,_0x3049a0=Window_Base[_0x18a333(0x12a)][_0x18a333(0xc7)](_0x46734e),_0x5786f7=_0x3049a0<0x0,_0x7b4d87=Math[_0x18a333(0x174)](_0x3049a0)[_0x18a333(0x186)]();let _0x4b25a6,_0x16a3c6='',_0x5b6d10='';if(_0x152a1c==='hp')_0x4b25a6=!_0x5786f7?ColorManager[_0x18a333(0xf4)](0x0):ColorManager['damageColor'](0x1);else{if(_0x152a1c==='mp')_0x4b25a6=!_0x5786f7?ColorManager[_0x18a333(0xf4)](0x2):ColorManager[_0x18a333(0xf4)](0x3);else _0x152a1c==='tp'&&(_0x4b25a6=!_0x5786f7?ColorManager['damageColor'](0x4):ColorManager[_0x18a333(0xf4)](0x5));}if(TSR[_0x18a333(0x115)][_0x18a333(0x185)])_0x16a3c6=_0x5786f7?'+':'-';if(TSR[_0x18a333(0x115)][_0x18a333(0x102)])_0x5b6d10=_0x152a1c?TextManager[_0x152a1c]:'';this[_0x18a333(0x15f)]=[_0x18a333(0x184),_0x16a3c6+_0x7b4d87+_0x5b6d10,_0x4b25a6,_0x3666fa,_0x769004,_0x1afbf7];if(_0x3a38b1&&!this[_0x18a333(0xea)]){if(!_0x5bcb63){const _0x5e7ccf=this===$gamePlayer?$gameParty[_0x18a333(0x14d)]():$gameParty[_0x18a333(0xed)]()[this[_0x18a333(0x159)]];switch(_0x152a1c){case'hp':_0x5e7ccf[_0x18a333(0x132)](-_0x3049a0);break;case'mp':_0x5e7ccf[_0x18a333(0xf1)](-_0x3049a0);break;case'tp':_0x5e7ccf[_0x18a333(0x139)](_0x5e7ccf['tp']-_0x3049a0);break;default:break;}}else{for(const _0x46ce28 of $gameParty[_0x18a333(0xed)]()){switch(_0x152a1c){case'hp':_0x46ce28[_0x18a333(0x132)](-_0x3049a0);break;case'mp':_0x46ce28[_0x18a333(0xf1)](-_0x3049a0);break;case'tp':_0x46ce28[_0x18a333(0x139)](_0x46ce28['tp']-_0x3049a0);break;default:break;}}const _0x1634ad=$gamePlayer['followers']();if(_0x1634ad[_0x18a333(0x128)]())for(const _0x335b75 of _0x1634ad[_0x18a333(0x163)]){_0x335b75[_0x18a333(0x15f)]=['damage',_0x16a3c6+_0x7b4d87+_0x5b6d10,_0x4b25a6,_0x3666fa,_0x769004,_0x1afbf7];}}}},TSR[_0x10cbb6(0x115)]['_Game_Actor_tradeItemWithParty']=Game_Actor[_0x10cbb6(0x12a)][_0x10cbb6(0x17f)],Game_Actor[_0x10cbb6(0x12a)][_0x10cbb6(0x17f)]=function(_0x265107,_0x422894){const _0x1b828d=_0x10cbb6;TSR['mapPopups'][_0x1b828d(0xf2)]=TSR[_0x1b828d(0x115)]['_autoItemPopup'],TSR[_0x1b828d(0x115)][_0x1b828d(0xf8)]=![];const _0xb423e8=TSR[_0x1b828d(0x115)]['_Game_Actor_tradeItemWithParty'][_0x1b828d(0x109)](this,_0x265107,_0x422894);return TSR['mapPopups'][_0x1b828d(0xf8)]=TSR[_0x1b828d(0x115)]['_cacheAutoItem'],_0xb423e8;},TSR[_0x10cbb6(0x115)]['_Game_Party_gainItem']=Game_Party[_0x10cbb6(0x12a)]['gainItem'],Game_Party[_0x10cbb6(0x12a)][_0x10cbb6(0x15a)]=function(_0x429509,_0x5ed94b,_0x344a0f,_0x4d5ede){const _0x18de95=_0x10cbb6;TSR[_0x18de95(0x115)][_0x18de95(0xc9)]['call'](this,_0x429509,_0x5ed94b,_0x344a0f);const _0x556274=this[_0x18de95(0xda)](_0x429509);if(_0x556274&&TSR['mapPopups'][_0x18de95(0xf8)]&&!_0x4d5ede){const _0x10bcc3=_0x429509[_0x18de95(0xe3)][_0x18de95(0x15c)]?_0x429509[_0x18de95(0xe3)][_0x18de95(0x15c)][_0x18de95(0x16b)]():'0',_0x271840=_0x10bcc3[_0x18de95(0x17e)]<0x6?ColorManager['textColor'](parseInt(_0x10bcc3)):_0x10bcc3['includes']('#')?_0x10bcc3:'#'[_0x18de95(0x14f)](_0x10bcc3),_0x3574c6=TSR[_0x18de95(0x115)]['_popupDuration'];$gamePlayer['startItemPopup'](_0x556274,_0x429509['id'],_0x5ed94b,_0x271840,0x0,![],_0x3574c6,0x0,0x0,!![]),$gameMap[_0x18de95(0xcb)][_0x18de95(0x10d)](0x1);}},Game_Party[_0x10cbb6(0x12a)][_0x10cbb6(0xda)]=function(_0x177245){const _0x2eefd8=_0x10cbb6;if(!_0x177245)return null;else{if(DataManager[_0x2eefd8(0x10f)](_0x177245))return _0x2eefd8(0x165);else{if(DataManager[_0x2eefd8(0x14b)](_0x177245))return _0x2eefd8(0x166);else return DataManager[_0x2eefd8(0x119)](_0x177245)?_0x2eefd8(0x134):null;}}},TSR[_0x10cbb6(0x115)]['_Game_Party_gainGold']=Game_Party[_0x10cbb6(0x12a)][_0x10cbb6(0x116)],Game_Party[_0x10cbb6(0x12a)]['gainGold']=function(_0x66c600,_0x3b03ec){const _0x2eb1f0=_0x10cbb6;TSR[_0x2eb1f0(0x115)]['_Game_Party_gainGold']['call'](this,_0x66c600);if(TSR[_0x2eb1f0(0x115)][_0x2eb1f0(0xeb)]&&!_0x3b03ec){const _0x5563d3=TSR[_0x2eb1f0(0x115)][_0x2eb1f0(0x137)],_0x230f95=ColorManager['textColor'](_0x5563d3),_0x3bf2cd=TSR['mapPopups'][_0x2eb1f0(0x148)],_0x4eacda=TSR[_0x2eb1f0(0x115)][_0x2eb1f0(0x176)];$gamePlayer[_0x2eb1f0(0x16f)](_0x2eb1f0(0x165),0x0,_0x66c600,_0x230f95,_0x3bf2cd,![],_0x4eacda,0x0,0x0,!![]),$gameMap[_0x2eb1f0(0xcb)]['wait'](0x1);}},TSR[_0x10cbb6(0x115)][_0x10cbb6(0x17d)]=Game_Actor[_0x10cbb6(0x12a)]['changeExp'],Game_Actor['prototype'][_0x10cbb6(0xee)]=function(_0x1d9686,_0x2a0ccc){const _0x191671=_0x10cbb6,_0x2cc231=this[_0x191671(0x169)],_0x3d2376=this[_0x191671(0x160)](),_0x239c78=_0x1d9686-_0x3d2376;TSR[_0x191671(0x115)][_0x191671(0x17d)][_0x191671(0x109)](this,_0x1d9686,_0x2a0ccc);if(TSR[_0x191671(0x115)]['_autoExpPopup']&&this['currentExp']()!==_0x3d2376){const _0x1f59dc=this[_0x191671(0x169)]-_0x2cc231,_0x24a116=_0x239c78>0x0?'+':'',_0x301911=_0x24a116+_0x239c78+'\x20'+TextManager[_0x191671(0x14a)],_0xe9db14=TSR[_0x191671(0x115)]['_expColor'],_0x476e82=TSR[_0x191671(0x115)][_0x191671(0x176)];$gamePlayer[_0x191671(0x101)](_0x301911,_0xe9db14,_0x476e82,0x0,0x0,_0x1f59dc),$gameMap[_0x191671(0xcb)][_0x191671(0x10d)](0x1);}},TSR[_0x10cbb6(0x115)][_0x10cbb6(0x129)]=Spriteset_Map[_0x10cbb6(0x12a)][_0x10cbb6(0xc8)],Spriteset_Map['prototype']['createUpperLayer']=function(){const _0x23646f=_0x10cbb6;TSR['mapPopups'][_0x23646f(0x129)]['call'](this),this['createMapPopupsSet']();},Spriteset_Map['prototype'][_0x10cbb6(0x157)]=function(){const _0x44af19=_0x10cbb6,_0x586370=this[_0x44af19(0x136)]();this[_0x44af19(0x100)]=new Sprite(),this[_0x44af19(0x100)]['setFrame'](_0x586370['x'],_0x586370['y'],_0x586370['width'],_0x586370['height']),this[_0x44af19(0x13a)](this['_mapPopupsSet']);},TSR[_0x10cbb6(0x115)]['_Sprite_Character_initMembers']=Sprite_Character[_0x10cbb6(0x12a)][_0x10cbb6(0x11f)],Sprite_Character[_0x10cbb6(0x12a)][_0x10cbb6(0x11f)]=function(){const _0x5cf926=_0x10cbb6;TSR[_0x5cf926(0x115)][_0x5cf926(0x110)]['call'](this),this[_0x5cf926(0x100)]=[],this[_0x5cf926(0x172)]=[];},TSR[_0x10cbb6(0x115)]['_Sprite_Character_update']=Sprite_Character[_0x10cbb6(0x12a)][_0x10cbb6(0xfd)],Sprite_Character[_0x10cbb6(0x12a)]['update']=function(){const _0x4fcbc9=_0x10cbb6;TSR[_0x4fcbc9(0x115)][_0x4fcbc9(0xf0)][_0x4fcbc9(0x109)](this),this['updateMapPopups']();},Sprite_Character[_0x10cbb6(0x12a)][_0x10cbb6(0xfb)]=function(){const _0x1b741b=_0x10cbb6,_0x59c531=this[_0x1b741b(0xe1)][_0x1b741b(0xe4)](),_0x33e6ca=this[_0x1b741b(0xe1)][_0x1b741b(0x15d)]();_0x33e6ca&&(this[_0x1b741b(0xe1)][_0x1b741b(0x117)](),this[_0x1b741b(0xef)](_0x33e6ca)),_0x59c531&&(this[_0x1b741b(0xe1)][_0x1b741b(0x149)](),this[_0x1b741b(0xef)](_0x59c531));},Sprite_Character['prototype'][_0x10cbb6(0xef)]=function(_0x184843){const _0x28cacf=_0x10cbb6,_0x5d68b7=_0x184843[0x0];let _0x260bb3=_0x184843[0x1],_0xe9f93b=ColorManager['normalColor'](),_0x15a2f9=0x0,_0x2923b1=0x0,_0x3ce602=0x0,_0x43911e=0x0,_0x1631ad=![];if(_0x5d68b7===_0x28cacf(0x11d))_0xe9f93b=_0x184843[0x2],_0x2923b1=_0x184843[0x3],_0x3ce602=_0x184843[0x4],_0x43911e=_0x184843[0x5];else{if(_0x5d68b7===_0x28cacf(0x16c)){const _0x3a7b93=_0x184843[0x2],_0x2d85e9=_0x184843[0x3]>0x1||_0x184843[0x3]<0x0?'\x20x'+Math[_0x28cacf(0x174)](_0x184843[0x3]):'',_0x457c03=_0x184843[0x3]<0x0?'-':'';_0xe9f93b=_0x184843[0x4],_0x260bb3=_0x457c03[_0x28cacf(0x14f)](_0x260bb3[_0x28cacf(0x14f)](_0x2d85e9)),_0x15a2f9=ImageManager[_0x28cacf(0x12d)]/0x2,_0x2923b1=_0x184843[0x5],_0x3ce602=_0x184843[0x6],_0x43911e=_0x184843[0x7],_0x1631ad=_0x184843[0x8];const _0x334949=this['createMapIconSprite'](_0x3a7b93,_0x260bb3,_0x15a2f9,_0x2923b1,_0x3ce602,_0x43911e);this[_0x28cacf(0x172)][_0x28cacf(0x173)](_0x334949);if(_0x1631ad)_0x334949['y']-=(ImageManager[_0x28cacf(0x12d)]+0x4)*this[_0x28cacf(0x172)][_0x28cacf(0x161)](_0x334949);}else{if(_0x5d68b7===_0x28cacf(0x17b)){_0x260bb3=_0x184843[0x3],_0xe9f93b=_0x184843[0x4];const _0x3b7409=TSR[_0x28cacf(0x115)][_0x28cacf(0xcc)]||TextManager[_0x28cacf(0xec)];if(TSR[_0x28cacf(0x115)][_0x28cacf(0xe6)])_0x260bb3+=_0x28cacf(0xf3)+_0x3b7409;_0x2923b1=_0x184843[0x5],_0x3ce602=_0x184843[0x6],_0x43911e=_0x184843[0x7];if(_0x184843[0x2]){_0x15a2f9=ImageManager[_0x28cacf(0x12d)]/0x2;const _0xf36f48=_0x184843[0x2],_0x42cbb1=this[_0x28cacf(0x111)](_0xf36f48,_0x184843[0x3][_0x28cacf(0x186)](),_0x15a2f9,_0x2923b1,_0x3ce602,_0x43911e);this['_mapPopupIconsSet'][_0x28cacf(0x173)](_0x42cbb1);if(_0x1631ad)_0x42cbb1['y']-=(ImageManager['iconWidth']+0x4)*this[_0x28cacf(0x172)]['indexOf'](_0x42cbb1);}}else _0x5d68b7===_0x28cacf(0x184)&&(_0x260bb3=_0x184843[0x1],_0xe9f93b=_0x184843[0x2],_0x2923b1=_0x184843[0x3],_0x3ce602=_0x184843[0x4],_0x43911e=_0x184843[0x5]);}}_0x260bb3='\x5ccolor'+_0xe9f93b+_0x260bb3;const _0x1edbc1=this[_0x28cacf(0x164)](_0x5d68b7,_0x260bb3,_0x15a2f9,_0x2923b1,_0x3ce602,_0x43911e);this[_0x28cacf(0x100)][_0x28cacf(0x173)](_0x1edbc1);if(_0x1631ad)_0x1edbc1['y']-=(ImageManager[_0x28cacf(0x12d)]+0x4)*this[_0x28cacf(0x100)][_0x28cacf(0x161)](_0x1edbc1);},Sprite_Character['prototype'][_0x10cbb6(0x164)]=function(_0x1b8a58,_0x125cfd,_0x10e31d,_0x1c70c7,_0x1371e0,_0x49ef25){const _0x4fb41b=_0x10cbb6,_0x35f160=this[_0x4fb41b(0x155)](),_0x51c511=new Sprite_MapPopup();let _0x2132b3=parseInt(TSR['mapPopups']['_offsetX'])||0x0,_0x586313=parseInt(TSR[_0x4fb41b(0x115)][_0x4fb41b(0xd3)])||0x0,_0x239bdc=_0x1371e0&&_0x1371e0[_0x4fb41b(0x107)]()['includes'](_0x4fb41b(0xca)),_0x4ca1d6=_0x49ef25&&_0x49ef25[_0x4fb41b(0x107)]()[_0x4fb41b(0xd0)]('pos');if(_0x1371e0)_0x2132b3=parseInt(_0x1371e0[_0x4fb41b(0x125)](/\s*pos\s*/,''));if(_0x49ef25)_0x586313=parseInt(_0x49ef25[_0x4fb41b(0x125)](/\s*pos\s*/,''));return _0x51c511['x']=_0x239bdc?_0x2132b3-_0x35f160/0x2+_0x10e31d:this['x']-_0x35f160/0x2+_0x10e31d+_0x2132b3,_0x51c511['y']=_0x4ca1d6?_0x586313-$gameMap[_0x4fb41b(0x175)]()+$gameSystem[_0x4fb41b(0xf6)]()/0x2:this['y']-$gameMap[_0x4fb41b(0x175)]()+$gameSystem['windowPadding']()/0x2+_0x586313,_0x51c511['_duration']=_0x1c70c7,_0x51c511[_0x4fb41b(0xe2)](_0x1b8a58,_0x125cfd),SceneManager[_0x4fb41b(0x108)][_0x4fb41b(0x12e)][_0x4fb41b(0x100)][_0x4fb41b(0x13a)](_0x51c511),_0x51c511;},Sprite_Character[_0x10cbb6(0x12a)][_0x10cbb6(0x111)]=function(_0x5bd7bc,_0x7b18bc,_0x21c536,_0xf7c8a1,_0x99a238,_0xe74864){const _0x460489=_0x10cbb6,_0x2951df=this[_0x460489(0x155)](),_0x238cb6=_0x7b18bc[_0x460489(0x17e)]*_0x2951df,_0x34ba9a=new Sprite_MapIcon();let _0x57be44=parseInt(TSR[_0x460489(0x115)][_0x460489(0xd2)])||0x0,_0x53a516=parseInt(TSR['mapPopups'][_0x460489(0xd3)])||0x0,_0x3b3d1c=_0x99a238&&_0x99a238[_0x460489(0x107)]()[_0x460489(0xd0)](_0x460489(0xca)),_0x59c6ac=_0xe74864&&_0xe74864[_0x460489(0x107)]()[_0x460489(0xd0)](_0x460489(0xca));if(_0x99a238)_0x57be44=parseInt(_0x99a238[_0x460489(0x125)](/\s*pos\s*/,''));if(_0xe74864)_0x53a516=parseInt(_0xe74864[_0x460489(0x125)](/\s*pos\s*/,''));return _0x34ba9a['x']=_0x3b3d1c?_0x57be44-_0x238cb6/0x2-_0x2951df-_0x2951df/0x2+_0x21c536:this['x']-_0x238cb6/0x2-_0x2951df-_0x2951df/0x2+_0x21c536+_0x57be44,_0x34ba9a['y']=_0x59c6ac?_0x53a516-$gameMap[_0x460489(0x175)]():this['y']-$gameMap['tileHeight']()+_0x53a516,_0x34ba9a[_0x460489(0x13f)]=_0xf7c8a1,_0x34ba9a[_0x460489(0xe2)](_0x5bd7bc),SceneManager['_scene'][_0x460489(0x12e)][_0x460489(0x100)][_0x460489(0x13a)](_0x34ba9a),_0x34ba9a;},Sprite_Character[_0x10cbb6(0x12a)][_0x10cbb6(0x155)]=function(){const _0x5d922e=_0x10cbb6,_0x5f0056=$gameSystem['mainFontSize']()-0x4;return Math[_0x5d922e(0x133)](_0x5f0056*0.5);},Sprite_Character[_0x10cbb6(0x12a)][_0x10cbb6(0xe5)]=function(){const _0x3245b3=_0x10cbb6;this[_0x3245b3(0xfb)](),this['_mapPopupsSet'][_0x3245b3(0x17e)]>0x0&&(!this[_0x3245b3(0x100)][0x0][_0x3245b3(0x112)]()&&(SceneManager[_0x3245b3(0x108)]['_spriteset'][_0x3245b3(0x100)][_0x3245b3(0xe9)](this[_0x3245b3(0x100)][0x0]),this[_0x3245b3(0x100)][_0x3245b3(0xd5)]())),this[_0x3245b3(0x172)][_0x3245b3(0x17e)]>0x0&&(!this[_0x3245b3(0x172)][0x0][_0x3245b3(0x112)]()&&(SceneManager[_0x3245b3(0x108)][_0x3245b3(0x12e)][_0x3245b3(0x100)]['removeChild'](this[_0x3245b3(0x172)][0x0]),this[_0x3245b3(0x172)][_0x3245b3(0xd5)]()));});function Sprite_MapPopup(){const _0x10c337=_0x10cbb6;this[_0x10c337(0x120)][_0x10c337(0x131)](this,arguments);}function _0x3f29(_0x5b0c1c,_0x3ae5bf){const _0x1b6381=_0x1b63();return _0x3f29=function(_0x3f29da,_0xd1cbaf){_0x3f29da=_0x3f29da-0xc7;let _0x33d474=_0x1b6381[_0x3f29da];return _0x33d474;},_0x3f29(_0x5b0c1c,_0x3ae5bf);}Sprite_MapPopup[_0x10cbb6(0x12a)]=Object[_0x10cbb6(0x14c)](Sprite[_0x10cbb6(0x12a)]),Sprite_MapPopup[_0x10cbb6(0x12a)][_0x10cbb6(0x179)]=Sprite_MapPopup,Sprite_MapPopup[_0x10cbb6(0x12a)]['initialize']=function(){const _0x27ad8e=_0x10cbb6;Sprite[_0x27ad8e(0x12a)]['initialize'][_0x27ad8e(0x109)](this),this[_0x27ad8e(0xd4)]();},Sprite_MapPopup[_0x10cbb6(0x12a)]['initMember']=function(){const _0x3d5bd4=_0x10cbb6;this[_0x3d5bd4(0x122)]['x']=0.5,this['anchor']['y']=0.5,this[_0x3d5bd4(0x13f)]=0x0;},Sprite_MapPopup['prototype'][_0x10cbb6(0xe2)]=function(_0x5f3ca9,_0x5a2fc1){const _0x493488=_0x10cbb6;this[_0x493488(0x11c)]=this['_duration']/0x3*0x2,this[_0x493488(0x171)]=_0x5f3ca9,this['_lastDisplayX']=$gameMap[_0x493488(0x123)],this['_lastDisplayY']=$gameMap['_displayY'],this[_0x493488(0x11a)](_0x5a2fc1);},Sprite_MapPopup[_0x10cbb6(0x12a)]['update']=function(){const _0x52e1cb=_0x10cbb6;Sprite[_0x52e1cb(0x12a)][_0x52e1cb(0xfd)]['call'](this);if(this[_0x52e1cb(0x13f)]>0x0){this[_0x52e1cb(0x13f)]--;for(const _0x2e52d6 of this[_0x52e1cb(0x13d)]){this[_0x52e1cb(0x180)](_0x2e52d6);}}this[_0x52e1cb(0x138)]();},Sprite_MapPopup[_0x10cbb6(0x12a)][_0x10cbb6(0x180)]=function(_0x543cc2){const _0x168799=_0x10cbb6;if(this[_0x168799(0x13f)]>this[_0x168799(0x11c)]){_0x543cc2['dy']+=0.5,_0x543cc2['ry']+=_0x543cc2['dy'];if(_0x543cc2['ry']>=0x0){_0x543cc2['ry']=0x0;if(this[_0x168799(0x150)]())_0x543cc2['dy']*=-0.6;}_0x543cc2['y']=Math['round'](_0x543cc2['ry']);}else{if(this['_duration']===this['_dropDelay'])_0x543cc2['y']=0x0;else{if(this['_duration']<this[_0x168799(0x11c)]-0x2){const _0x1ca6b8=this[_0x168799(0x171)]!==_0x168799(0x184)||!TSR[_0x168799(0x115)][_0x168799(0x15b)]?0x1:0x0;_0x543cc2['y']-=_0x1ca6b8,_0x543cc2['opacity']-=0x4;}}}},Sprite_MapPopup['prototype'][_0x10cbb6(0x138)]=function(){const _0x4dca7e=_0x10cbb6;let _0x201da7=0x0,_0x56332a=0x0;$gameMap['_displayX']!==this[_0x4dca7e(0x16a)]&&(_0x201da7=$gameMap['_displayX']-this[_0x4dca7e(0x16a)]),$gameMap[_0x4dca7e(0x146)]!==this[_0x4dca7e(0x144)]&&(_0x56332a=$gameMap[_0x4dca7e(0x146)]-this[_0x4dca7e(0x144)]),this['x']=this['x']-_0x201da7*$gameMap['tileWidth'](),this['y']=this['y']-_0x56332a*$gameMap['tileHeight'](),this['_lastDisplayX']=$gameMap[_0x4dca7e(0x123)],this['_lastDisplayY']=$gameMap[_0x4dca7e(0x146)];},Sprite_MapPopup[_0x10cbb6(0x12a)][_0x10cbb6(0x11a)]=function(_0x524400){const _0x4f611c=_0x10cbb6,_0x19eb2e=this[_0x4f611c(0x152)](),_0x5ec965=Math[_0x4f611c(0x133)](_0x19eb2e*0.65);let _0x2fe1f5=undefined,_0xea00d3=undefined,_0xc9a85c=this[_0x4f611c(0xdb)](),_0x778e0d=ColorManager[_0x4f611c(0x16d)]();_0x524400[_0x4f611c(0xd0)](_0x4f611c(0x130))&&(_0x2fe1f5=_0x524400[_0x4f611c(0x161)](_0x4f611c(0x130)),_0xc9a85c=_0x524400['slice'](_0x2fe1f5+0x6,_0x2fe1f5+0xd),_0x524400=_0x524400[_0x4f611c(0x11b)](0x0,_0x2fe1f5)+_0x524400['slice'](_0x2fe1f5+0xd));_0x524400[_0x4f611c(0xd0)](_0x4f611c(0xf3))&&(_0xea00d3=_0x524400[_0x4f611c(0x161)](_0x4f611c(0xf3)),_0x524400=_0x524400[_0x4f611c(0x11b)](0x0,_0xea00d3)+_0x524400[_0x4f611c(0x11b)](_0xea00d3+0x9));_0x524400=Window_Base[_0x4f611c(0x12a)]['convertEscapeCharacters'](_0x524400);for(let _0x12fc27=0x0;_0x12fc27<_0x524400[_0x4f611c(0x17e)];_0x12fc27++){const _0x459023=this[_0x4f611c(0x16e)](_0x5ec965,_0x19eb2e),_0x2f9632=this[_0x4f611c(0x150)]()?0.6:0.5;if(_0x12fc27>=_0x2fe1f5)_0x459023[_0x4f611c(0x181)][_0x4f611c(0x142)]=_0xc9a85c;if(_0x12fc27>=_0xea00d3)_0x459023[_0x4f611c(0x181)][_0x4f611c(0x142)]=_0x778e0d;_0x459023[_0x4f611c(0x181)][_0x4f611c(0xd6)](_0x524400[_0x12fc27],0x0,0x0,_0x5ec965,_0x19eb2e,_0x4f611c(0x10b)),_0x459023['x']=(_0x12fc27-(_0x524400['length']-0x1)/0x2)*(_0x19eb2e*_0x2f9632),_0x459023['dy']=this['numbPopup']()?-_0x12fc27:-_0x12fc27/0x3;}},Sprite_MapPopup[_0x10cbb6(0x12a)]['createChildSprite']=function(_0x32c27d,_0x112224){const _0x1f353c=_0x10cbb6,_0x165e83=new Sprite();return _0x165e83[_0x1f353c(0x181)]=this[_0x1f353c(0xf7)](_0x32c27d,_0x112224+this[_0x1f353c(0x168)]()),_0x165e83[_0x1f353c(0x122)]['x']=0x0,_0x165e83['anchor']['y']=0.5,_0x165e83['y']=this[_0x1f353c(0x171)]===_0x1f353c(0x184)&&TSR[_0x1f353c(0x115)][_0x1f353c(0x15b)]?-0x18:-0x28,_0x165e83['ry']=_0x165e83['y'],this['addChild'](_0x165e83),_0x165e83;},Sprite_MapPopup[_0x10cbb6(0x12a)]['numbPopup']=function(){const _0x58326d=_0x10cbb6;return this['_mapPopupType']==='damage'||this[_0x58326d(0x171)]===_0x58326d(0x17b);},Sprite_MapPopup['prototype'][_0x10cbb6(0x168)]=function(){const _0x1f156d=_0x10cbb6;return $gameSystem[_0x1f156d(0xf6)]();},Sprite_MapPopup[_0x10cbb6(0x12a)][_0x10cbb6(0x10c)]=function(){const _0x16484f=_0x10cbb6;return this['numbPopup']()?$gameSystem[_0x16484f(0x13c)]():$gameSystem[_0x16484f(0x124)]();},Sprite_MapPopup['prototype'][_0x10cbb6(0x152)]=function(){const _0x2609e0=_0x10cbb6;return this[_0x2609e0(0x150)]()?$gameSystem[_0x2609e0(0x167)]()-0x5:$gameSystem[_0x2609e0(0x167)]()-0x4;},Sprite_MapPopup[_0x10cbb6(0x12a)][_0x10cbb6(0xdb)]=function(){const _0xb7090e=_0x10cbb6;return ColorManager[_0xb7090e(0xdf)]();},Sprite_MapPopup[_0x10cbb6(0x12a)][_0x10cbb6(0x12b)]=function(){const _0x202229=_0x10cbb6;return _0x202229(0xe0);},Sprite_MapPopup['prototype'][_0x10cbb6(0x105)]=function(){return 0x4;},Sprite_MapPopup[_0x10cbb6(0x12a)]['createBitmap']=function(_0x446ce4,_0x57d372){const _0x43d036=_0x10cbb6,_0x461e24=new Bitmap(_0x446ce4,_0x57d372);return _0x461e24[_0x43d036(0x10c)]=this[_0x43d036(0x10c)](),_0x461e24[_0x43d036(0x152)]=this[_0x43d036(0x152)](),_0x461e24['textColor']=this[_0x43d036(0xdb)](),_0x461e24[_0x43d036(0x12b)]=this['outlineColor'](),_0x461e24['outlineWidth']=this[_0x43d036(0x105)](),_0x461e24;},Sprite_MapPopup[_0x10cbb6(0x12a)][_0x10cbb6(0x112)]=function(){const _0x256ba3=_0x10cbb6;return this[_0x256ba3(0x13f)]>0x0;};function _0x1b63(){const _0x2fe759=['_displayX','mainFontFace','replace','$data','value','isVisible','_Spriteset_Map_createUpperLayer','prototype','outlineColor','setAutoExpPopups','iconWidth','_spriteset','setAutoItemPopups','\x5ccolor','apply','gainHp','floor','Armors','12FYQbOm','pictureContainerRect','_autoGoldColor','updateScroll','setTp','addChild','posX','numberFontFace','children','Auto\x20Gold\x20Popups','_duration','updateSprite','startDamageMapPopup','textColor','#ff9900','_lastDisplayY','duration','_displayY','round','_autoGoldIcon','clearMapPopup','expA','isWeapon','create','leader','IconSet','concat','numbPopup','all','fontSize','Auto\x20Exp\x20Popups','Popups\x20Offset\x20X','charWidth','42632EIebXv','createMapPopupsSet','pluginName','_memberIndex','gainItem','_damageMotion','color','requestSecondPopups','createIconSprite','_requestMapPopups','currentExp','indexOf','registerCommand','_data','createMapPopupSprite','Items','Weapons','mainFontSize','pad','_level','_lastDisplayX','trim','item','systemColor','createChildSprite','startItemPopup','ColorManager_damageColor','_mapPopupType','_mapPopupIconsSet','push','abs','tileHeight','_popupDuration','itemId','481595uZzXCZ','constructor','27YqRAeu','gold','#4d94ff','_GameActor_changeExp','length','tradeItemWithParty','updateChild','bitmap','iconIndex','3161147XRypfW','damage','_prefix','toString','convertEscapeCharacters','createUpperLayer','_Game_Party_gainItem','pos','_interpreter','_currencyAbb','_expColor','Damage\x20Popups\x20Suffix','effect','includes','posY','_offsetX','_offsetY','initMember','shift','drawText','123TlKLMc','opacity','12434eNICkl','itemDataObj','popupColor','Auto\x20Item\x20Popups','69470FbIFlu','parameters','normalColor','rgba(0,\x200,\x200,\x200.7)','_character','setup','meta','requestMapPopups','updateMapPopups','_currencyUnit','165BtWtwu','setFrame','removeChild','_eventId','_autoGoldPopup','currencyUnit','battleMembers','changeExp','startMapPopup','_Sprite_Character_update','gainMp','_cacheAutoItem','\x5csysColor','damageColor','154hyZeuW','windowPadding','createBitmap','_autoItemPopup','Damage\x20Popups\x20Prefix','_events','setupMapPopups','_requestSecondPopups','update','Auto\x20Gold\x20Color','139656BCfSUN','_mapPopupsSet','startTextPopup','_suffix','786720VNZGrt','icon','outlineWidth','Parameters','toLowerCase','_scene','call','_autoExpPopup','center','fontFace','wait','Popups\x20Duration','isItem','_Sprite_Character_initMembers','createMapIconSprite','isPlaying','setAutoGoldPopups','loadSystem','mapPopups','gainGold','clearSecondPopup','Show\x20Currency\x20Unit','isArmor','createMapPopup','slice','_dropDelay','text','target','initMembers','initialize','Currency\x20Abbreviation','anchor'];_0x1b63=function(){return _0x2fe759;};return _0x1b63();}function Sprite_MapIcon(){const _0x543a59=_0x10cbb6;this[_0x543a59(0x120)][_0x543a59(0x131)](this,arguments);}Sprite_MapIcon[_0x10cbb6(0x12a)]=Object['create'](Sprite[_0x10cbb6(0x12a)]),Sprite_MapIcon[_0x10cbb6(0x12a)][_0x10cbb6(0x179)]=Sprite_MapIcon,Sprite_MapIcon[_0x10cbb6(0x12a)][_0x10cbb6(0x120)]=function(){const _0x227acc=_0x10cbb6;Sprite[_0x227acc(0x12a)][_0x227acc(0x120)]['call'](this),this[_0x227acc(0xd4)]();},Sprite_MapIcon['prototype'][_0x10cbb6(0xd4)]=function(){const _0x5db811=_0x10cbb6;this['anchor']['x']=0.5,this[_0x5db811(0x122)]['y']=0.5,this['_duration']=0x0;},Sprite_MapIcon[_0x10cbb6(0x12a)][_0x10cbb6(0xe2)]=function(_0x8b7bd2){const _0x33b232=_0x10cbb6;this[_0x33b232(0x11c)]=this[_0x33b232(0x13f)]/0x3*0x2;const _0x5c6674=ImageManager[_0x33b232(0x12d)],_0x43f6ac=_0x8b7bd2%0x10*_0x5c6674,_0xfcfa18=Math[_0x33b232(0x133)](_0x8b7bd2/0x10)*_0x5c6674;this[_0x33b232(0x16a)]=$gameMap[_0x33b232(0x123)],this['_lastDisplayY']=$gameMap[_0x33b232(0x146)],this[_0x33b232(0x15e)](_0x43f6ac,_0xfcfa18,_0x5c6674,_0x5c6674);},Sprite_MapIcon['prototype']['createIconSprite']=function(_0x52686e,_0x21c9b1,_0x354cff,_0x4a2d8f){const _0xcb4978=_0x10cbb6,_0x4e99dc=new Sprite();_0x4e99dc[_0xcb4978(0x181)]=ImageManager[_0xcb4978(0x114)](_0xcb4978(0x14e)),_0x4e99dc[_0xcb4978(0xe8)](_0x52686e,_0x21c9b1,_0x354cff,_0x4a2d8f),_0x4e99dc['anchor']['x']=0.5,_0x4e99dc[_0xcb4978(0x122)]['y']=0.5,_0x4e99dc['y']=-0x28,_0x4e99dc['ry']=_0x4e99dc['y'],_0x4e99dc['dy']=0x0,this[_0xcb4978(0x13a)](_0x4e99dc);},Sprite_MapIcon['prototype']['update']=function(){const _0x375a3a=_0x10cbb6;if(this[_0x375a3a(0x13f)]>0x0){this[_0x375a3a(0x13f)]--;for(const _0x210885 of this[_0x375a3a(0x13d)]){this[_0x375a3a(0x140)](_0x210885);}}this[_0x375a3a(0x138)]();},Sprite_MapIcon[_0x10cbb6(0x12a)][_0x10cbb6(0x140)]=function(_0x50fdd3){const _0x201642=_0x10cbb6;if(this[_0x201642(0x13f)]>this[_0x201642(0x11c)])_0x50fdd3['dy']+=0.5,_0x50fdd3['ry']+=_0x50fdd3['dy'],_0x50fdd3['ry']>=0x0&&(_0x50fdd3['ry']=0x0),_0x50fdd3['y']=Math[_0x201642(0x147)](_0x50fdd3['ry']);else{if(this[_0x201642(0x13f)]===this[_0x201642(0x11c)])_0x50fdd3['y']=0x0;else this['_duration']<this[_0x201642(0x11c)]-0x2&&(_0x50fdd3['y']-=0x1,_0x50fdd3[_0x201642(0xd8)]-=0x4);}},Sprite_MapIcon['prototype'][_0x10cbb6(0x138)]=function(){const _0xb7b12f=_0x10cbb6;let _0x3ce88d=0x0,_0xdf4795=0x0;$gameMap['_displayX']!==this[_0xb7b12f(0x16a)]&&(_0x3ce88d=$gameMap[_0xb7b12f(0x123)]-this[_0xb7b12f(0x16a)]),$gameMap[_0xb7b12f(0x146)]!==this[_0xb7b12f(0x144)]&&(_0xdf4795=$gameMap[_0xb7b12f(0x146)]-this[_0xb7b12f(0x144)]),this['x']=this['x']-_0x3ce88d*$gameMap['tileWidth'](),this['y']=this['y']-_0xdf4795*$gameMap[_0xb7b12f(0x175)](),this[_0xb7b12f(0x16a)]=$gameMap[_0xb7b12f(0x123)],this['_lastDisplayY']=$gameMap['_displayY'];},Sprite_MapIcon[_0x10cbb6(0x12a)][_0x10cbb6(0x112)]=function(){const _0x5365b1=_0x10cbb6;return this[_0x5365b1(0x13f)]>0x0;};
})();

//== END ========================================================================
//===============================================================================