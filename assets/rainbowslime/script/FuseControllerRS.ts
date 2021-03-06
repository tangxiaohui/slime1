import MoveIn from "../common/Script/MoveInRS";
import HandMoveEvent from "./HandMoveEventRS";
import HandTouchEvent from "./HandTouchEventRS";
import { CocosHelper } from "../common/Script/codebase/utils/CocosHelperRS";
import DragonCompoent from "./DragonCompoentRS";
import { dragonBoneScaleTo } from "./DragonBoneActionsRS";
import SlimeTouchEvent from "./SlimeTouchEventRS";
import TransitionScene from "../common/Script/codebase/TransitionSceneRS";
import TipManager from "./TipManagerRS";

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
export default class FuseController extends cc.Component {
    actionNode: cc.Node = null;
    dradonNode: cc.Node = null;
    slimeNode: cc.Node = null;
    @property({type:cc.AudioClip})
    lachang:cc.AudioClip;
    onLoad() {
        let btn_home = CocosHelper.findNode(cc.Canvas.instance.node, "btn_home");
        btn_home.zIndex = 100;
        let btn_moregame = CocosHelper.findNode(cc.Canvas.instance.node, "btn_moregame");
        btn_moregame.zIndex = 100;
        let btn_back = CocosHelper.findNode(cc.Canvas.instance.node, "btn_back");
        btn_back.zIndex = 100;
        this.node.getChildByName('slime_blue').getComponent(MoveIn).actionCallBack = function () {
            this.node.getChildByName('handLeft').runAction(cc.sequence(
                cc.moveTo(0.5, cc.v2(-300, 0)),
                cc.callFunc(function () {
                    this.node.getChildByName('handLeft').getComponent(HandMoveEvent).init();
                    this.node.getChildByName('arrow_left').active = true;
                }.bind(this))
            ));
            this.node.getChildByName('handRight').runAction(cc.sequence(
                cc.moveTo(0.5, cc.v2(300, 0)),
                cc.callFunc(function () {
                    this.node.getChildByName('handRight').getComponent(HandMoveEvent).init();
                    this.node.getChildByName('arrow_right').active = true;
                }.bind(this))
            ));
            
        }.bind(this);
    }
    moveFinish(leftFinish: boolean, rightFinish: boolean) {
        if (leftFinish && rightFinish) {
            cc.find('Canvas/finger').active = true;
            cc.find('Canvas/slime_pink').active = false;
            cc.find('Canvas/slime_blue').active = false;
            cc.find('Canvas/slime_yellow').active = false;
            cc.find('Canvas/handLeft').active = false;
            cc.find('Canvas/handRight').active = false;
            cc.find('Canvas/slime').active = true;
            this.node.getChildByName('hand').active = true;
            this.node.getChildByName('hand').getComponent(HandTouchEvent).init(cc.find('Canvas/slime/slime0')); 
        }
        
    }
    mixFinish() {
        TipManager.getInstance().playAudioEffect();
        this.dradonNode = cc.find('Canvas/slime/dragon');
        this.slimeNode = cc.find('Canvas/slime/slime1');
        this.node.getChildByName('hand').getComponent(cc.AudioSource).stop();
        this.node.getChildByName('hand').getComponent(cc.Animation).stop();
        this.node.getChildByName('hand').getComponent(HandTouchEvent).destroyTouchEvent();
        this.node.getChildByName('hand').active = false;
        cc.find('Canvas/slime/slime0').setScale(1);
        cc.find('Canvas/slime/slime0').active = false;
        cc.find('Canvas/slime/dragon').active = true;
        this.node.getChildByName('left_hand0').active = true;
        this.node.getChildByName('left_hand1').active = true;
        this.node.getChildByName('right_hand0').active = true;
        this.node.getChildByName('right_hand1').active = true;
        this.node.getChildByName('arrow_left1').active = true;
        this.node.getChildByName('arrow_right1').active = true;
        this.addHandCm();

    }
    addHandCm(){

        this.actionNode = new cc.Node();
        cc.Canvas.instance.node.addChild(this.actionNode);

        //设置左手 右手
        let array = ["left_hand0", "right_hand0"];

        let dragon = this.dradonNode;
        let _armatureDisplay = dragon.getComponent(dragonBones.ArmatureDisplay);
        let _armature = dragon.getComponent(dragonBones.ArmatureDisplay).armature();;

        //设置手的逻辑
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let left_hand = CocosHelper.findNode(cc.Canvas.instance.node, element);
            let dragCm = left_hand.getComponent(DragonCompoent);
            let startL = left_hand.getPosition();//.add(element == "left_hand0" ? cc.v2(40,0) : cc.v2(-40,0));
            let endL = startL.add(cc.v2());
            
            endL.x = left_hand.getParent().convertToNodeSpaceAR(element == "left_hand0" ? cc.v2(0, 0) : cc.v2(cc.view.getVisibleSize().width, 0)).x;
            
            dragCm.setStartPos(startL);
            dragCm.setEndPos(endL);
            
            let slime =  element == "left_hand0" ? "slimel0" : "slimer0";
            let slimel0:dragonBones.Bone = _armature.getBone(slime);
            dragCm.setMoveBone(slimel0);
        }


        for (let i = 2; i <= 3; i++){
            console.log(i);
            
            let motion2_slime = _armature.getSlot("motion" + i + "_slime");
            motion2_slime.displayIndex = -1;// = false;
            
            // motion2_slime.getColorTransform().alphaMultiplier = 0
            motion2_slime._updateColor();
            
        }
        let self = this;


        
        cc.find('Canvas').on('PullTouch', function (arg1, arg2, arg3) {
            this.node.getChildByName('arrow_left1').active = false;
            this.node.getChildByName('arrow_right1').active = false;
            // console.log('Pulling');
            console.log(self._loopSound);
            // cc.audioEngine.stopAllEffects();
            cc.audioEngine.stopEffect(self._loopSound);
            // self._loopSound = -1;

        }.bind(this));

        cc.find('Canvas').on('Pulling', function (arg1, arg2, arg3) {
            // console.log('Pulling');
            
            cc.director.getActionManager().resumeTarget(self.actionNode);

            self.showParticle();
            if(self._loopSound == -1){

                self._loopSound = cc.audioEngine.playEffect(self.lachang, false);
                setTimeout(function () {
                    self._loopSound = -1;
                }, 1500);   
            }

        }.bind(this));
        cc.find('Canvas').on('PullEnd', function (arg1, arg2, arg3) {
            console.log('PullEnd');
            cc.director.getActionManager().pauseTarget(self.actionNode);
            console.log(self._loopSound);
            // cc.audioEngine.stopAllEffects();
            // cc.audioEngine.stopEffect(self._loopSound);
            // self._loopSound = -1;
            self.hideParticle();
        }.bind(this));
        
        this.startAction();

    }
    removeHandCm() {
        cc.find('Canvas').off('PullTouch');
        cc.find('Canvas').off('Pulling');
        cc.find('Canvas').off('PullEnd');
    }

    startAction(){
        let dragon = this.dradonNode;
        let _armature = dragon.getComponent(dragonBones.ArmatureDisplay).armature();;
        for(let i = 1; i < 4; i++){

            this.actionNode.runAction(cc.sequence(cc.delayTime(3 * i), cc.callFunc(function () {
                TipManager.getInstance().jumpTips();
                let left_hand0 = cc.find('Canvas/left_hand0');
                let right_hand0 =cc.find('Canvas/right_hand0');
                let left_hand1 =cc.find('Canvas/left_hand1');
                let right_hand1 =cc.find('Canvas/right_hand1');

                if (i == 3) {
                    this.hideParticle();
                    let slime0 = _armature.getBone('slimel0');
                    let slimeScale0 = dragonBoneScaleTo(0.5,0.4,1);
                    slimeScale0.setScaleBone(slime0);
                    this.node.runAction(slimeScale0);
                    let slime1 = _armature.getBone('slimer0');
                    let slimeScale1 = dragonBoneScaleTo(0.5,0.4,1);
                    slimeScale1.setScaleBone(slime1);
                    this.node.runAction(slimeScale1);
                    left_hand0.getComponent(DragonCompoent).destroyTouchEvent();
                    right_hand0.getComponent(DragonCompoent).destroyTouchEvent();
                    this.removeHandCm();
                    left_hand0.runAction(cc.moveTo(0.5, -150, -270));
                    left_hand1.runAction(cc.moveTo(0.5, -150, -270));
                    right_hand0.runAction(cc.moveTo(0.5, 150, -270));
                    right_hand1.runAction(cc.moveTo(0.5, 150, -270));
                    this.node.runAction(cc.sequence(
                        cc.delayTime(0.5),
                        cc.callFunc(function () {
                            left_hand0.active = false;
                            left_hand1.active = false;
                            right_hand0.active = false;
                            right_hand1.active = false;
                            dragon.active = false;
                            this.slimeNode.active = true;
                            this.slimeNode.getChildByName('handRight').runAction(cc.moveTo(0.5, cc.v2(170, -130)));
                            this.slimeNode.getChildByName('handLeft').runAction(cc.sequence(
                                cc.moveBy(0.5, cc.v2(0, -700)),
                                cc.callFunc(function () {
                                    this.slimeNode.getComponent(SlimeTouchEvent).registerTouchEvent();
                                    this.node.getChildByName('hint').active = true;
                                }.bind(this))
                            ))
                        }.bind(this))
                    ))
                    return;
                }
                

                let motion1_slime = _armature.getSlot("motion" + i + "_slime");
                let motion2_slime = _armature.getSlot("motion" + (i + 1) + "_slime");
                console.log("motion2_slime" +  (i + 1) );
                
                motion2_slime.displayIndex = 0;
                console.log("motion1_slime" + i);
                motion1_slime.displayIndex = -1;

            }.bind(this))));

        }
        cc.director.getActionManager().pauseTarget(this.actionNode);
        
    }
    private indexPNum = 0;
    _loopSound = -1;
    _showpartic = -1;
    showParticle() {
        
        this.indexPNum = this.indexPNum + 1;
        let heartFullColor = CocosHelper.findNode(cc.Canvas.instance.node, "heartFullColor");

        if(this._showpartic != -1)
            return;

        this._showpartic = 1;
        let p = heartFullColor.getComponent(cc.ParticleSystem);
        heartFullColor.active = true;
        p.resetSystem();
        
    }
    hideParticle(){
        this._showpartic = -1;
        let heartFullColor = CocosHelper.findNode(cc.Canvas.instance.node, "heartFullColor");
        // heartFullColor.active = false;

        let p = heartFullColor.getComponent(cc.ParticleSystem);
        p.stopSystem();
    }
    backLastScence() {
        TransitionScene.changeScene('dyeSlimeRS');
    }
}
