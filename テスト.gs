function test(){
  // respondJSON((generateWebhookJSON(0,"room作成テスト", "Room")))

  // Logger.log(generateTestGameData(0,"Room"))



}

/*各行テスト　roomMake()済
let mListMake = ["testNameW","6w","testRuleW","testThemeW","はい","webhookroomID"]
testFunctionByTextFlag(actionRoomMake, mListMake, 0b1<<9)
*/
  


/**
 * line request. body function makemassage
 * 最後の１回はフラグ過剰になるはず。
 * @param {function} testFunction - only(GameData)
 * @param {Array.{String}} textArray 
 * @param {Number} defaultFlag
 * @param {Number} waittime
 * @param {String} userId
 * @see generateTestGameData
 * return {GameData}
*/
function testFunctionByTextFlag(testFunction, textArray, defaultFlag=0, waittime=1000, userId="webhookUserId"){
  for (let i = -1; i <  textArray.length; i++) {
    let flgNum = (0b1<< i)|(defaultFlag);
    if (i == -1){flgNum = defaultFlag};
    let gameData = generateTestGameData(flgNum, textArray.at(i), userId)
    if(!gameData){continue}
    testFunction(gameData)
    Utilities.sleep(waittime)
    Logger.log(gameData)
  }
}



function generateTestGameData(flag, text=null, id=null, rId=null){
  text = text ?? "text"+flag.toString(2)
  id   = id   ?? "id"  +flag.toString(2)
  rId  = rId  ?? "rId" +flag.toString(2)

  let gameData = {
		"roomDB"  : {
      "info"  :{},
      "people":null
    },
		"messages": ["====testMessage===="+flag.toString(2)]
  };
  gameData["content"] = {"text":text, "token":"testToken"+id+text, "userId":id }
  gameData["userDB"]  = {"time":"13:00", "userId":id, "flag":flag, "roomId":rId }

  return gameData
}








function generateWebhookJSON(index=0, newid="", newtext= ""){
  let userId = newid ?? "testWebhookID"
  let text   = newtext ?? "Hollo"
  let type   = ["message","follow", "unfollow"][index]

  let json =
  {
    "destination": "Uc00738cba331502343e2eb5676ae6ab2",//U[0-9a-f]{32}
    "events": [//LINEプラットフォームからの疎通確認のために、Webhookイベントオブジェクトを含まない空配列が送信される場合があります。
      {
        "type": type,
        "timestamp": 1625665242211,
        "source": {
          "type": "user",
          "userId":userId /*"U80696558e1aa831..."*/
        },
        "replyToken": "testReplyToken",//"bb173f4d9cf64aed9d408ab4e36339ad",
        "mode": "active",
        "webhookEventId": "01FZ74A0TDDPYRVKNK77XKC3ZR",
        "deliveryContext": {
          "isRedelivery": false
        }
      }
    ]
  }
  if(index == 0){
    json.events[0]["message"]=
        {
          "type": "text",
          "id": "mID14353798921116",
          "text": text
        }
  }

  return json

}








/** 
* @deprecated
*/
function makeNote(text){
  const noteID = "1z4AkSgDjQP5GPs3eSbgvi6p18NB4nSXZsHFVQVyEIbQ";
  //Googleドキュメントを開きます。下記のどちらかで開きます。
  // var doc = DocumentApp.openByUrl("url");
  var doc = DocumentApp.openById(noteID);
  var paragraphs = body.getParagraphs();
  var p1 = paragraphs[0]

  p1.appendText(text);
  p1.insertText( 0, "text" );

}


