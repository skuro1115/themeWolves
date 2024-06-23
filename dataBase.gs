function testDB(){
  testSystem()
}


// ///配列ではなく，連想配列にする可能性大
// let TestGameData = {
// 		"content" : {},
// 		"userDB"  : {},
// 		"roomDB"  : {},
// 		"messages": []
// }



///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////一旦放置//////
///finished   testok　　　他での実装待ち
/**
 * left 　　　 add function(len(userId) != 1)
 * @param{String} dataJSON - 
 * @return{Array} gameData -[dataJSON, userData[], roomData[][]]  if roomId is not exist => roomData = []
*/
function referDB(dataJSON){
  const userId  = dataJSON.events[0].source.userId;
  const mytext  = dataJSON.events[0].message.text;
  const token   = dataJSON.events[0].replyToken;
  send_line("referDB() \n refer \n\n" + userId);
  const content = {
    "userId" : userId,
    "text"   : mytext,
    "token"  : token,
    "stock"  : []
  }

  const filterByKeyword = (data2d, keyword, columnIndex=1) =>{return data2d.filter(row => row[columnIndex] === keyword);};
  const sourceData     = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users").getDataRange().getValues();
  let   matchDataArray = filterByKeyword(sourceData, userId, 1);
  if(matchDataArray.length === 0){firstDB(dataJSON); matchDataArray=[[]]};
  if(matchDataArray.length !== 1){Logger.log("userIdの数が適切でありません")}  /**add 現状強制1番上? */
  const userData = {
    "time"   : matchDataArray[0][0]?? new Date(),
    "userId" : matchDataArray[0][1]?? userId,
    "flag"   : matchDataArray[0][2]?? "0",
    "roomId" : matchDataArray[0][3]?? null,
    "name"   : matchDataArray[0][4]?? null,
    "answer" : matchDataArray[0][5]?? null,
    "role"   : matchDataArray[0][6]?? null
  }
  
  const getRoomFromSheet = function(sheetName){  
    if(!userData.roomId){Logger.log("No roomID");return null}
    const values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getDataRange().getValues(); 
    if(values.length <= 2){Logger.log("roomDB is broken");return null}
    
    let roomObj = {
      "info"   :{ 
        "time"    : values[0][0],
        "roomId"  : values[0][1],
        "max"     : values[0][2]??null,
        "rule"    : values[0][3]??null,
        "theme"   : values[0][4]??null,
        "masterId": values[0][5],
        "end"     : values[0][6]??null
      },
      "people" : values.slice(1)
  	}
    return roomObj
  }
  
  const gameData = {
    "content" : content,
    "userDB"  : userData,
    "roomDB"  : getRoomFromSheet(userData.roomId),
    "messages": []
  }

  return gameData;
}


/**
 * gamedataのうち userDB roomDB.info　のみ更新する。   (roomDB.people の他人部分は更新しない)
 * @param{Array} fleshGameData - [JSON, UserDB[], RoomDB[][]] 
 * @see filterByKeyword()
 */
function updataDB(fleshGameData){
  send_line("updateDB()")
  Logger.log(fleshGameData)
  const filterByKeyword = (data2d, keyword, columnIndex=1) =>{return data2d.filter(row => row[columnIndex] === keyword);};

  if(! fleshGameData){return Logger.log("updateDB(): No data")}
  let userId = fleshGameData.userDB.userId ?? null;
  let roomId = fleshGameData.userDB.roomId ?? null;
  let userDB = Object.values(fleshGameData.userDB)

  function replaceRowsByKeyword(keyword, dataArray, sheetName) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
    if(!sheet){return}
    const data  = sheet.getDataRange().getValues();
    for (var i = 0; i < data.length; i++) {
      if (data[i].join().indexOf(keyword) == -1) {continue};
      return sheet.getRange(i + 1, 1, 1, dataArray.length).setValues([dataArray]);
    }
  }

  if(!userId){Logger.log("upDB No userId");fleshGameData.messages.push("Err No userID");return fleshGameData}
  replaceRowsByKeyword(userId , userDB, "users"); //userArray
  if(!roomId){Logger.log("upDB No roomId");fleshGameData.messages.push("upDB No roomID");return fleshGameData}
  replaceRowsByKeyword(userId , userDB, roomId );  //roomArray userIdに一致する行のみ
  if(!fleshGameData.roomDB.info){Logger.log("No roomInfo");return fleshGameData}
  let roomInfo = Object.values(fleshGameData.roomDB.info)
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(roomId);
  sheet.getRange(1, 1, 1, roomInfo.length).setValues([roomInfo])

  return fleshGameData
}


/**
 * @param{String} dataJSON - 
 * @return{String} dataJSON -
*/
function firstDB(dataJSON){
  send_line("No userId? \nfirstDB()")
  const userId  = dataJSON.events[0].source.userId;
  const mytext  = dataJSON.events[0].message.text;//　　　　　将来的に名前登録ここでしてもいいかも
  const dataArr = [new Date(), userId, "0", null, null, null, null]
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users").appendRow(dataArr)
  return dataJSON
}





////　　データ構造　置き換え中
//// * @deprecated　
////
////
////
////
////
////
////
////
////
////
////
/*aa*/


/**
 * left 　　　 add function(len(userId) != 1)
 * @param{String} dataJSON - 
 * @return{Array} gameData -[dataJSON, userData[], roomData[][]]  if roomId is not exist => roomData = []
 * @deprecated　
 * 
 */
function DDDreferDB(dataJSON){
  const userId   = dataJSON.events[0].source.userId;
  send_line("referDB() \n refer \n\n" + userId)

  const sourceData     = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users").getDataRange().getValues();
  const matchDataArray = filterByKeyword(sourceData, userId, 1);
  if(matchDataArray.length === 0){send_line("No userId found")}                            ///add
  if(matchDataArray.length !== 1){send_line("userIdの数が適切でありません")}                            ///add

  const userData       = matchDataArray[0];///先頭を選択
  if(typeof(userData[3])=="undefined"){Logger.log("roomId in userDB is undefined");return [dataJSON, userData,[]]}
  if(!(userData[3])){Logger.log("roomId in userDB  is empty");return [dataJSON, userData, []]};
  const roomData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(userData[3]).getDataRange().getValues(); 

  const dataJSONforGame = {
    "userId"    : dataJSON.events[0].source.userId,
    "text"      : dataJSON.events[0].message.text, 
    "replyToken": dataJSON.events[0].replyToken
  }

  return [dataJSONforGame, userData, roomData];
}



/**
 * @param{Array} newGameData - [JSON, UserDB[], RoomDB[][]] 
 * @see filterByKeyword()
 * @see replaceRowsByKeyword()
 * @deprecated　
 * 
 */
function DDDupdataDB(newGameData){
  send_line("updateDB()")
  Logger.log("updateDB()")

  function replaceRowsByKeyword(keyword, dataArray, sheetName) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
    if(!sheet){return}
    const data  = sheet.getDataRange().getValues();
    for (var i = 0; i < data.length; i++) {
      if (data[i].join().indexOf(keyword) == -1) {continue};
      return sheet.getRange(i + 1, 1, 1, dataArray.length).setValues([dataArray]);
    }
  }


  if(! newGameData){return Logger.log("updateDB(): No data")}
  replaceRowsByKeyword(newGameData[1][1] , newGameData[1]   , "users");          //userArray
  const newDataArray = filterByKeyword(newGameData[2], newGameData[1][1], 1)
  replaceRowsByKeyword(newGameData[1][3] , newGameData[2][0], newGameData[1][3]);//roomArray 0番目
  replaceRowsByKeyword(newGameData[1][1] , newDataArray     , newGameData[1][3]);//roomArray userIdに一致する行のみ
  return newGameData

}


