const {ccclass, property} = cc._decorator;
/**
 * 防止按钮点击多次 放在一个有Button组件的node下面
 */
@ccclass
export default class ButtonSafe extends cc.Component {

    @property
    safeTime: number = 1;

    clickEvents = [];
    start () {

        let button = this.node.getComponent(cc.Button);
        if (!button){
            return;
        }

        this.clickEvents = button.clickEvents;
        let self = this;
        let scale = this.node.scale;

        var isTouch = false;
        this.node.on('click', () => {
            button.clickEvents = [];
            if (!isTouch) {
                if (this.node.getComponent(cc.AudioSource)) {
                    this.node.getComponent(cc.AudioSource).play();
                }
                this.node.stopAllActions();
               
                let action = cc.scaleBy(0.3,1.1,0.9);
                let action1 = cc.scaleBy(0.3,0.9,1.1);
                let action2 = cc.scaleTo(0.1,scale);
    
                this.node.runAction(cc.repeat(cc.sequence(action,action1,action2),2));
                isTouch = true;
                self.scheduleOnce((dt)=>{
                    button.clickEvents = self.clickEvents;
                    isTouch =false;
                }, this.safeTime);
            }
        }, this);
    }

    // update (dt) {}
}
