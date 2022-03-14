//=============================================================================
// RPG Maker MZ - Player Name Enemy
//=============================================================================

/*:
 * @target MZ
 * @plugindesc You are your own enemy.
 * @author AcousticJamm
 *
 * @help ACJ_PlayerNameEnemy
 *
 * Just set the enemy name as \N[x] where x is the actor ID.
 * This plugin does not have any commands.
 */

/*:ja
 * @target MZ
 * @plugindesc あなたはあなた自身の敵です。
 * @author AcousticJamm
 *
 * @help ACJ_PlayerNameEnemy
 *
 * このプラグインにはコマンドがありません。
 */
 
(function() {
    const old_name = Game_Enemy.prototype.originalName;
    Game_Enemy.prototype.originalName = function() {
        var name = old_name.call(this);
        name = Window_Base.prototype.convertEscapeCharacters(name);
        name = name.replace(/\x1b([{}<>.|!$\^]|[A-Z]+)/gi, '');
        return name;
    };
})()