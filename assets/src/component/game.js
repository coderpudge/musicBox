// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        panel:cc.Node,
        recordTime:cc.Label,
        recordBtnTittle:cc.Label,
        palyBtnTittle:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("onload game")
        this.isRecord = false;
        this.isReplay = false;
        this.music=[];
        this.note = [7,8,9,"mov",4,5,6,"x",1,2,3,"-",0,"point","=","+"];

        for (let i = 0; i < this.note.length; i++) {
            const itemName = "item" + this.note[i];
            var item = this.panel.getChildByName(itemName);
            item.on(cc.Node.EventType.TOUCH_START,this.onPlay,this)
            cc.log(itemName+"register")
        }

    },

    start () {

    },
    onRecord(){
        this.isRecord = !this.isRecord;
        cc.log("on record",this.isRecord)
        this.recordBtnTittle.string = this.isRecord?"停止":"录制"
        if (this.isRecord) {
            this.timer=0;
            this.music=[];
            
        }else{
            cc.log(JSON.stringify(this.music));
        }
    },

    onPlay(event){
        cc.log("onplay")
        var audioName = event.currentTarget.name.substr("item".length)
        cc.log(audioName)
        var action={};
        action.time=this.timer
        action.audioName = audioName;
        if (this.isRecord) {
            this.music.push(action);
        }
        cc.audioEngine.play(this.getUrl(audioName),false,1)
    },
    onReplay(){
        if (this.isRecord || this.music.length==0) {
            cc.log("请先录制")
            return;
        }
        this.isReplay = !this.isReplay;
        this.palyBtnTittle.string = this.isReplay?"停止":"播放";
        this.unscheduleAllCallbacks();
        this.musicTemp = this.music.concat();
        
        if (this.isReplay) {
            for (let i = 0; i < this.musicTemp.length; i++) {
                const item = this.musicTemp[i];
                this.scheduleOnce(function() {
                    this.playEffect(item.audioName);
                    if (i==this.musicTemp.length-1) {
                        this.isReplay=!this.isReplay;
                        this.palyBtnTittle.string="播放"
                    }
                },item.time);
            }
        }

    },
    playEffect(audioName){
        cc.audioEngine.play(this.getUrl(audioName),false,1)
    },
    getUrl(url) {
        return cc.url.raw("resources/sound/" + url+".mp3");
    },
    update (dt) {
        if(this.isRecord){
            this.timer+=dt;
            this.recordTime.string = parseInt(this.timer);
        }
    }
});
