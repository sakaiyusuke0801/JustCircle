// 概要
// シーンがあって、その中にいくつものデモがあるイメージ
// で、そのシーンを入れたり出したりしてゲームを進めていく感じ

// SGame ⇒このオブジェクトをつかってシーンとかデモをつくる

// まずはシーンをつくる
// 関数：SGame.createScene()
// 引数：そのシーンの名前
let TitleScene = SGame.createScene("TitleScene");

// シーンで使うリソースをオブジェクト形式でセットする
// 関数：シーン名.setRes()
// 引数：オブジェクト
let resObj = SGame.createResouce("res1",
    {
      "bg": "res/title.png",   // pngとか（※画像はpngしか対応してないわ）
      "btn": "res/startbtn.png",   // pngとか（※画像はpngしか対応してないわ）
    }
  );
TitleScene.setRes(resObj);

// シーンで使うデータをオブジェクト形式でセットする
// 関数：シーン名.setData()
// 引数：オブジェクト
TitleScene.setData({
    // 実態ないからコメントアウトするけど以下みたいな感じに
    //    "bgmFlg": false, // BGMを再生したかのフラグ
    //    "countur": 0,    // なんかカウントする初期値0
});

// シーンの更新処理を設定する
// 別に設定しなくていいけど、なんかあるでしょ
// 毎フレーム呼ばれる
// 関数：シーン名.setUpdate()
// 引数：関数(フレーム数, リソースオブジェクト, データオブジェクト)
TitleScene.setUpdate(
    // 実態ないからコメントアウトするけど以下みたいな感じに
    //    function (frame, res, data) {
    //        // BGMが未再生
    //        if (!data["bgmFlg"]) {
    //            // 音を再生
    //            this.startBGM(res["bgm"]);
    //            // 再生済フラグをON
    //            data["bgmFlg"] = true;
    //        }
    //    }
);

// シーンに設定する関数内で使えるもろもろ
// this.startBGM(リソース名)・・・BGMの再生　勝手にループする
// this.stopBGM(リソース名)・・・BGMの停止

// 次にデモをつくる
// デモにもいろいろあるけど、テクスチャをあつかうデモから
// 関数：SGame.createTextuerDemo()
// 引数：デモ名、定義済リソースオブジェクトの名前、※こっからは先は省略可↓
//       幅（省略時：360）、高さ（省略時：640）、表示位置ｘ（省略時：0）、表示位置ｙ（省略時：0）、スケールｘ（省略時：1）、スケールｙ（省略時：1）、アルファ（省略時：1）
//let myDemo = SGame.createTextuerDemo("testDemo", "bg", 360, 640, 0, 0, 1, 1, 1);
let TitleDemo = SGame.createTextuerDemo("TitleDemo", "bg", 360, 640, 0, 0, 1, 1, 1);
let StartBtnDemo = SGame.createTextuerDemo("StartBtnDemo", "btn", 225, 70, 70,500, 1, 1, 1);

// デモの更新処理を設定する
// 別に設定しなくていいけど、なんかあるでしょ
// 毎フレーム呼ばれる
// 関数：デモ名.setUpdate()
// 引数：関数(フレーム数, リソースオブジェクト, データオブジェクト、タッチしたかフラグ、タッチされてから離されたかフラグ、タッチされた位置X、、タッチされた位置Y、タッチしたままどのくらい動いたかX、タッチしたままどのくらい動いたかY、タッチして離された位置X、タッチして離された位置Y)
//myDemo.setUpdate(
//    function (f, res, data, _demos, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, //gTouchOffX, gTouchOffY) {
        // タッチされたら
        // if (gTouchOn) {
        //     // 当り判定関数からタッチされたかを判定する
        //     if (this.isHit(gTouchX, gTouchY, 1, 1)) {
        //         // 効果音ならす
        //         this.startSound(res["miss"]);
        //     }
        //     // 位置を指が動いた分足す
        //     this.pos_x += gTouchMoveX;
        //     this.pos_y += gTouchMoveY;
        // }
//    });

 StartBtnDemo.setUpdate(
   function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
            if (this.isHit(gTouchOffX, gTouchOffY, 1, 1)) {
              // 効果音ならす
              // this.startSound(res["miss"]);
              SGame.pushScene(cHitScene);

            }
            // 位置を指が動いた分足す
            // this.pos_x += gTouchMoveX;
            // this.pos_y += gTouchMoveY;
        }
    });


// デモに設定する関数内で使えるもろもろ
// this.width サイズx
// this.height サイズy
// this.pos_x テクスチャ位置x
// this.pos_y テクスチャ位置y
// this.scale_x 拡縮x
// this.scale_y 拡縮y
// this.alpha 透過
// this.startSound 音の再生
// this.stopSound 音の停止
// this.isHit 当り判定　引数⇒（当ってきたやつの座標X、当ってきたやつの座標Y、当ってきたやつのサイズW、当ってきたやつのサイズH）

// シーンへデモを追加する
// 関数：シーン名.addDemo()
// 引数：デモ
TitleScene.addDemo(TitleDemo);
TitleScene.addDemo(StartBtnDemo);

SGame.pushScene(TitleScene);
