
/**
 * line request. body function makemassage
 * @param {GameData}
 * @see drveloperAction()　abandoned
 * @see helpAction()     　abandoned
 * @see roomAction()     test 　各行OK, 進行yet, 例外yet
 * @see actionRoomMake() test 　各行OK, 進行yet, 例外yet
 * @see actionRoomPart() plan
 * @see waitIdolAction() plan
 * @see gameAction()     plan
 * return {GameData}
*/
function systemAction(gameData){
  send_line("systemAction()_______")
  Logger.log(gameData)
  //RHWG 親役作設　xxxx xxxx 16桁　　　1 << n　の記法　
  //RHWG４つのステータスに分かれる

  if(!Boolean(gameData.userDB.myflag)){send_line("systemAction() No myflag")}
  let myflag  = parseInt(gameData.userDB.flag)
  
  let mytext  = gameData.content.text
  let myToken = gameData.content.token
  let myId    = gameData.content.userId
  send_line(myflag.toString(2))

  if(mytext == "開発者オプション"){return developerAction(gameData)}
  if(mytext == "Help"){return testHelp(gameData)  }//helpFlag set
  if(mytext == "Room"){myflag|=0b01<<15; gameData.userDB.flag = (myflag).toString(2)}//roomFlag set
  if(myflag & 0b1<<14){return helpAction(gameData)}//移行help
  if(myflag & 0b1<<15){return roomAction(gameData)}//移行room
  if(myflag & 0b1<<9 ){return actionRoomMake(gameData)}//移行help
  if(myflag & 0b1<<8 ){return actionRoomPart(gameData)}//移行help
  if(myflag & 0b1<<13){return waitIdolAction(gameData)}//移行wait
  if(myflag & 0b1<<12){return gameAction(gameData)}//以下game_______________________________________________

  Logger.log("なにもなかった")
  Logger.log("ゲームが開始されていません。\nメニューからコマンドを入力してください。")
  send_line("system========================")
  return gameData
}
////////////////////////////////////////////////////////////////////////////
let TestGameDataEmpty0 = {
		"content" : {"text":"", "token":"", "userId":"" },
		"userDB"  : {},
		"roomDB"  : {
      "info"  :{},
      "people":[{},{}]
    },
		"messages": []
}
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


function testSystem(){
  // myFunction()

  /*進行テスト 
  respondJSON((generateWebhookJSON(0,"room作成テスト", "Room")))
  let g =  generateTestGameData(0,"Room作成")
  let g =  generateTestGameData(0,"Room")
  let f =  systemAction(g)
  updataDB(f)
  */

  
  /*各行テスト　roomAction()済*/
  let mListRoom = ["Room","roomCommand","戻る","room参加", "room作成","情報", "中止", "修正","commandに関係のないテキスト"]
  testFunctionByTextFlag(roomAction, mListRoom, 0b1<<15)



  Logger.log("=========")
}


//////Under edit/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////





/////codeテスト待ち///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////


/** edit      
 * 各行yet, 進行yet, 例外yet
 * @toDo  　plan 
 * @param {GameData}
 * @see messagesLIST 
 * @deprecated
 * @return {GameData} flesh
*/
function actionRoomPart(gameData){
  Logger.log("actionRoomPart()")
  const messages = messagesLIST.roomMake.flag;
  let myflag  = parseInt(gameData.userDB.flag)
  let mytext  = gameData.content.text
  let myToken = gameData.content.token
  let myId    = gameData.content.userId
  
  Logger.log(myflag.toString(2))
  if((myflag&0b11111111).toString(2).replace(/0/g, '').length > 1){Logger.log("roomake()  flag err")}
  if(myflag & 0b1<<9){Logger.log("RoomPart() : flagError \nルーム作成が完了していない");return gameData}

  switch (myflag&0b11111111) {
      case 0: Logger.log("explane")//現状ランダムでなく，入力文字列
          gameData.messages.push(messages[0])
          gameData.userDB.flag = (myflag&~0b1<<0|0b1<<1).toString(2)
          break;
      case 0b1<<0: Logger.log("explane");
          gameData.messages.push(messages[1]);
          gameData.userDB.flag = (myflag&~0b1<<0|0b1<<1).toString(2)
          break;
      case 0b1<<1: Logger.log("setName");
          gameData.userDB["name"] = mytext;
          gameData.messages.push(messages[2]);//
          gameData.userDB.flag = (myflag&~0b1<<1|0b1<<2).toString(2)
          break
      case 0b1<<2: Logger.log("roomNotify");
          const roomInfoArr = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(mytext).getRange(1,1,1,7).getValues() ?? null;

          gameData.messages.push(messages[3]);//cnf
          gameData.userDB.flag = (myflag&~0b1<<2|0b1<<3).toString(2)
          break;
      case 0b1<<3: Logger.log("confirm");
          if(mytext !== "Yes"){
            Logger.log("もう一度やり直します");//setMaxまど戻る
            gameData.messages.push(messages[2]);
            gameData.userDB.flag = (myflag&~0b1<<3|0b1<<2).toString(2);
            break
          };
          gameData.messages.push(messages[4]);
          gameData.roomDB.info["theme"] = mytext;  
          gameData.userDB.flag = (myflag&~0b1<<3|0b1<<4).toString(2)
          break;
      case 0b1<<4: Logger.log("AnswerTheme");
          gameData.messages.push(messages[5]);
          gameData.messages.push(JSON.stringify(gameData.userDB));
          gameData.userDB.flag = (myflag&~0b1<<4|0b1<<5).toString(2)
          break;
      case 0b1<<5: Logger.log("Confirm");
          if(mytext !== "Yes"){
            Logger.log("もう一度やり直します");//AnswerThemeまで戻る
            gameData.messages.push(messages[4]);
            gameData.userDB.flag = (myflag&~0b1<<5|0b1<<4).toString(2);
            break
          };
          if(myflag&0b1<<11){
            gameData.messages.push(messages[6]);
            gameData.userDB.flag = (myflag&~0b1<<5|0b101<<6).toString(2)
            ;break
          }
          gameData.messages.push(messages[6]);
          gameData.userDB.flag = (myflag&~0b1111111111|0b101<<12).toString(2)/**Masterだけ次のステップへ */
          break;
      case 0b1<<6: Logger.log("MasterWait&role");
          gameData.messages.push(messages[7]);
          let arrs = gameData.roomDB.people.maps(function(user){return [user.flag]})
          let bool  = arrs.every(function(arr) {return arr[0]&0b1<<13 ;});/**W flag 13 */
          if(bool){
            gameData.messages.push(messages[8]);
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName(mytext).getRange(2,3,arrs.length,1).getValues(arrs) ?? null;
            break;/**フラグそのまま */
          }
          gameData.userDB.flag = (myflag&~0b1111111111|0b101<<12).toString(2)
          break;
      default:
          Logger.log();
  }

  return gameData;

}//set 1<<12 G


/////進行テスト待ち///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
/** Hold      
 * 各行OK, 進行yet, 例外yet
 * @toDo  　　　　　1.messagesLIST　テキスト内容 2.進行テスト 3.例外テスト 
 * @param {GameData}
 * @see messagesLIST 
*/
function roomAction(gameData){
  // send_line("roomAction()")

  let myflag  = parseInt(gameData.userDB.flag)
  let mytext  = gameData.content.text
  let myToken = gameData.content.token
  let myId    = gameData.content.userId
  Logger.log("roomAction()start____"+ mytext)
  /*
  ｂｔnやクイックリプライによる制御を検討
  　　　　　　　　　　　　　　　　　　　　　RHWG親役作設
  room作成   10000000　=> 00101000　　１
  room参加   10000000=> 00000100　　２
  room情報   10xxxxxx　　　　       　　　　　　３
  room中止   10001xxx　　　　　　　       　　中止Action()
  room修正   10001xxx           修正Action()  親限定
  　　　　戻る   　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　戻るだけ
 */
  let message = messagesLIST.roomAction
  //______________________________________________________________________________
  if(mytext == "Room"){gameData.messages.push("Room応答");return gameData}
  if(mytext == "roomCommand"){gameData.messages.push("roomCommand");return gameData};
  if(mytext == "戻る"){gameData.userDB.flag= ((myflag&~0b1<<15)).toString(2);gameData.messages.push("戻る"); return gameData};
  if(mytext == "room参加"){gameData.userDB.flag= ((myflag&~0b1<<15)|0b1<<8).toString(2);gameData.messages.push("既存Roomに参加します"); return gameData};
  if(mytext == "room作成"){gameData.userDB.flag= ((myflag&~0b1<<15)|0b1<<9).toString(2);gameData.messages[0]= "roomIdを作成します"; return gameData};
  if(mytext == "情報"){return roomStatus(gameData)};
  if(mytext == "中止"){return roomBreak(gameData)};
  if(mytext == "修正"){return roomRetouch(gameData)};
  //______________________________________________________________________________

  Logger.log("roomAction()end\nNot command___"+mytext)
 
  if(true){gameData.userDB.flag= (myflag&~0b1<<15)}
  return gameData
}


/** Hold      
 * 各行OK, 進行yet, 例外yet
 * @toDo  　　　　　1.messagesLIST　テキスト内容 2.進行テスト 3.例外テスト 
 * @param {GameData}
 * @see messagesLIST 
*/
function actionRoomMake(gameData){
  // send_line("actionRoomMake()")
  Logger.log("actionRoomMake()")
  

  const messages = messagesLIST.roomMake.flag;
  let myflag  = parseInt(gameData.userDB.flag)//bit(int) flag かつ pass by valuesの確保　  intプリミティブ型
  let mytext  = gameData.content.text
  let myToken = gameData.content.token
  let myId    = gameData.content.userId
  
  Logger.log(myflag.toString(2))
  if((myflag&0b11111111).toString(2).replace(/0/g, '').length > 1){Logger.log("roomake()  flag err")}
  if(myflag & 0b1<<11){Logger.log("既にマスタ");return gameData}
  if(myflag & 0b1<<8 ){Logger.log("既に参加者");return gameData}

  switch (myflag&0b11111111) {
      case 0: Logger.log("generate&set RoomId")//現状ランダムでなく，入力文字列
          gameData.messages.push(messages[0])
          let newRoomId = mytext
          // let newRoomId = mytext + Math.floor(Math.random()*900+100).toString();//random 3桁数字100~999
          // SpreadsheetApp.getActiveSpreadsheet().insertSheet().setName(newRoomId);/**1/1000の確率でerr */
          gameData.userDB["roomId"] = newRoomId;
          gameData.roomDB["info"]   = [new Date(), newRoomId, "6", "defaultRole","好きな食べ物(default)", myId, ""]
          gameData.userDB.flag = (myflag&~0b1<<0|0b1<<1).toString(2)
          break;
      case 0b1<<0: Logger.log("setName");
          gameData.messages.push(messages[1]);
          gameData.userDB["name"] = mytext;
          gameData.userDB.flag = (myflag&~0b1<<0|0b1<<1).toString(2)
          break;
      case 0b1<<1: Logger.log("setMax");
          gameData.messages.push(messages[2]);//err型
          gameData.roomDB.info["max"] = mytext;
          gameData.userDB.flag = (myflag&~0b1<<1|0b1<<2).toString(2)
          break;
      case 0b1<<2: Logger.log("setrule");
          gameData.messages.push(messages[3]);
          gameData.roomDB.info["rule"] = mytext;
          gameData.userDB.flag = (myflag&~0b1<<2|0b1<<3).toString(2)
          break;
      case 0b1<<3: Logger.log("setTheme");
          gameData.messages.push(messages[4]);
          gameData.roomDB.info["theme"] = mytext;  
          gameData.userDB.flag = (myflag&~0b1<<3|0b1<<4).toString(2)
          break;

      case 0b1<<4: Logger.log("Confirm  roomInfo");
          if(mytext !== "Yes"){
            Logger.log("もう一度やり直します");//setMaxまど戻る
            gameData.messages.push(messages[1]);
            gameData.userDB.flag = (myflag&~0b1<<4|0b1<<1).toString(2);
            break
          }
          gameData.messages.push(messages[5]);
          gameData.messages.push(JSON.stringify(gameData.userDB));
          gameData.userDB.flag = (myflag&~0b1<<4|0b1<<5).toString(2)
          break;
      case 0b1<<5: Logger.log("Notify");
          gameData.messages.push(messages[6]);
          gameData.userDB.flag = (myflag&~0b1111111111|0b101<<8).toString(2)
          break;
      case 0b1<<7: Logger.log("options flagError");
          //省略入力
          break;
      default: 
          Logger.log("flagError");
  }
  
  // if(true){Logger.log("roomMake() No message  Action Error")}//message が格納されていなかったら

  Logger.log("mytext__"+ gameData.content.text)
  Logger.log(gameData.roomDB)
  Logger.log(gameData.message)
  Logger.log(gameData.userDB.flag)
  Logger.log("=================")

  return gameData;
}






/** 
* @deprecated
*/
function testHelp(gameData){

  const mo = [["message", "Yes", "yes"], ["message", "No", "no"]]
  const bo = [["message", "player1", "player1"], ["message", "player2", "player2"],["message", "player3", "player3"]]
  const es = [["_roomボタンを押す=>ボタンテスト開始_____"], [1, mo], [2, bo]]    
  const m  = makeMessageTmp(es)
  const replyToken = gameData.content.replyToken
  const text       = gameData.content.text
  const myflag     = parseInt(gameData.userDB.flag) ?? 0;
  send_line("Help() "+replyToken+"\n\n"+text)
  fetchLINE(m, replyToken)


  if(true){gameData.userDB.flag = (myflag&0b1<<14).toString(2)}
  return gameData

}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




/** 
* @deprecated
*/
function gameAction(){
  
}


/**
 * @see gameAction()
 */
function actionKill(roomData){setFlag()}



/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

/**
 * edit 内容は依頼 messageLISTにて
 * 　仕組み 
 * flag確認？
 * 適当なメッセを返す。
 * 放置 依存なしの追加機能
 * @deprecated　
 */
function waitIdolAction(gameData){

}


/**
 * @param (Object)-dataJSON  JSON object
 * @deprecated　
 */
function helpAction(gameData){send_line("helpAction()")}


/**
 * @param (Object)-dataJSON  JSON object
 * @deprecated　
 */
function developerAction(gameData){
  let mytext = gameData.content.text
  let token  = gameData.content.token
  let userId = gameData.content.userId

  return new Error("developper")
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/**
 * 放置 依存なしの追加機能
 * @deprecated　
 */
function roomStatus(gameData){
  Logger.log("roomRetouch()   未実装")
  let myflag  = parseInt(gameData.userDB.flag)

}
/**
 * 放置 依存なしの追加機能
 * @deprecated　
 */
function roomBreak(gameData){
  Logger.log("roomBreak()  未実装")
  let myflag  = parseInt(gameData.userDB.flag)
  if(!(myflag & 1<<11)){Logger.log("ゲームマスターしか実行できないコマンドです。");return gameData}
  
  return gameData
}

/**
 * 放置 依存なしの追加機能
 * @deprecated　
 */
function roomRetouch(gameData){
  Logger.log("roomRetouch()   未実装")
  let myflag  = parseInt(gameData.userDB.flag)
  if(!(myflag & 1<<11)){Logger.log("ゲームマスターしか実行できないコマンドです。");return gameData}
  
  return gameData
}


