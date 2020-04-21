// 小さくなってゆく円いい感じで内側と重なるようにするゲームシーン
//
// 200403 sakai.y

// シーン
let cHitScene = SGame.createScene("CHitS");

// 半径の最大値
const MAX_RADIUS = 75;
// 半径の最小値
const MIN_RADIUS = 35;
// 位置Xの最大値
const MAX_X = SGame.width - MAX_RADIUS;
// 位置Xの最小値
const MIN_X = MAX_RADIUS;
// 位置Yの最大値
const MAX_Y = SGame.height - MAX_RADIUS;
// 位置Yの最小値（スコア文字の幅分）
const MIN_Y = MAX_RADIUS + 35;

// ゲーム状態オブジェクト
let GAME_STATE = {
    "NONE": 0,   // 問題待ち
    "QUIZ": 1,   // 問題中
    "TOUC": 2,   // タッチ後
    "TIME": 3,   // 終了
};
// シーンで使うデータ
cHitScene.setData({
    // スコア
    "score": 0,
    // 色
    "color": 0,
    // 状態
    "state": GAME_STATE.NONE,
    // 正解となる円の半径(px)
    "answer": 0,
    // 待ち時間
    "wait": 0,
});

// スタート関数
cHitScene.setStart(
    function (scene) {
        // 背景のデモ（白の全画面四角形）
        let cHitBg = SGame.createRectDemo("cHitBg", "#FFFFFF", true, 1, SGame.width, SGame.height, 0, 0, 1, 1, 1);
        // スコアデモ
        let score = SGame.createFontDemo("score", "Score:", "#000000", 100, 35, 55, 20, 1, 1, 1);
        // 点数デモ
        let point = SGame.createFontDemo("point", "0", "#000000", 200, 35, 150, 20, 1, 1, 1);
        point.setUpdate(
            function (s) {
                // 点数の値に文字列更新
                this.text = s.data["score"];
            }
        );
        // レディイゴーデモ
        let readyGo = SGame.createFontDemo("readyGo", "Ready...", "#000000", 360, 50, SGame.width / 2, SGame.height / 2, 1, 1, 1);
        // ステータスyが初期化されておらず、ゲームがループした際に開始して即終了になってしまうので初期化
        scene.data["state"] = GAME_STATE.NONE;
        readyGo.setUpdate(
            function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOff) {

                // 文字列が"Ready..."
                if (this.text == "Ready...") {
                    // だんだん大きく
                    this.width++;
                    this.height++;
                    // だんだん薄く
                    this.alpha -= 0.03;
                    // 透明になったら文字列をGOに
                    if (this.alpha <= 0) {
                        // デカめにして
                        this.text = "Go";
                        this.width = 360;
                        this.height = 300;
                        this.alpha = 0;
                    }
                }
                // 文字列が"Go"
                else if (this.text == "Go") {

                    // ちょい急ぎ目に表示
                    this.alpha += 0.05;
                    // 元の大きさになったら止まる
                    if (this.height > 200) {
                        // 急ぎ目に縮小
                        //this.width -= 10;
                        this.height -= 10;
                    }
                    // 2秒で自分自身を消す
                    if (scene.frame > 60) {
                        scene.delDemo("readyGo");
                    }
                }
                // 上記以外は自分自身を消す
                else {
                    // 初期化してから
                    //this.text = "Ready...";
                    //this.width = 360;
                    //this.height = 50;
                    //this.alpha = 1;
                    // 自分を削除
                    scene.delDemo("readyGo");
                }
            }
        );
        // シーンにデモ追加
        // 背景
        cHitScene.addDemo(cHitBg);
        // スコア文字
        cHitScene.addDemo(score);
        // 点数文字
        cHitScene.addDemo(point);
        // レディゴー
        cHitScene.addDemo(readyGo);
    }
);

// シーンの更新処理
cHitScene.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {

        // 2秒はレディゴーしてるので
        if (scene.frame > 60) {

            // 待ち時間をデクリメント（いちおどんなときも）
            if (scene.data["wait"] > 0) {
                scene.data["wait"]--;
            }

            // 状態分岐
            switch (scene.data["state"]) {
                // 問題待ち
                case GAME_STATE.NONE:
                    // 色を決める
                    let color = "#ff0000";
                    switch (scene.data["color"]) {
                        case 0:
                            // 赤
                            color = "#ff0000";
                            break;
                        case 1:
                            // 青
                            color = "#0000ff";
                            break;
                        case 2:
                            // 緑
                            color = "#00ff00";
                            break;
                        default:
                            break;
                    }

                    // それぞれランダムに決める
                    let pox_x = Math.floor(Math.random() * (MAX_X + 1 - MIN_X)) + MIN_X;
                    let pox_y = Math.floor(Math.random() * (MAX_Y + 1 - MIN_X)) + MIN_Y;
                    let mul = Math.floor(Math.random() * (5 + 1 - 2)) + 2;  // プレイヤーの問題に対する初期値倍率
                    scene.data["answer"] = Math.floor(Math.random() * (MAX_RADIUS + 1 - MIN_RADIUS)) + MIN_RADIUS;

                    // デモの描画
                    scene.addDemo(SGame.createCircleDemo("answer", "#666666", scene.data["answer"], false, 15, pox_x, pox_y, 1, 1, 1));
                    scene.addDemo(SGame.createCircleDemo("player", color, scene.data["answer"] * mul, false, 15, pox_x, pox_y, 1, 1, 1));

                    // 色を更新する
                    scene.data["color"] += 1;
                    if (scene.data["color"] > 2) {
                        scene.data["color"] = 0;
                    }
                    // ゲームの状態を問題中にする
                    scene.data["state"] = GAME_STATE.QUIZ;
                    break;
                // 問題中
                case GAME_STATE.QUIZ:
                    try {
                        // ２pxずつ小さく
                        scene.demo["player"].radius--;
                        scene.demo["player"].radius--;
                        scene.demo["player"].radius--;
                        // タッチされたら
                        if (gTouchOnOff) {
                            // 問題デモにタッチしていれば
                            if (scene.demo["answer"].isHit(gTouchOffX, gTouchOffY, 1, 1)) {
                                // 半径の誤差が0px
                                if (Math.abs(scene.demo["player"].radius - scene.demo["answer"].radius) <= 5) {
                                    // 文字描画
                                    scene.addDemo(SGame.createFontDemo("Excellent", "Excellent!!", "#ffd700", 100, 60, scene.demo["answer"].pos_x, scene.demo["answer"].pos_y, 1, 1, 1));

                                    // スコアを更新する
                                    scene.data["score"] += 50;
                                    // ゲームの状態をタッチ後にする
                                    scene.data["state"] = GAME_STATE.TOUC;
                                    // 待ち時間設定
                                    scene.data["wait"] = 5;
                                }
                                // 半径の誤差が5px以内
                                else if (Math.abs(scene.demo["player"].radius - scene.demo["answer"].radius) <= 10) {
                                    // 文字描画
                                    scene.addDemo(SGame.createFontDemo("Good", "Good!!", "#8b008b", 100, 60, scene.demo["answer"].pos_x, scene.demo["answer"].pos_y, 1, 1, 1));

                                    // スコアを更新する
                                    scene.data["score"] += 25;
                                    // ゲームの状態をタッチ後にする
                                    scene.data["state"] = GAME_STATE.TOUC;
                                    // 待ち時間設定
                                    scene.data["wait"] = 5;
                                }
                                // 全然だめ
                                else {
                                    // 文字描画
                                    scene.addDemo(SGame.createFontDemo("Bad", "Bad...!", "#000000", 100, 60, scene.demo["answer"].pos_x, scene.demo["answer"].pos_y, 1, 1, 1));
                                    // ゲームの状態を時間切れにする
                                    scene.data["state"] = GAME_STATE.TIME;
                                    // 待ち時間設定
                                    scene.data["wait"] = 30;
                                }
                            }
                        }
                        // ゲームオーバー
                        if (scene.demo["player"].radius < 0) {
                            // 文字描画
                            scene.addDemo(SGame.createFontDemo("Bad", "Bad...!", "#000000", 100, 60, scene.demo["answer"].pos_x, scene.demo["answer"].pos_y, 1, 1, 1));
                            // ゲームの状態を時間切れにする
                            scene.data["state"] = GAME_STATE.TIME;
                            // 待ち時間設定
                            scene.data["wait"] = 60;
                        }
                    } catch (e) {
                        console.log(e.message);
                    }
                    break;
                // タッチ後
                case GAME_STATE.TOUC:
                    // 時間がきてたら
                    if (scene.data["wait"] == 0) {
                        // 状態を次の問題待ちにする
                        scene.data["state"] = GAME_STATE.NONE;
                        // 文字を消す
                        scene.delDemo("Excellent");
                        scene.delDemo("Good");
                        scene.delDemo("Bad");
                    }
                    break;
                // 時間切れ
                case GAME_STATE.TIME:
                    // 時間がきてたら
                    if (scene.data["wait"] == 0) {
                        // 終了のシーン
                        let cHitEndScene = SGame.createScene("cHitEnd");
                        // タッチしたら最初から
                        cHitEndScene.setUpdate(
                            function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
                                // タッチされたら
                                if (gTouchOnOff) {
                                    // タッチ
                                    if (scene.demo["cHitEndBg"].isHit(gTouchOffX, gTouchOffY, 1, 1)) {
                                        SGame.popScene();
                                        SGame.pushScene(TitleScene);
                                    }
                                }
                            }
                        );
                        // 終了時の背景
                        cHitEndScene.addDemo(SGame.createRectDemo("cHitEndBg", "#000000", true, 1, SGame.width, SGame.height, 0, 0, 1, 1, 1));
                        // 終了時のスコア文字
                        cHitEndScene.addDemo(SGame.createFontDemo("EndScore", "Score:" + scene.data["score"], "#FFFFFF", 360, 80, SGame.width / 2, SGame.height / 2, 1, 1, 1));

                        // 全部消す
                        scene.delDemo("answer");
                        scene.delDemo("player");
                        scene.delDemo("Excellent");
                        scene.delDemo("Good");
                        scene.delDemo("Bad");
                        // 元のシーンをポップしてからプッシュ
                        SGame.popScene();
                        SGame.pushScene(cHitEndScene);
                    }
                    break;
            }
        }
    }
);

// ゲームにシーンを追加
// SGame.pushScene(cHitScene);
