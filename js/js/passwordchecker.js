/*
  ライブラリ名：
     Password Checker
  
  バージョン：
     1.0.1
    
  ライセンス：
     http://www.websec-room.com/license
  
  パスワード強度判定
    1:弱い 2:やや弱い 3:普通 4:やや強い 5:強い
*/
function getPasswordLevel(password) {
 
  var level = 0;
  var pattern = 0;
  var hasLower = false;
  var hasUpper = false;
  var hasCharacter = false;
  var hasNumber = false;
  
  
  for (i = 0; i < password.length; i++) {
  
    var ascii = password.charCodeAt(i);
    
    //アルファベット小文字チェック
    if ((ascii >= 97) && (ascii <= 122)) {
      hasLower = true;
    }
    
    //アルファベット大文字チェック
    if ((ascii >= 65) && (ascii <= 90)) {
      hasUpper = true;
    }
    
    //数値チェック
    if ((ascii >= 48) && (ascii <= 57)) {
      hasNumber = true;
    }
    
    //記号チェック
    if (((ascii >= 33) && (ascii <= 47)) ||
        ((ascii >= 58) && (ascii <= 64)) ||
        ((ascii >= 91) && (ascii <= 96)) ||
        ((ascii >= 123) && (ascii <= 126))) {
        hasCharacter = true;
    }
  }
  
  //パターン判別  
  if (hasLower) {pattern++;}
  if (hasUpper) {pattern++;}
  if (hasNumber) {pattern++;}
  if (hasCharacter) {pattern++;}
  
 
  //パスワードレベル判定 

  //辞書に登録されている文字チェック
  var dictionary = ["password","qwerty","abc","admin","root","123"];
  
  for (i = 0; i < dictionary.length; i++) {
    if (password.indexOf(dictionary[i]) != -1) {
      level = 1;
      return level;
    }
  }
  
  //数値のみパスワードチェック
  if (password.match(/^[0-9]+$/)) {
    level = 1;
    return level;
  }
  
  if (password.length < 8) {
    level = 1;
  }
  if ((password.length >= 8) && (password.length < 14)) {
    level = 2;
  }
  if ((password.length >= 8) && (password.length < 14) && (pattern >= 2)) {
    level = 3;
  }
  if ((password.length >= 8) && (password.length < 14) && (pattern >= 3)) {
    level = 4;
  }
  if ((password.length >= 14) && (pattern < 3)) {
    level = 3;
  }
  if ((password.length >= 14) && (pattern >= 3)) {
    level = 5;
  }
  
  
  return level;
}