import { CocosHelper } from "../codebase/utils/CocosHelperRP";
import EventListener from "../codebase/EventListenerRP";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class CheckScribblePercent extends cc.Component {

    @property
    checkPercent = 1;

    @property([EventListener])
    checkEvents:EventListener[] =[];

    static CheckPercentEvent:string = "CheckPercentEvent";

    private _pixcelBegin = 0;
    private _pixcelEnd = 0;
    private hasInited = false;
    private iniiting = false;

    initBeginPixcel(node:cc.Node){
        if(!this.iniiting&& !this.hasInited){
            this.iniiting = true;
            //CocosHelper.captureNode(node).then((texture:cc.RenderTexture)=>{
                this._pixcelBegin = this.calcute(CocosHelper.captureNode2(node));
                node.destroy();
             //  cc.log("_pixcelBegin"+this._pixcelBegin);
                this.iniiting = false;
                this.hasInited = true;
            //});
        }
    }
    
    onEnable() {
        //this.checkSchedle(0);
        this.schedule(this.checkSchedle,this.checkPercent);
    }

    onDisable(){
        this.unschedule(this.checkSchedle);
    }

    private calcute(texture:cc.RenderTexture):number
    {
        let lData = texture.readPixels();
        let lCounter = 1;
        for (let i = 0; i < texture.height; ++i) {
            for (let j = 0; j < texture.width; ++j) {
                let lPixcelIndex = i * texture.width+ j;
                let lRed = lData[lPixcelIndex * 4];
                let lGreen = lData[lPixcelIndex * 4 + 1];
                let lBlue = lData[lPixcelIndex * 4 + 2];
                let lAlpha = lData[lPixcelIndex * 4 + 3];
                if (lAlpha > 10) {
                    if (lRed > 0 || lGreen > 0 || lBlue > 0) {
                        ++lCounter;
                    }
                }
            }
        }
        return lCounter;
    }
    protected checkSchedle(dt) {
        if(!this.enabled||this.node == null){
            return ;
        }

        if(!this.hasInited&& ! this.iniiting){
            this.iniiting = true;
            this._pixcelBegin = this.calcute(CocosHelper.captureNode2(this.node));
            this.iniiting = false;
                 this.hasInited = true;
            // this.iniiting = true;
            //  CocosHelper.captureNode(this.node).then((texture:cc.RenderTexture)=>{
            //       this._pixcelBegin = this.calcute(texture);
            //     //  cc.log("_pixcelBegin"+this._pixcelBegin);
            //       this.iniiting = false;
            //      this.hasInited = true;
            //  });
        }else if(this.hasInited){
            this._pixcelEnd = this.calcute(CocosHelper.captureNode2(this.node));
            let currentPercent = 1 - this._pixcelEnd/this._pixcelBegin;
                if(this.enabled){
                    EventListener.emitEvents(CheckScribblePercent.CheckPercentEvent,this.checkEvents,currentPercent,this);
                }
            // CocosHelper.captureNode(this.node).then((texture:cc.RenderTexture)=>{
            //     this._pixcelEnd = this.calcute(texture);
            //    //cc.log("picelEnd"+this._pixcelEnd);
            //     //cc.log("_pixcelBegin"+this._pixcelBegin);
            //     let currentPercent = 1 - this._pixcelEnd/this._pixcelBegin;
            //     if(this.enabled){
            //         EventListener.emitEvents(CheckScribblePercent.CheckPercentEvent,this.checkEvents,currentPercent,this);
            //     }
            // });
        }
    }
}
