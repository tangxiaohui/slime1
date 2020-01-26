
import PopupComponet from "./PopupComponetCE";
import TransitionScene from "../common/Script/codebase/TransitionSceneCE";
import showLaoding from "../common/Script/ads/showLaodingCE";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class HomeButton extends cc.Component {
    onClick() {
        this.node.getComponent(cc.AudioSource).play();
        cc.loader.loadRes(`crazyemoji/prefab/popup`, cc.Prefab, function (err, prefab) {
            let node = cc.instantiate(prefab);
            cc.find('Canvas').addChild(node);
            let componet = node.getComponent(PopupComponet);
            componet.showPopup();
            componet.setTip('Are you sure you want to back home?');
            componet.setCallback(function () {
                // showLaoding.getInstance().loadingDoneCallback = function () {
                //     showLaoding.getInstance().loadingDoneCallback = null;
                //     TransitionScene.changeScene('homeCE',12);
                // };
                // showLaoding.getInstance().showAds(false);
                cc.sys.localStorage.setItem("fromHall", 10);
                cc.sys.garbageCollect();
                cc.game.restart();
            })  
        }.bind(this)); 
       
        // cc.director.getScene().getChildByName("audioMusic").getComponent(cc.AudioSource).stop();;
        // 返回大厅
        // if(CC_JSB){
            
        //     cc.INGAME =  (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "SlimeMakeNew/craxy_emoji_slime";
        //     console.log(cc.INGAME);
        //     window.require(cc.INGAME+"/src/dating.js");
           
        // }
    }
}
