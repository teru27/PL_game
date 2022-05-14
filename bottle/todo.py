# coding: utf-8
#ここでbottleを指定してサーバーを利用しようといている cssなどをインポートする
from bottle import route,run,template,request,static_file,url,get,post,response,error #色々引き出す
import json
import os
import webbrowser

@route('/static/<filepath:path>',name='static_file') 
def static(filepath): 
    return static_file(filepath,root='./static') 

@route('/',method='GET') #GETメゾット
def get():
  print("getが呼び出された")
  todo = request.query.todo
  radioname = request.query.radioname
  file={}

  #ラジオボタンが押されなかった場合の処理
  if not radioname and todo:
      radioname=4

  #データが送られてきたたら動作する
  if todo and radioname:
      #ファイル内にデータがあるか判別するif文を作る
      if filesize() == 0:
       with open('data.json', 'w',encoding='UTF-8') as f1:
        datalist = {todo:radioname}#辞書型のデータを作る
        json.dump(datalist, f1,indent=2,ensure_ascii=False)#ファイルに書き込む ensure_ascii=Falseをすることで文字化けしない
        #データがあるなら既存の辞書の後ろに「追加する又は結合する」を作る  
      else:
        #ファイルを開く
       with open('data.json', 'r',encoding='UTF-8') as f2:
        file = json.load(f2)#ファイル内のデータを受け取る
        #書き込むためにもう一度開く
       with open('data.json', 'w',encoding='UTF-8') as f2:
        datalist2 = {todo:radioname}#辞書型のデータを作る
        file.update(datalist2)#既存のファイルと結合する
        json.dump(file, f2,indent=2,ensure_ascii=False)#ファイルに書き込む
        
  #ロードされた際にファイルにデータが存在しているか判定
  if filesize() != 0:
   with open('data.json','r',encoding='UTF-8') as f3:#ファイルを開く
    loadfile = json.load(f3)#ファイル内のデータを受け取る
    return template('todo',loadfile=loadfile,size=filesize(),url=url) 
  else:
    loadfile = 0
    return template('todo',loadfile=loadfile,size=filesize(),url=url) 
  
#辞書の要素数を検知する
def filesize():
   with open('data.json','r',encoding='UTF-8') as f5:#ファイルを開く
      loadfile = json.load(f5)#ファイル内のデータを受け取る
   size  = len(loadfile)#辞書型の要素数を検知する
   return size 

#削除
@route('/a',method='GET')
def delete():
  data = request.query.data#JavaScriptからデータを受け取る
  #ファイルを開く
  with open('data.json','r',encoding='UTF-8') as f4:
    loadfile = json.load(f4)#ファイル内のデータを受け取る
    #送られていたキーがJOSNに存在しているか確認している
    if data in loadfile:
      loadfile.pop(data)#pop(キー名)で対応しているデータを削除する
    #書き込むためにもう一度開く
  with open('data.json', 'w',encoding='UTF-8') as f2:
    json.dump(loadfile,f2,indent=2,ensure_ascii=False)#ファイルに書き込む
   #ロードされた際にファイルにデータが存在しているか判定
  if filesize() != 0:
   with open('data.json','r',encoding='UTF-8') as f3: #ファイルを開く
    loadfile = json.load(f3)#ファイル内のデータを受け取る
    return template('todo',loadfile=loadfile,size=filesize(),url=url) 
  else:
    loadfile = 0
    return template('todo',loadfile=loadfile,size=filesize(),url=url) 

#全削除
@route('/b')
def alldelete():
  with open('data.json','r',encoding='UTF-8') as f5: #ファイルを開く
    loadfile = json.load(f5)#ファイル内のデータを受け取る
    loadfile.clear()#clear()で全データを削除する
  with open('data.json', 'w',encoding='UTF-8') as f6:#書き込むためにもう一度開く
    json.dump(loadfile,f6,indent=2,ensure_ascii=False)#ファイルに書き込む
   #ロードされた際にファイルにデータが存在しているか判定
  if filesize() != 0:
   with open('data.json','r',encoding='UTF-8') as f3:
    loadfile = json.load(f3)
    return template('todo',loadfile=loadfile,size=filesize(),url=url) 
  else:
    loadfile = 0
    return template('todo',loadfile=loadfile,size=filesize(),url=url) 
 
#サーバーの起動　debug = Trueをすることでエラーが分かりやすくなる
run( host ='localhost', port = 8082, debug = True)
