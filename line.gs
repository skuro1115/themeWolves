
const NOTIFY = 'https://notify-api.line.me/api/notify';// bot reply と notify api は異なる
const TOKEN_NTF = "q5jbZjSL0Pe66a2Tw7E3esYUmE670TElCVPLRMFi4ol"// to do line notify 
const IMAGE_UEL_TEST1 = "https://placehold.jp/150x150.png"
const IMAGE_UEL_TEST2 = "https://placehold.jp/3d4070/ffffff/150x150.png"
const WEB_UEL_TEST1 = "https://developers.line.biz/ja/reference/messaging-api/#action-objects"
const BOT_ID_ENCODED = "@334hlsak"
const BOT_ROCOMMEND1 = "https://line.me/R/nv/recommendOA/"+BOT_ID_ENCODED
const BOT_ROCOMMEND0 = "https://line.me/R/ti/p/"+BOT_ID_ENCODED


function linetest() {
  myFunction()

}




          // let copyAction = [2, [{
          //                     "type": "template",
          //                     "altText": "確認ボタン",
          //                     "template": {
          //                       "type": "confirm",
          //                       "text": roomID,//
          //                       "actions": {"type":"clipboard","label": "Copy", "clipboardText": roomID}
          //                     }
          //                   }]]


/**
 *  messages　の１つの要素  TMPと同じ
 *  @see makeMessageTmp()  ここに追加したい　　
 *  @deprecated
 */
const quickR =  {//messages:[{"quickReply":{this}},"type":"text"]
  "type": "text", // 1
  "text": "Select your favorite food category or send me your location!",
  "quickReply": { // 2
    "items": [
      {
        "type": "action", // 3
        "imageUrl": "https://example.com/sushi.png",
        "action": {
          "type": "message",
          "label": "Sushi",
          "text": "Sushi"
        }
      }
    ]
  }
}




/*
  switch(num){
    case 0: return messages;       ok
    case 1: return confirmtmp;     ok
    case 2: return btntemplale;    ok
    case 3: return carousel;       No
    case 4: return locations;      ok
    case 5: return copy            ?
    case 6: return quickReply      未実装
  }
*/
/**
 * quickreplyも
 * [event1,event2]   event=[ text|index ,[option1,options2]]   option=[type,label, main]
 *                   index => messageType.  0 message, 1 confirm, 2 btn ,  3 carusel, 4 location 5 copy (6quick)
 * @param {Array.<Array>} messagesObject - 
 * return (Array.<Array>)  
 */
function makeMessageTmp(messagesObject){
  function makeActions(options){return options.map((e) => {
    var act = "text"
    if(e[0] == "uri"          ){act="uri"};
    if(e[0] == "clipboard"){act="clipboardText"};
    return {"type":e[0],"label": e[1], [act]: e[2]}})
  }
  const messages = (event)=>{return{'type':'text','text':event[0]}  }
  //TMP必須プロパティ"type","altText","template"
  const locations= (event) => {
    return {
          "type": "template",
          "altText": "位置情報を送る",
          "template": {
              "type": "buttons",
              "text": "位置情報を送る",
              "actions": [{"type":"uri", "label":"位置情報を送る", "uri":"https://line.me/R/nv/location/"}]
          }
    }
  };
  const confirmtmp = (event) => {
      return {
      "type": "template",
      "altText": "確認ボタン",
      "template": {
        "type": "confirm",
        "text": event[2]??"Are you sure?",//
        "actions": makeActions(event[1])//confirm tmpは url action NG
      }
    };
  };

  const btntemplale = (event) => {                 //add
    let actions = makeActions(event[1])
    if(event.length << 3){event[2]= ["必須メッセージ"]}
    return{
      "type": "template",
      "altText": "アクションボタン",
      "template": {
        "type" : "buttons",
        "text" : event[2][0]??"必須 text message",//必須
        "title": event[2][1]??"アクションボタン",     //任意
        "thumbnailImageUrl": event[2][2]??"https://placehold.jp/150x150.png",//任意
        "imageBackgroundColor": event[2][3]??"#FFFFFF",//"#FFFFFF" default
        "imageAspectRatio": "rectangle",//"rectangle" or "square"
        "imageSize": "contain",//"cover" or "contain"
        // "defaultAction": actions[-1],
        // "actions": actions.slice(0,-1)
        "actions": actions
      }
    }
  }
  const carousel = (event)=>{
    let actions = makeActions(event[1])
    if(event.length << 3){event[2]= ["必須メッセージ"]}
    return{
      "type": "template",
      "altText": "選択してください。",
      "template": {
          "type": "carousel",
          "columns": [
              {
                "text": event[2][0]??"select",//必須
                "title": event[2][1]??"select",//任意
                "thumbnailImageUrl": event[2][2]??"https://placehold.jp/150x150.png",
                "imageBackgroundColor": event[2][3]??"#FFFFFF",
                "defaultAction": actions[0],
                "actions": actions.slice(1)
              }
          ],
          "imageAspectRatio": "rectangle",
          "imageSize": "cover"
      }
    }
  }
  const simpleCopy =  (event)=>{
    return{
        "type": "template",
        "altText": "確認ボタン",
        "template": {
          "type": "confirm",
          "text": event[0],//
          "actions": {"type":"clipboard","label": "Copy", "clipboardText": event[0]}
        }
      }
  }

  ////////////////////////////////////////////////////////////////////////////////

  if(messagesObject.length === 0){Logger.log("makeTMP() No data")}
  const messagesArray = messagesObject.map((event) => {
      switch(event[0]){
        case 1 : return confirmtmp(event)
        case 2 : return btntemplale(event)
        case 3 : return carousel(event)
        case 4 : return locations(event)
        case 5 : return simpleCopy(event)
        default: return messages(event)
      }
    }
  )
  // Logger.log(messagesArray)

  return messagesArray
}




//===============================================================================================
//===============================================================================================
//===============================================================================================
//===============================================================================================
//===============================================================================================
//===============================================================================================
//===============================================================================================
//===============================================================================================
//===============================================================================================
//===============================================================================================

/**
 * line request. body function makemassage
 * @param {String|Array.<Object>} messages - "payload"{"messages": input{Array.<Object>}}の形式
 * @param {String} replyToken  - token and judgging  ~~ empty(default)->Push message
 * return UrlFetchSApp. request
*/
function fetchLINE(messages, replyToken = "notify") {
  const API_URL  = "https://api.line.me/v2/bot/message/reply" ;
  const API_TEST = "https://api.line.me/v2/bot/message/validate/reply"
  const ACCRSS_BOT = "TwmfZXtjMDcRwxmL89/otZQugJ/uYieWyZGFGJtOW7dTVE6W/R/h7xcHKu3uUroWqXsDAAuzt6yI3q12BxhvBW/etWysEwl9HKxMbRQVGbADi0d69cPMe/Qevo6VttceFBqbejbFEfZsq+ixKnQpNwdB04t89/1O/w1cDnyilFU=";
  if(typeof(messages) === "object"){return Logger.log("LINE() 引数の型エラー No object")}
  const messagesArray = Array.isArray(messages) ? messages :[{'type':'text','text':messages}]
  const postData = {
    "replyToken" : replyToken , 
    "messages"   : messagesArray//   JSON.stringfy()関係あり，　してはいけない
  };
  const headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    "Authorization" : "Bearer " + ACCRSS_BOT
  };
  const requestOptions = {//imm?
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData),
    "muteHttpExceptions" : true//err文見るため
  };
  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  try{
    messagesArray.forEach(e=>{Logger.log(e)})
    const testtext = messagesArray[0]?.text ?? "FetchLine() 参照エラー\n構造が違います。";
    if(replyToken.includes("notify")){return send_line(testtext)}
    ////本文ここから____________________________________________________________________________
    const url = (replyToken.includes("test"))  ?  API_TEST : API_URL;
    const res = UrlFetchApp.fetch(url, requestOptions);
    if(JSON.stringify(res)==="{}"){return Logger.log("fetch done")}
    Logger.log("fetchLINE()\nfetch ERRORresponse  =>\n");
    Logger.log(Array.isArray(messages));
    Logger.log(res);
    Logger.log(res.details??"_詳細なし________________________________________________________");
    send_line(res)
    new Error("fetchError")
    ////_____________________________________________________________________________________
  }catch(e){
    send_line(e, TOKEN_NTF);
  }
  return
}

//===============================================================================================
//===============================================================================================
/**
 * @params{String} message
 */
function send_line(message, token=TOKEN_NTF){

  const lineNotifyApi = 'https://notify-api.line.me/api/notify';
  const options =
   {
      "method"  : "post",
      "payload" : {"message": message},
      "headers" : {"Authorization":"Bearer " + token}
   };

  res = UrlFetchApp.fetch(lineNotifyApi, options);
  Logger.log(res +message)
};
//===============================================================================================
//===============================================================================================
//===============================================================================================
