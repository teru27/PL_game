//その他のデータを保存
var END_POINT = "https://script.google.com/macros/s/AKfycbwdNAQLHDv0w40lNpIcz7cHPuYB53agT_4I7JJtCveVqIOrD6QIY0X8XcqY87UnoHWDCQ/exec"
//名前を保存
var END_POINT1 = "https://script.google.com/macros/s/AKfycbwn8aLWcJLzGN4PmOFIZyLuw_vsr_WDqoOP-d4jnS_UDlzkxImLiTKQIHuSBOuPkI6g4w/exec"
let start = new Date();
//このウインドを閉じたときに動く
$(window).on('beforeunload', function (event) {
    seve_data()
});

window.addEventListener("orientationchange", () => {
    let angle = screen && screen.orientation && screen.orientation.angle//端末の向きを取る縦なら0、横はOSによって変わる
    if (angle === -90 || angle === 270 || angle === 90) {
        alert('本システムは横向きには対応していません');
    }
});

window.onload = function () {
    document.body.onpaste = function () { return false; }
}

$(window).on('load', function () {
    let existence = localStorage.getItem('key')
    const newbutton1 = document.getElementById('button_commentary')//登録
    if (existence == null) {
        document.querySelector("#commentary").style.display = "block";//表示
        newbutton1.onclick = function () {
            document.querySelector("#commentary").style.display = "none";//表示
            document.querySelector("#start").style.display = "block";
        }
    }
    else {
        document.querySelector("#start").style.display = "block";
    }
});

function game_Start() {
    document.querySelector("#commentary").style.display = "none";//表示

    let existence = localStorage.getItem('key')
    sessionStorage.setItem('success', JSON.stringify(0));
    sessionStorage.setItem('failure', JSON.stringify(0));
    localStorage.setItem('login', JSON.stringify(0));
    localStorage.setItem('login_failure', JSON.stringify(0));


    if (existence == null) {
        game_commentary()
    }
    else {
        login()
    }
    document.querySelector("#start").style.display = "none";//非表示
}

function game_commentary() {
    let josn_data//データを受け取るための箱
    //読み書きするスプレッドシート（タブ）の番号
    const SHEET_NO = 1;
    //ここでスプレッドシートからデータを受け取る
    $.ajax({
        type: "GET",
        url: END_POINT1,
        data: { sheetNo: SHEET_NO }
    }).done((result) => {        // 成功した時の処理
        josn_data = result//代入
    }).fail((error) => {  // 失敗した時の処理
        alert('Error:' + JSON.stringify(error));
    }).always((data) => {// 常にやる処理
        // do something
    });
    $(document).ajaxStop(function () {
        game_register(josn_data)
    });
}

//初期登録
function game_register(josn_data) {
    document.querySelector("#commentary").style.display = "none";//非表示
    document.querySelector("#register").style.display = "block";//表示
    const newbutton1 = document.getElementById('button1')//登録
    let name//空の箱を作る
    //string型なのでオブジェクト型にする
    josn_data = (new Function("return" + josn_data))();
    console.log(josn_data)

    newbutton1.onclick = function () {
        let data = document.getElementsByClassName('passwd')[0].value
        console.log(data)
        if (data == " " * data.length) {
            alert('文字を入力してください')
        }
        //ここで文字数制限をしている
        else if (data.length > 36) {
            alert('36文字以内にしてください')
            document.getElementById('textbox').value = ""//ここでテキストボックスの中身を消す
        } else {
            let Mp = patten_strength(data)
            console.log(Mp)
            name = document.getElementsByClassName('coment')[0].value
            
            console.log(data)
            //二次元配列ならこれ
            const result = josn_data.some(function (value) {
                //配列内にnameが存在するかどうかを検索
                return value == name;

            });
            if (result) {
                // データが存在した時の処理
                window.alert("同じIDのため登録できません")
                document.getElementById('textbox').value = ""//ここでテキストボックスの中身を消す
            } else {

                // データが存在しなかった時の処理
                 patternLockseve(data, 1, name, Mp)//ローカルストレージに保存//ローカルストレージに保存
            }
        }
        
    }
}
//再登録
function game_re_register() {
    
    document.querySelector("#re_register").style.display = "block";//表示
    document.querySelector("#choice").style.display = "none";//非表示
    const newbutton2 = document.getElementById('button2')//登録
    //jQueryからpatternLockを取得して、#patternLock1に表示する

    window.document.onkeydown = function (event) {
        if (event.key === 'Enter') {
            a()
        }
    }

    newbutton2.onclick = function () {
        a()
    }
    function a() {
        let data = document.getElementsByClassName('passwd1')[0].value
        let Mp = patten_strength(data)
        if (data == " " * data.length) {
            alert('文字を入力してください')
        }
        //ここで文字数制限をしている
        else if (data.length > 36) {
            alert('36文字以内にしてください')
            document.getElementById('textbox').value = ""//ここでテキストボックスの中身を消す
        } else {
            alert("登録完了")
            patternLockseve(data, 2, name, Mp)
        }
    }
}

function re_login() {
    document.querySelector("#re_login").style.display = "block";//表示
    document.querySelector("#login").style.display = "none";//非表示
    const newbutton3 = document.getElementById('button3')//登録
    newbutton3.onclick = function () {
        a()
    }

    window.document.onkeydown = function (event) {
        if (event.key === 'Enter') {
            a()
        }
    }

    function a() {
        let data = document.getElementsByClassName('passwd2')[0].value
        let Mp = patten_strength(data)
        if (data == " " * data.length) {
            alert('文字を入力してください')
        }
        //ここで文字数制限をしている
        else if (data.length > 36) {
            alert('36文字以内にしてください')
            document.getElementById('textbox').value = ""//ここでテキストボックスの中身を消す
        } else {
            
            localStorage.setItem('key', JSON.stringify(data))
            localStorage.setItem('Mp', JSON.stringify(Mp))
            login()
        }
    }
}

function login() {
    document.querySelector("#try_login").style.display = "none";//表示
    document.querySelector("#register").style.display = "none";//非表示
    document.querySelector("#re_register").style.display = "none";//非表示
    document.querySelector("#commentary").style.display = "none";//非表示
    document.querySelector("#login").style.display = "block";//表示
    document.querySelector("#re_login").style.display = "none";//表示
    const newbutton4 = document.getElementById('button4')//登録

    newbutton4.onclick = function () {
        a()
    }
    window.document.onkeydown = function (event) {
        if (event.key === 'Enter') {
            a()
        }
    }
    function a() {
        let data = document.getElementsByClassName('passwd3')[0].value
        let password = JSON.parse(localStorage.getItem('key'))
        let login = JSON.parse(localStorage.getItem('login'))
        let login_failure = JSON.parse(localStorage.getItem('login_failure'))
        if (data == password) {
            login = login + 1
            alert("ログイン成功")
            localStorage.setItem('login', login);
            game_choice()
        } else {
            login_failure = login_failure + 1
            alert("ログイン失敗")
            localStorage.setItem('login_failure', login_failure);
            document.getElementById('login1').value = ""
        }
    }
}

function try_login() {
    document.querySelector("#try_login").style.display = "block";//表示
    document.querySelector("#choice").style.display = "none";//非表示

    const newbutton5 = document.getElementById('button_try_login')//登録
    newbutton5.onclick = function () {
        a()
    }
    window.document.onkeydown = function (event) {
        if (event.key === 'Enter') {
            a()
        }
    }

    function a() {
        let data = document.getElementsByClassName('passwd4')[0].value
        let login = JSON.parse(localStorage.getItem('login'))
        let login_failure = JSON.parse(localStorage.getItem('login_failure'))
        let password = JSON.parse(localStorage.getItem('key'))
        if (data == password) {
            login = login + 1
            alert("ログイン成功")
            localStorage.setItem('login', login);
        } else {
            login_failure = login_failure + 1
            alert("ログイン失敗")
            localStorage.setItem('login_failure', login_failure);
            document.getElementById('login1').value = ""
        }
    }

}

//ダンジョン選択
function game_choice() {
    document.getElementById('text_re_register').value = ""//ここでテキストボックスの中身を消す
   
    if (navigator.userAgent.match(/(iPhone|iPod|Android.*Mobile)/i)) {
        $("body").css("zoom", "100%");
    }
    $("#pgss10").css({ 'width': 0 + "%" });
    //document.querySelector("h11").textContent = "クリア"
    document.querySelector("#try_login").style.display = "none";//表示
    document.querySelector("#login").style.display = "none";//非表示
    document.querySelector("#register").style.display = "none";//非表示
    document.querySelector("#re_register").style.display = "none";//非表示
    document.querySelector("#choice").style.display = "block";//表示

}

function game_end() {
    document.querySelector("#battle").style.display = "none";//非表示
    document.querySelector("#choice").style.display = "none";//非表示
    document.querySelector("#end").style.display = "block";//表示

    seve_data()

}
//パスワードの強度を計る
function patten_strength(data, a, name) {
    let Mp = getPasswordLevel(data);
    let meter

    if (Mp >= 5) {
        meter = "強"
    } else if (Mp >= 3) {
        meter = "中"
    } else {
        meter = "弱"
    }
    const output = document.getElementById('register_Strength');
    const output1 = document.getElementById('re_register_Strength');
    output.textContent = "パタンロックの強度は" + meter + "です"
    output1.textContent = "パタンロックの強度は" + meter + "です"
    $("#pgss11").css({ 'width': Mp * 2 * 10 + "%" });
    $("#pgss10").css({ 'width': Mp*2 * 10 + "%" });
    $("#pgss9").css({ 'width': Mp*2 * 10 + "%" });
    console.log(Mp * 2 * 10)

    return Mp*2

}
//ここからは色々な処理
function patternLockseve(data, a, name, Mp) {
    console.log(Mp)
    if (Mp == NaN) {
        Mp = 0
    }
    localStorage.setItem('key', JSON.stringify(data))
    localStorage.setItem('Mp', JSON.stringify(Mp))
    //初期登録の時だけ保存
    if (a == 1) {

        localStorage.setItem('data', JSON.stringify(name))

        console.log('登録完了')

        localStorage.setItem(1, 0)
        localStorage.setItem(2, 0)
        localStorage.setItem(3, 0)
        localStorage.setItem('num', JSON.stringify(0));
        let data_name = [{ name: name }]
        const SHEET_NO = 1;
        let dataJSON1 = JSON.stringify(data_name);
        $.ajax({
            type: "POST",//データの送信方法
            url: END_POINT1,//送る場所のURL
            dataType: "json",//データの形式
            data: { sheetNo: SHEET_NO, data: dataJSON1 }
        })//ajaxが終わると動く
        $(document).ajaxStop(function () {
            login()
        });
    } else {
        game_choice();

    }

}

function seve_data(a) {
    //GAS WebアプリのURL
    //読み書きするスプレッドシート（タブ）の番号
    const SHEET_NO = 1;
    const loaddata = JSON.parse(localStorage.getItem('data'))
    const Mp = JSON.parse(localStorage.getItem('Mp'))
    let success = JSON.parse(sessionStorage.getItem('success'))
    let failure = JSON.parse(sessionStorage.getItem('failure'))
    let password = JSON.parse(localStorage.getItem('key'))

    let login = JSON.parse(localStorage.getItem('login'))
    let login_failure = JSON.parse(localStorage.getItem('login_failure'))

    let end = new Date();
    const Year = start.getFullYear();
    const Month = start.getMonth() + 1;
    const date = start.getDate();
    const Hour = start.getHours();
    const Minut = start.getMinutes();
    const Seconds = start.getSeconds();

    const Year_end = end.getFullYear();
    const Month_end = end.getMonth() + 1;
    const date_end = end.getDate();
    const Hour_end = end.getHours();
    const Minut_end = end.getMinutes();
    const Seconds_end = end.getSeconds();
    let play_time = end.getTime() - start.getTime()


    if (Math.abs(play_time) / (60 * 60 * 1000) > 0) {
        var playtime_H = Math.floor(Math.abs(play_time) / (60 * 60 * 1000))
        play_time = play_time - playtime_H * (60 * 60 * 1000)
    } else {
        var playtime_H = 0
    }

    if (Math.abs(play_time) / (60 * 1000) > 0) {
        var playtime_M = Math.floor(Math.abs(play_time) / (60 * 1000))
        play_time = play_time - playtime_M * (60 * 1000)
    } else {
        var playtime_M = 0
    }
    if (Math.abs(play_time) / 1000 > 0) {
        var playtime_S = Math.floor(Math.abs(play_time) / 1000)
        play_time = play_time - playtime_S * (1000)
    } else {
        var playtime_M = 0
    }

    let play_time1 = playtime_H + "時間" + playtime_M + "分" + playtime_S + "秒"
    let today_start = Year + "/" + Month + "/" + date + "/" + Hour + ":" + Minut + ":" + Seconds
    let today_end = Year_end + "/" + Month_end + "/" + date_end + "/" + Hour_end + ":" + Minut_end + ":" + Seconds_end


    let data2 = [{ name: loaddata, password: password, strength: Mp, success: success, failure: failure, start: today_start, end: today_end, playtime: play_time1, login: login, login_failure: login_failure}]

    let dataJSON = JSON.stringify(data2);
    console.log(dataJSON);

    //データがJSONかどうかのチェック
    try {
        const checkJSON = JSON.parse(dataJSON);
        if (checkJSON.length > 0 && Object.keys(checkJSON).length > 0) {
            console.log("data is OK");
        } else {
            throw "data is not array of object";
        }
    }
    catch (e) {
        return;
    }
    //POST送信
    $.ajax({
        type: "POST",//データの送信方法
        url: END_POINT,//送る場所のURL
        dataType: "json",//データの形式
        data: { sheetNo: SHEET_NO, data: dataJSON }
    })
    if (a != 1) {
        //ajaxが終わると動く
        $(document).ajaxStop(function () {

            //setTimeout('window.close()');
        });
    }

}
function setPasswordLevel(password) {
    patten_strength(password)
}
//ゲームリセット（デバックのための）
function alldelete() {
    //ローカルストレージの全てのデータ削除
    localStorage.clear()
}