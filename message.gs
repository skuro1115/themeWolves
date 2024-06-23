

// const uo= [ ["url", "label", IMAGE_UEL_TEST1],
//             ["url", "label", IMAGE_UEL_TEST2]]
// const mo = [["message", "Yes", "yes"],["message", "No", "no"]]
// const io = [["uri", "label", BOT_ROCOMMEND0],["uri", "label", BOT_ROCOMMEND1]];//ok
// const ul = [["uri", "label", "https://line.me/R/nv/location/"]]
// const co = [["clipboard","Copy","roomID"]]
// const lo = [["location","Location","https://line.me/R/nv/location/"]]

// const eventTest = [3,ul]
// const events = [["__text____________________________"],[1,mo],[2,co],[3,ul],[4]]
// const t = makeMessageTmp([eventTest])
// const s = makeMessageTmp(events)




const messagesLIST ={
  "roomAction":{
        "err":["roomAction Error"],
        "text":{
            "back" : "ゲームに戻りました。\n\n前出のメーセージに応答するか,\n[夜アクション]ボタンを押してみてください。",
            "confirm" : makeMessageTmp([1,[["message","はい","room作成に進む"]],[["message","戻る","戻る"]],["Roomコマンドを打ちますか？"]]),
            "roomCommandBtn": makeMessageTmp([//この内容？でリクエストエラー
                ["【ボタンコマンド】\n\n room作成 : ゲームマスターとして開始 \n room参加 : Game参加 \n room情報 : Gameのテーマや状況を確認 \n [unimplement]room中止/room修正"],
                [1,[["massege","作成","room作成"],["massege","参加","room参加"]],
                ["コマンドを選択するかテキストコマンドを送信してください。"]]
              ]),
            "roomCommand"   : "【ボタンコマンド】\n\n room作成 : ゲームマスターとして開始 \n room参加 : Game参加 \n room情報 : Gameのテーマや状況を確認 \n [unimplement]room中止/room修正",
            "roomMake" : makeMessageTmp([1,[["message","はい","room作成に進む"]],[["message","いいえ","No"]],["Room作成に進みますか？"]]),
            "roomPart" : makeMessageTmp([1,[["message","はい","room参加に進む"]],[["message","いいえ","No"]],["Room参加に進みますか？"]])
        }
  },


  "roomMake":{
        "err":[
            "room作成済n既存のゲームを中断するか他のアクションをして下さい。\nCommand>>room>>中止"
        ],
        "flag":[
            ["[名前]をテキスト入力して送信して下さい"],//0
            ["[人数]をテキスト入力して送信して下さい"],//1
            makeMessageTmp([[2, [["message","ルール1","rule1"],["message","ルール2","Unimplemented\nrule2"]],
                                ["ルールを選択してください。\n\n ルール1 : 人狼のみ \n ルール2 : 【未実装】 役職あり"]]]
            ),//2
            ["[お題]をテキスト入力して送信して下さい\n\nお題の例などのヒントが欲しい場合\"ヒント\"と入力して送信"],//3
            makeMessageTmp([1, [["message","確定","yes"],["message","修正","n未実装\n修正できません"]],
                                ["以下の内容でよろしいですか？\n\n"]]
            ),//4
            makeMessageTmp(["以下のroomIDを参加するメンバーに共有して下さい。\n\n\n\n"
                                  +"作成 : "+""+"\n人数 : "+"gameData.roomDB.info[2]"+"\n役職 : " +"gameData.roomDB.info[3]",
                            "defaultRoomID",
                            [5,["defaultRoomID"]]]
            ),//5
            makeMessageTmp([1,[["message","はい","room参加に進む"]],["Room参加に進みますか？"]])
        ]
  },
  "roomPart":{
        "err":[
            "room作成済n既存のゲームを中断するか他のアクションをして下さい。\nCommand>>room>>中止"
        ],
        "flag":[
        ]
  }

}