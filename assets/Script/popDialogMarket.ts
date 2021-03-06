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
export default class popDialog extends cc.Component {

    //进入的声音资源
    @property(cc.AudioClip)
    showAudio: cc.AudioClip = null;


    start () {
       // this.node.scale = 0;

        let pop_bg_t = this.node.getChildByName("pop_bg_t");
        pop_bg_t.scale = 0;

        let pop_content = this.node.getChildByName("pop_content");
        // pop_content.active = false;
        pop_content.active = true;
        pop_content.width = cc.view.getVisibleSize().width;
        pop_content.height = cc.view.getVisibleSize().height;

        if(this.showAudio)
            cc.audioEngine.play(this.showAudio, false, 1);

        let self = this;
        pop_bg_t.runAction(cc.sequence(cc.scaleTo(0.25, 1.0),cc.callFunc(function () {
            pop_content.active = true;
        })));
    }

    touchToMarketBtn(){

        if (CC_JSB&& !CC_PREVIEW) {
            //跳转
            jsToCPP.getInstance().rateUs();
        }

        this.close();
    }
    touchCloseBtn(){

        this.close();

    }
    close(){
        let pop_bg_t = this.node.getChildByName("pop_bg_t");
        //pop_bg_t.scale = 0;
        let pop_content = this.node.getChildByName("pop_content");
        pop_content.active = false;
        let self = this;
        pop_bg_t.runAction(cc.sequence(cc.scaleTo(0.25, 0),cc.callFunc(function () {
            
            self.node.removeFromParent()

        })));

    }
    // update (dt) {}
}
