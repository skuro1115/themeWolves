
// const dataJSONforGame = {
//   "userId"    : textEventJSON.events[0].source.userId,
//   "text"      : textEventJSON.events[0].message.text, 
//   "replyToken": textEventJSON.events[0].replyToken
// }
/**
 * test用のfunction
 * Unimplemented
 *  @deprecated
 */
function timestampGameData(gameData){
  const fleshUserDB = [new Date(), ...gameData[1].slice(1)];
  const fleshRoomDB = gameData[2].map(row => [new Date(), ...row.slice(1)])
  return [gameData[0], fleshUserDB, fleshRoomDB];
}



///配列ではなく，連想配列にする可能性大
let TestGameDataEmpty = {
		"content" : {},
		"userDB"  : {},
		"roomDB"  : {},
		"messages": []
}

//SyntaxError: "[object Object]" is not valid JSON
// [text, follow, unfollow]
var webhockJsonNote =
{
  "destination": "Uc00738cba331502343e2eb5676ae6ab2",//U[0-9a-f]{32}
  "events": [//LINEプラットフォームからの疎通確認のために、Webhookイベントオブジェクトを含まない空配列が送信される場合があります。
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "14353798921116",
        "text": "Hello, world"
      },
      "timestamp": 1625665242211,
      "source": {
        "type": "user",
        "userId": " webhookUserId"//"U80696558e1aa831..."
      },
      "replyToken": "testReplyToken",//"bb173f4d9cf64aed9d408ab4e36339ad",
      "mode": "active",
      "webhookEventId": "01FZ74A0TDDPYRVKNK77XKC3ZR",
      "deliveryContext": {
        "isRedelivery": false
      }
    },
    {
      "type": "follow",
      "timestamp": 1625665242214,
      "source": {
        "type": "user",
        "userId": "FollowEventTestUserID"
      },
      "replyToken": "testReplyToken",//"bb173f4d9cf64aed9d408ab4e36339ad",
      "mode": "active",
      "webhookEventId": "01FZ74ASS536FW97EX38NKCZQK",
      "deliveryContext": {
        "isRedelivery": false
      }
    },
    {
      "type": "unfollow",
      "timestamp": 1625665242215,
      "source": {
        "type": "user",
        "userId": "Ubbd4f124aee5113..."
      },
      "mode": "active",
      "webhookEventId": "01FZ74B5Y0F4TNKA5SCAVKPEDM",
      "deliveryContext": {
        "isRedelivery": false
      }
    }
  ]
}




/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////