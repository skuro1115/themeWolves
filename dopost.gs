//ルール１　　全てのデータ受け渡しはJSON構造（Object)で行う
//ルール２
//

/**
 * @typedef {Object} Gamedata
 * @property {Object} content　-userId, replyToken, messageText
 * @property {Object} userDB -
 * @property {Object} roomDB - user
 * @property {Array.{Object}}  messages - LineAPIのTMP形式
*/
/**
 * @typedef {Object} Noidea
 * @property {Array} events - userId, replyToken, messageText　だけ使いそう。　　その他idなどもある
 * @property {String} destination - 使うことなさそう
*/

/**
 * @typedef {Array.<Object>} Messages - LineAPIpostBody  {"payload":{"message": ¥this¥ }
 * @property {String} type     -Required  "text" or "template"
 * @property {String} altText  -Optional
 * @property {String} text     -Optional
 * @property {Object} template -Optional
*/


/**
 * @param {String} e - webhook string(JSON)
 */
function doPost(e) {
  const dataJSON = JSON.parse(e.postData.contents)
  respondJSON(dataJSON)
  // posttest(dataJSON);
  // posttest(textJSONtest2);
}
/////////////////////////////////////////////////////////////////////////////////////////


function myFunction() {  
  const dataJSON   = webhockJsonNote;
  const userId     = dataJSON.events[0].source.userId
  const replyToken = dataJSON.events[0].replyToken
  const text       = dataJSON.events[0].message.text


  // posttest(textJSONtest2);  
  // respondJSON(kurodatextJSON)
  // respondJSON(kurodatextJSON2)
}


function posttest(dataJSON){
  send_line("posttest()")
  const mo = [["message", "Yes", "yes"], ["message", "No", "no"]]
  const bo = [["message", "player1", "player1"], ["message", "player2", "player2"],["message", "player3", "player3"]]
  // const boErr = [
  //             ["uri", "label", BOT_ROCOMMEND0],
  //             ["uri", "label", BOT_ROCOMMEND1],
  //             ["clipboard","Copy","roomID"],
  //             ["uri", "label", "https://line.me/R/nv/location/"]
  // ]

  const es = [["_roomボタンを押す=>ボタンテスト開始_____"], [1, mo], [2, bo]]
  // const es = [[2, mo]]
  // const es = [["_roomボタンを押す=>ボタンテスト開始_____"], [1, mo]]
  Logger.log("post test Start")
  Logger.log(dataJSON);
    
  const m = makeMessageTmp(es)
  const replyToken = dataJSON.events[0].replyToken
  const text       = dataJSON.events[0].message.text


  if(text == "Room"){
    send_line("posttest()\n"+replyToken+"\n\n"+text)
    fetchLINE(m, replyToken)
    send_line("posttest()\nRoomFetch finished")
  }
}


//編集中　function//
/////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////




//////ひとまず完成？/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/**
 * @param (Object)-dataJSON  JSON object
 * @see referDB()
 * @see updateDB()
 * @see systemAction()
 * @see dataJSON{Object}
 * @see gameData{Array}
 * @see u
 */
function respondJSON(dataJSON){
  send_line("respondJSON()", TOKEN_NTF);

  //////////////////////////////////////////////////////////
  //--------------------------------------------------------------------------

  try{
    if(dataJSON.length == 0){Logger.log("空")};                                               ////    add
    if(dataJSON.events.length != 1){Logger.log("複数同時メッセージ\n\n連投は避け1通のみ回答をやり直して下さい。")}////    add
    if (dataJSON.events[0].type == "unfollow"){return unfollowAction(dataJSON)};
    if (dataJSON.events[0].type == "follow"){return followAction(dataJSON)};
    if (dataJSON.events[0].type !== "message"){return Logger.log("type is not message")};


    const gameData = referDB(dataJSON);
    const fleshGameData = systemAction(gameData);
    const savedGameData = updataDB(fleshGameData);
    fetchLINE(savedGameData.messages[0], savedGameData.content.replyToken);

  }catch(e){
    send_line("Error: respondJSON()\n\n"+e, TOKEN_NTF);

  }

}





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////add
/////////////////////////////////////////////////////////////////////////////////////////放置





/**
 * left 　　　 add function. unfollow()
 * @param{String} dataJSON
 */
function unfollowAction(dataJSON){
  Logger.log("unfollow Action.\n今の所する予定なし")
  Logger.log("unfollow\n"+ dataJSON.events[0].source.userId);
}

/**
 * @param{String} dataJSON
 */
function followAction(dataJSON){
  firstDB(dataJSON);
  const m = "このアカウントは個人情報の取得および保存は行なっておりません。\n\n roomボタン : ゲーム開始\n Helpボタン : 使い方やルール説明"
  fetchLINE(m, dataJSON.events[0].replyToken);
}



