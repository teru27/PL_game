const END_POINT = "https://script.google.com/macros/s/AKfycbyITmeqw_d-IdnAzsud5fzLHOt4A2wwOJ0CWa5Wxe7J-Fac6ZFOYRQuQbbzURLOc8hh/exec";
const END_POINT1 = "https://script.google.com/macros/s/AKfycbwn8aLWcJLzGN4PmOFIZyLuw_vsr_WDqoOP-d4jnS_UDlzkxImLiTKQIHuSBOuPkI6g4w/exec"
let start = new Date();
//このウインドを閉じたときに動く
$(window).on('beforeunload', function (event) {
    seve_data()
});
function game_Start() {
    let local_length = localStorage.length//ローカルストレージの内の個数
    sessionStorage.setItem('success', JSON.stringify(0));
    sessionStorage.setItem('failure', JSON.stringify(0));
    let josn_data
    //GAS WebアプリのURL
    //const END_POINT = "https://script.google.com/macros/s/AKfycbxY26C_z6TlaPzPI-cxNPZNbS0N36OPGb7m1W0oKoZRnS2wcnI4ttTW0dtDcDLqyPOk/exec";
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
    if (local_length < 4) {
        $(document).ajaxStop(function () {

            game_register(josn_data)
        });
    }
    else {
        game_choice()
    }
    document.querySelector("#start").style.display = "none";//非表示
}
//初期登録
function game_register(josn_data) {
    document.querySelector("#register").style.display = "block";//表示
    const newbutton1 = document.getElementById('button1')//登録
    let name//空の箱を作る
    //string型なのでオブジェクト型にする
    josn_data = (new Function("return" + josn_data))();
    console.log(josn_data)

    //jQueryからpatternLockを取得して、#patternLock1に表示する
    $('#patternLock_register').patternLock({
        timeout: 100000,//表示時間(1000で1秒)
        //showPatternLine: false,//ルートの非表示
        drawEnd: function (data) {
            let Mp = patten_strength(data)

            newbutton1.onclick = function () {

                name = document.getElementsByClassName('coment')[0].value
                
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
                    
                    if (Mp == null) {
                        console.log("b")
                        Mp = 0
                    }
                    // データが存在しなかった時の処理
                    patternLockseve(data, 1, name, Mp)//ローカルストレージに保存//ローカルストレージに保存
                }
            }
        }
    });

}
//再登録
function game_re_register() {
    document.querySelector("#re_register").style.display = "block";//表示
    document.querySelector("#choice").style.display = "none";//非表示
    const newbutton2 = document.getElementById('button2')//登録
    //jQueryからpatternLockを取得して、#patternLock1に表示する
    
    $('#patternLock_re_register').patternLock({
        timeout: 1000,//表示時間(1000で1秒)
        //showPatternLine: false,//ルートの非表示
        drawEnd: function (data) {
            let Mp = patten_strength(data)
            newbutton2.onclick = function () {
                $("#pgss10").css({ 'width': Mp * 100 + "%" });
                patternLockseve(data, 2, name, Mp)
            }
        }
    });

}


function game_choice() {
    localStorage.setItem('map1', JSON.stringify(0));
    localStorage.setItem('map', JSON.stringify(0));
    sessionStorage.setItem('px', JSON.stringify(0));
    sessionStorage.setItem('py', JSON.stringify(0));
    sessionStorage.setItem('battle_now', JSON.stringify(0));
    sessionStorage.setItem('obstacle_now', JSON.stringify(0));
    localStorage.setItem('map1', JSON.stringify(0));
    
    let num = JSON.parse(localStorage.getItem('num'))
    localStorage.setItem('hp', JSON.stringify(150+(num*15)));
    localStorage.setItem('hp_max', JSON.stringify(150 + (num * 15)));
    for (let i = 1; i < 4; i++) {
        let number1 = localStorage.getItem(i)
        console.log(number1)
       
        if (number1 == 1) {
            document.querySelector("h1" + i).textContent = "クリア"
        }
        else {
            document.querySelector("h1" + i).textContent = "未クリア"
        }
    }
    //document.querySelector("h11").textContent = "クリア"

    document.querySelector("#register").style.display = "none";//非表示
    document.querySelector("#battle").style.display = "none";//非表示
    document.querySelector("#game_map").style.display = "none"//非表示
    document.querySelector("#re_register").style.display = "none";//非表示
    document.querySelector("#clear").style.display = "none";//表示
    document.querySelector("#over").style.display = "none";//表示
    document.querySelector("#map_ch").style.display = "none";//非表示
    document.querySelector("#choice").style.display = "block";//表示

}
function game_map(num) {
    document.querySelector("h20").textContent ="ダンジョン"+ num
    let cun_num = 0
    document.querySelector("#choice").style.display = "none";//非表示
    document.querySelector("#battle").style.display = "none";//非表示
    document.querySelector("#map_ch").style.display = "none";//非表示
    document.querySelector("#game_map").style.display = "block";//表示
    let min = 0
    let max = 2
    var n = Math.floor(Math.random() * (max + 1 - min)) + min;
    var gc
    if (num == 1) {
        var map1 = [//マップデータ
            [[0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 0, 0, 1, 1, 1, n, 1, 0, 1, 1, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 0, n, 0, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 0, n, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
            [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, n, 0, 0, 0, 0, 0, 2, 0, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, n, 1, 1],
            [1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, n],
            [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 1, 1, 1, 0, n, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 3]],

            [[0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0],
            [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 2, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
            [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1],
            [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0],
            [0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0],
            [0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3]]

        ];
    }
    if (num == 2) {
        var map1 = [//マップデータ
            [[0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1],
            [1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
            [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0],
            [0, 0, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 0, 1, 2, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1],
            [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1],
            [3, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1]],

            [[0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1],
            [0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 2, 0, 1, 1, 1, 1],
            [0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
            [0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],

            [[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1],
            [1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1],
            [1, 1, 0, 0, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1],
            [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
            [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0],
            [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 3]]

        ];
    }
    if (num == 3) { 
        var map1 = [//マップデータ
            [[0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
            [0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
            [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 3]],
            [[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 3],
            [0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
            [0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
            [1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 2, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
            [1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
            [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1]],
            [[0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1],
            [1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1],
            [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0],
            [1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0],
            [1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 2, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 3]],
            [[0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 3, 0, 1, 0, 1],
            [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1],
            [1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1],
            [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]

        ];
    }

    localStorage.setItem('map', JSON.stringify(map1[0]));
    if (JSON.parse(localStorage.getItem('map1')) == 0) {
        var map = JSON.parse(localStorage.getItem('map'));
    } else {
        var map = JSON.parse(localStorage.getItem('map1'));
    }
    
    function initialize() {
        gc = document.getElementById("test").getContext("2d");
        document.onkeydown = keydown;
        paint();
    }
    initialize()
    function keydown(e) {
        //イベント中は動かない
        let battle_now = JSON.parse(sessionStorage.getItem('battle_now'));
        let obstacle_now = JSON.parse(sessionStorage.getItem('obstacle_now'));
        if (battle_now != 1 && obstacle_now != 1) {
            charactermove(e.keyCode);
        }
    }
    //キャラの移動
    function charactermove(keyCode) {
        let px = JSON.parse(sessionStorage.getItem('px'))
        let py = JSON.parse(sessionStorage.getItem('py'));
        let min = 0
        let max = 1
        let n = Math.random(min, max)
        let hitx = px, hity = py;//当たり判定用の変数を作成
        let d = 0, c = 0
        let ch = 0
        let map_move = 0
            switch (keyCode) {
                case 39:
                case 68:
                    c = 0
                    d = 55 * 3
                    if ((map[hity][hitx + 1]) == 0 ) {
                        px++;//右移動
                    } else if ((map[hity][hitx + 1]) == 2) {
                        map_move = 1
                        map[hity][hitx + 1] = 0
                        sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                        obstacle(map_move, hitx, hity, c, d)
                    } else if ((map[hity][hitx + 1]) == 3) {
                        cun_num = cun_num + 1
                        ch = 1
                        sub(cun_num)
                    }
                    break;
                case 37:
                case 65:
                    c = 0
                    d = 55 * 2
                    if ((map[hity][hitx - 1]) == 0 ) {
                        px--;//左移動
                    } else if ((map[hity][hitx - 1]) == 2) {
                        map_move = 2
                        map[hity][hitx - 1] = 0
                        sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                        obstacle(map_move, hitx, hity, c, d)
                    } else if ((map[hity][hitx - 1]) == 3) {
                        cun_num = cun_num + 1
                        ch = 1
                        sub(cun_num)
                    }
                    break;
                case 38:
                case 87:
                    c = 0
                    d = 0
                    if (py > 0) {
                        if ((map[hity - 1][hitx]) == 0 ) {
                            py--;//上移動
                        } else if ((map[hity - 1][hitx]) == 2) {
                            map_move = 3
                            map[hity - 1][hitx] = 0
                            sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                            obstacle(map_move, hitx, hity, c, d)
                        } else if ((map[hity - 1][hitx]) == 3) {
                            cun_num = cun_num + 1
                            ch = 1
                            sub(cun_num)
                        }
                    }
                    break;
                case 40:
                case 83:
                    c = 0
                    d = 55
                    if (py < 14) {
                        if ((map[hity + 1][hitx]) == 0 ) {
                            py++;//下移動
                        } else if ((map[hity + 1][hitx]) == 2) {
                            map_move = 4
                            map[hity + 1][hitx] = 0
                            sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                            obstacle(map_move, hitx, hity, c, d)
                        } else if ((map[hity + 1][hitx]) == 3) {
                            cun_num = cun_num + 1
                            ch = 1
                            sub(cun_num)
                        }
                    }
                    break;
            }
        if (n < 0.2) {
            //プレイヤーの位置を更新
            //localStorage.setItem('map1', JSON.stringify(map));
            sessionStorage.setItem('battle_now', JSON.stringify(1));
            game_battle(num)
            console.log("接敵")
        }
            sessionStorage.setItem('px', JSON.stringify(px));
            sessionStorage.setItem('py', JSON.stringify(py));
        if (ch == 1) {
            sessionStorage.setItem('px', JSON.stringify(0));
            sessionStorage.setItem('py', JSON.stringify(0));
            ch = 0
        }
        paint(c, d);
    }

    function paint(c, d,ch) {
        let px = JSON.parse(sessionStorage.getItem('px'))
        let py = JSON.parse(sessionStorage.getItem('py'));
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[y].length; x++) {

                if (map[y][x] == 0) {
                    gc.drawImage(map002, 0, 0, 48, 48, x * 48, y * 48, 48, 48);

                }
                else if (map[y][x] == 1) {
                    gc.drawImage(map002, 5 * 48, 48 * 40, 48, 48, x * 48, y * 48, 48, 48);

                } else if (map[y][x] == 2) {
                    gc.drawImage(map002, 4 * 48, 48 * 40, 48, 48, x * 48, y * 48, 48, 48);

                } else if (map[y][x] == 3) {
                    gc.drawImage(map001, 0, 0, 48, 48, x * 48, y * 48, 48, 48);

                }
            }
        }
        if (c == undefined && d == undefined) {
            c = 0
            d = 55
        }
        gc.drawImage(character1, c, d, 32, 48, px * 48, py * 48, 48, 48);
        //gc.drawImage(keyimg, 840, 0);
    }
    //ダンジョン切り替えとクリア判定
    function sub(cun_num) {
        let cun = cun_num
        console.log(num + 1)
        console.log(cun_num)
        console.log(cun)
        if (num + 1 == cun) {
            game_clear(num)
        } else {
            map = map1[cun]
            localStorage.setItem('map1', JSON.stringify(map));
        }
        px = 0
        py = 0
    }
    function obstacle(map_move, hitx, hity, c, d) {
        document.querySelector("#game_map").style.display = "none";
        document.querySelector("#map_ch").style.display = "block";//表示
        let key = JSON.parse(localStorage.getItem('key'))
        let px = JSON.parse(sessionStorage.getItem('px'))
        let py = JSON.parse(sessionStorage.getItem('py'));
        


        $('#patternLock_map').patternLock({
            timeout: 1000,//表示時間(1000で1秒)
            //showPatternLine: false,//ルートの非表示
            drawEnd: function (data) {
                if (data == key) {
                    //マップの変更
                    gc.drawImage(map002, 0, 0, 48, 48, hitx * 48, hity * 48, 48, 48);

                    localStorage.setItem('map1', JSON.stringify(map));
                    sessionStorage.setItem('obstacle_now', JSON.stringify(0));
                    document.querySelector("#game_map").style.display = "block";//表示
                    document.querySelector("#map_ch").style.display = "none";//表示
                    paint(c, d, px, py)
                }

            }
        });
    }
}

function game_battle(dungeon_number) {

    let success = JSON.parse(sessionStorage.getItem('success'))
    let failure = JSON.parse(sessionStorage.getItem('failure'))
    let Mp = JSON.parse(localStorage.getItem('Mp'))

    let min1 = -5 * dungeon_number
    let max1 = 5 * dungeon_number
    let n = Math.floor(Math.random() * (max1 + 1 - min1)) + min1;
    //自分の体力
    let player_physical = JSON.parse(localStorage.getItem('hp'))
    let player_physical_max = JSON.parse(localStorage.getItem('hp_max'))
            //敵体力
    let enemy_physical = 95 + n
    let enemy_physical_max = enemy_physical//敵体力の最大値を更新
    sessionStorage.setItem('enemy', JSON.stringify(enemy_physical));

    let Defense_p = 25
    let Offensive_p=0
    let min = 1;//乱数用
    let max = 7;//乱数用
    let enemy_number = Math.floor(Math.random() * (max + 1 - min)) + min;//乱数生成
    document.getElementById("pgss1").textContent = enemy_physical;
    $("#pgss1").css({ 'width':100 + "%" });
    $("#ph" + dungeon_number).css({ 'width': (player_physical / player_physical_max) * 100 + "%" });
    //document.querySelector("h" + dungeon_number).textContent = "ダンジョン" + dungeon_number + "-" + n;
    document.querySelector("#game_map").style.display = "none";//非表示
    document.querySelector("#battle").style.display = "block";//表示
    
    console.log(enemy_physical)
    let img = document.getElementById("monster");
    img.src = "img/" + dungeon_number + "/monster" + dungeon_number + "-" + enemy_number + ".png";
    
    //jQueryからpatternLockを取得して、#patternLock1に表示する
    $('#patternLock1').patternLock({
        timeout: 800,//表示時間(1000で1秒)
        //showPatternLine: false,//ルートの非表示
        //#patternLock1のvalueを取る
        drawEnd: function (data) {
            const loaddata = JSON.parse(localStorage.getItem('key'))
            
            let enemy = JSON.parse(sessionStorage.getItem('enemy'))
            let hp = JSON.parse(localStorage.getItem('hp'))
            //patternLockの値の判定
            if (loaddata == data) {
                
                success = success + 1//認証の成功回数
                console.log(enemy)
                //防御力に対しての攻撃力の計算
                if ((Mp * 100) < (Defense_p * dungeon_number)) {

                    Offensive_p = (Mp * 100) - (Defense_p * dungeon_number)

                } else {
                    Offensive_p = (Mp * 100)
                }
                if (Offensive_p < 0) {
                    player_physical = player_physical - 50//プレイヤーの体力を減らす
                    $("#ph" + dungeon_number).css({ 'width': player_physical });
                    if (player_physical < 0) {
                        player_physical = 100
                        game_over(dungeon_number)
                    }
                }
                console.log(Math.floor(Offensive_p))
                enemy = enemy - Math.floor(Offensive_p)//敵の体力計算
                sessionStorage.setItem('enemy', JSON.stringify(enemy));//敵のHPの更新
                document.getElementById("pgss1").textContent = enemy;
                sessionStorage.setItem('success', JSON.stringify(success));
                //敵のHPゲージ
                $("#pgss1").css({ 'width': (enemy / enemy_physical_max)*100 +"%" });

                console.log("成功" + enemy)
                //倒した時の処理
                if (enemy < 0 || enemy==0) {
                    const delay_processing = () => {
                        
                        
                        sessionStorage.setItem('battle_now', JSON.stringify(0));
                        game_map(dungeon_number)
                    }
                    setTimeout(delay_processing, 500);

                }

            }
            else {
                failure = failure + 1
                sessionStorage.setItem('failure', JSON.stringify(failure));
                hp = hp - 50//プレイヤーの体力を減らす
                localStorage.setItem('hp', JSON.stringify(hp));//自分のHPの更新
                $("#ph" + dungeon_number).css({ 'width': (hp / player_physical_max) * 100 + "%" });
                if (hp < 0 || hp==0) {
                    game_over(dungeon_number)
                }
            }



        }
    });

}


function game_clear(dungeon_number) {
    localStorage.setItem('map1', JSON.stringify(0));
    localStorage.setItem('map', JSON.stringify(0));
    let num = JSON.parse(localStorage.getItem('num'))
    num=1+num
    localStorage.setItem('num', JSON.stringify(num));
    document.querySelector("#battle").style.display = "none";
    document.querySelector("#game_map").style.display = "none";
    document.querySelector("#clear").style.display = "block";//表示

    dungeon_sevedata(dungeon_number)

}

function game_over(dungeon_number) {
    localStorage.setItem('map1', JSON.stringify(0));
    localStorage.setItem('map', JSON.stringify(0));
    document.querySelector("#battle").style.display = "none";
    document.querySelector("#over").style.display = "block";//表示
}

function game_end() {
    document.querySelector("#battle").style.display = "none";//非表示
    document.querySelector("#choice").style.display = "none";//非表示
    document.querySelector("#end").style.display = "block";//表示

    seve_data()

}

function dungeon_sevedata(dungeon_number) {

    localStorage.setItem(dungeon_number, 1)

    console.log('ダンジョンクリア')
}

function patten_strength(data, a, name) {
    let Lp = 0
    let Ip = 0
    let Np = 0
    let Mp = 0
    let x = 0
    let y = 0
    let Np_array = []
    let Np_array_m = []
    let x1 = 0
    let y1 = 0
    let x2 = 0
    let y2 = 0
    let x_result = 0
    let b_result = 0
    let x_b_result = []
    let a1 = 0
    let b1 = 0
    let a2 = 0
    let b2 = 0
    let xp = 0
    let yp = 0
    let xp_r = 0
    let yp_r = 0
    let array = []
    const dis = [
        [0, 1, 2, 1, 1, 2, 2, 2, 2],
        [1, 0, 1, 1, 1, 1, 2, 2, 2],
        [2, 1, 0, 2, 1, 1, 2, 2, 2],
        [1, 1, 2, 0, 1, 2, 1, 1, 2],
        [1, 1, 1, 1, 0, 1, 1, 1, 1],
        [2, 1, 1, 2, 1, 0, 2, 1, 1],
        [2, 2, 2, 1, 1, 2, 0, 1, 2],
        [2, 2, 2, 1, 1, 1, 1, 0, 1],
        [2, 2, 2, 2, 1, 1, 2, 1, 0]
    ]
    //Pattern Lockの座標
    const origin = [
        { x: 0, y: 0 },//1
        { x: 0, y: 1 },//2
        { x: 0, y: 2 },//3
        { x: 1, y: 0 },//4
        { x: 1, y: 1 },//5
        { x: 1, y: 2 },//6
        { x: 2, y: 0 },//7
        { x: 2, y: 1 },//8
        { x: 2, y: 2 },//9
    ]
    data = data.replace(/,/g, '');//「,」を消す
    let PL_array = Array.from(data)//配列化
    for (i = 0; i < PL_array.length - 1; i++) {
        Lp += dis[PL_array[i] - 1][PL_array[i + 1] - 1]
    }
    for (let i = 0; i < PL_array.length - 1; i++) {
        x1 = origin[PL_array[i] - 1].x
        y1 = origin[PL_array[i] - 1].y
        x2 = origin[PL_array[i + 1] - 1].x
        y2 = origin[PL_array[i + 1] - 1].y
        if (PL_array[i + 1] - 1 > PL_array[i] - 1) {
            array.push(x1 + "," + y1 + "," + x2 + "," + y2)
        } else {
            array.push(x2 + "," + y2 + "," + x1 + "," + y1)
        }
        x_result = (y2 - y1) / (x2 - x1)
        b_result = ((x2 * y1) - (x1 * y2)) / (x2 - x1)
        if (isNaN(x_result) || !isFinite(x_result)) {
            x_result = 0
        }
        if (isNaN(b_result) || !isFinite(b_result)) {
            b_result = 0
        }
        x_b_result.push({ x: x_result, b: b_result })
    }
    for (let i = 0; i < x_b_result.length; i++) {
        a1 = x_b_result[i].x
        b1 = x_b_result[i].b
        for (let i = 0; i < x_b_result.length; i++) {
            a2 = x_b_result[i].x
            b2 = x_b_result[i].b
            xp = (b2 - b1) / (a1 - a2)
            yp = (a1 * xp) + b1
            if (!isNaN(xp) && !isNaN(yp)) {
                xp_r = Math.round(xp * 10) / 10
                yp_r = Math.round(yp * 10) / 10
                if (xp_r == 0.3 && yp_r == 0.7) {
                    Ip++
                } else if (xp_r == 0.7 && yp_r == 1.3) {
                    Ip++
                } else if (xp_r == 1.3 && yp_r == 0.7) {
                    Ip++
                } else if (xp_r == 1.7 && yp_r == 1.3) {
                    Ip++
                }
                else if (xp_r == 0.7 && yp_r == 0.7) {
                    Ip++
                } else if (xp_r == 0.3 && yp_r == 1.3) {
                    Ip++
                } else if (xp_r == 1.7 && yp_r == 0.7) {
                    Ip++
                } else if (xp_r == 1.3 && yp_r == 1.3) {
                    Ip++
                }
                else if (xp_r == 0.7 && yp_r == 0.3) {
                    Ip++
                } else if (xp_r == 1.3 && yp_r == 1.7) {
                    Ip++
                } else if (xp_r == 1.3 && yp_r == 0.3) {
                    Ip++
                } else if (xp_r == 0.7 && yp_r == 1.7) {
                    Ip++
                }
            } else {
                break
            }
        }
    }
    if (array.includes('0,2,2,1') && array.includes('1,1,1,2') || array.includes('1,0,1,2') && array.includes('0,2,2,1')) {
        Ip = Ip + 2
    }
    else if (array.includes('0,1,2,0') && array.includes('1,0,1,1') || array.includes('1,0,1,2') && array.includes('0,1,2,0')) {
        Ip = Ip + 2
    }
    else if (array.includes('0,0,2,1') && array.includes('1,0,1,1') || array.includes('1,0,1,2') && array.includes('0,0,2,1')) {
        Ip = Ip + 2
    }
    else if (array.includes('0,1,2,2') && array.includes('1,1,1,2') || array.includes('1,0,1,2') && array.includes('0,1,2,2')) {
        Ip = Ip + 2
    }

    if (array.includes('0,1,1,1') && array.includes('0,0,1,2') || array.includes('0,2,1,0') && array.includes('0,1,1,1')) {
        Ip = Ip + 2
    }
    else if (array.includes('1,1,2,1') && array.includes('1,2,2,0') || array.includes('1,0,2,2') && array.includes('1,1,2,1')) {
        Ip = Ip + 2
    }

    if (array.includes('0,0,1,1') && array.includes('0,1,1,0') || array.includes('0,0,2,2') && array.includes('0,1,1,0')) {
        Ip = Ip + 2
    } if (array.includes('0,1,1,2') && array.includes('0,2,1,1') || array.includes('0,2,2,0') && array.includes('1,0,2,1')) {
        Ip = Ip + 2
    } if (array.includes('1,0,2,1') && array.includes('1,1,2,0') || array.includes('0,2,2,0') && array.includes('0,1,1,2')) {
        Ip = Ip + 2
    } if (array.includes('1,1,2,2') && array.includes('1,2,2,1') || array.includes('0,0,2,2') && array.includes('1,2,2,1')) {
        Ip = Ip + 2
    }


    console.log(Ip)
    if (array.includes('0,0,1,1') && array.includes('0,2,2,1')) {
        Ip = Ip - 2
    } if (array.includes('0,2,1,1') && array.includes('0,0,2,1')) {
        Ip = Ip - 2
    } if (array.includes('1,1,2,2') && array.includes('0,1,2,0')) {
        Ip = Ip - 2
    } if (array.includes('1,1,2,0') && array.includes('0,1,2,2')) {
        Ip = Ip - 2
    }

    if (array.includes('0,0,1,1') && array.includes('1,2,2,0')) {
        Ip = Ip - 2
    } if (array.includes('0,2,1,1') && array.includes('1,0,2,2')) {
        Ip = Ip - 2
    } if (array.includes('1,1,2,2') && array.includes('0,2,1,0')) {
        Ip = Ip - 2
    } if (array.includes('1,1,2,0') && array.includes('0,0,1,2')) {
        Ip = Ip - 2
    }

    for (let i = 0; i < PL_array.length - 1; i++) {
        if ([PL_array[i + 1] - 1] in origin) {
            x = origin[PL_array[i + 1] - 1].x - origin[PL_array[i] - 1].x
            y = origin[PL_array[i + 1] - 1].y - origin[PL_array[i] - 1].y
            if (x == 0 && y == 1 || x == 0 && y == -1) {
                Np_array.push('1');
                Np_array_m.push('横');
            }
            else if (x == -1 && y == 0) {
                Np_array.push('2');
                Np_array_m.push('上');
            }
            else if (x == 1 && y == 0) {
                Np_array.push('3');
                Np_array_m.push('下');
            }
            else if (x == 1 && y == 1) {
                Np_array.push('4');
                Np_array_m.push('右下');
            }
            else if (x == -1 && y == 1) {
                Np_array.push('5');
                Np_array_m.push('右上');
            }
            else if (x == 1 && y == -1) {
                Np_array.push('6');
                Np_array_m.push('左下');
            }
            else if (x == -1 && y == -1) {
                Np_array.push('7');
                Np_array_m.push('左上');
            }
            else if (x == 0 && y == 2 || x == 0 && y == -2) {
                Np_array.push('8');
                Np_array_m.push('長い横');
            }
            else if (x == -2 && y == 0) {
                Np_array.push('9');
                Np_array_m.push('長い上');
            }
            else if (x == 2 && y == 0) {
                Np_array.push('a');
                Np_array_m.push('長い下');
            }
            else if (x == 2 && y == 2) {
                Np_array.push('b');
                Np_array_m.push('長い右下y');
            }
            else if (x == -2 && y == 2) {
                Np_array.push('c');
                Np_array_m.push('長い右上y');
            }
            else if (x == 2 && y == -2) {
                Np_array.push('d');
                Np_array_m.push('長い左下y');
            }
            else if (x == -2 && y == -2) {
                Np_array.push('e');
                Np_array_m.push('長い左上y');
            }
            else if (x == 2 && y == 1) {
                Np_array.push('f');
                Np_array_m.push('真ん中右下x');
            }
            else if (x == -2 && y == 1) {
                Np_array.push('g');
                Np_array_m.push('真ん中右上x');
            }
            else if (x == 2 && y == -1) {
                Np_array.push('h');
                Np_array_m.push('真ん中左下x');
            }
            else if (x == -2 && y == -1) {
                Np_array.push('i');
                Np_array_m.push('真ん中左上x');
            }
            else if (x == 1 && y == 2) {
                Np_array.push('j');
                Np_array_m.push('真ん中右下y');
            }
            else if (x == -1 && y == 2) {
                Np_array.push('k');
                Np_array_m.push('真ん中右上y');
            }
            else if (x == 1 && y == -2) {
                Np_array.push('m');
                Np_array_m.push('真ん中左下y');
            }
            else if (x == -1 && y == -2) {
                Np_array.push('n');
                Np_array_m.push('真ん中左上y');
            }
        }
        else {
            break
        }
    }
    let p_lens = 0
    let patterns = {}
    let found = false
    for (let p_len = Math.floor(Np_array.length / 2); p_len >= 2; p_len--) {
        for (let ssp = 0; ssp < Np_array.length - p_len; ssp++) {
            pattern = Np_array.slice(ssp, ssp + p_len)
            others = Np_array.slice(ssp + p_len, Np_array.length)
            let str_others = others.join(',');
            let str_pattern = pattern.join(',');
            if (patterns[pattern]) {
                continue
            }
            if (pattern.length > others.length) {
                break
            }
            patterns[pattern] = 1;

            while (str_others.indexOf(str_pattern) > -1) {
                patterns[pattern]++
                found = true // foundは長さp_lenのパターンの繰り返しを発見したことを表すフラグでこのwhile文に入った瞬間にダブりがあったことが分かるのでtrueにする
                let sp = str_others.indexOf(str_pattern)
                others = others.slice(sp + p_len, others.length)
                str_others = others.join(',');

            }
        }
        //p_lenのダブルがあったら、Rpの定義よりそれより短いパターンのダブルを探す必要がないためここで探索終わる
        if (found && p_lens < pattern.length * 2) {
            p_lens = pattern.length * 2
            break
        }
    }
    PL_array.length = PL_array.length - 1
    Np = (PL_array.length - p_lens) / PL_array.length

    if (Ip >= 5) {
        Ip = 5
    }
    let w = 1 / 3
    let meter
    const output = document.getElementById('register_Strength');
    const output1 = document.getElementById('re_register_Strength');
    Mp = w * (Lp / 15) + (w * Np) + w * (Ip / 5)
    if (Mp >= 0.68) {
        meter = "強"
    } else if (Mp >= 0.34) {
        meter = "中"
    } else {
        meter = "弱"
    }
    output.textContent = "パタンロックの強度は" + meter + "です"
    output1.textContent = "パタンロックの強度は" + meter + "です"
    $("#pgss10").css({ 'width': Mp * 100 + "%" });
    $("#pgss9").css({ 'width': Mp * 100 + "%" });
    console.log(Mp)  

    if (!isFinite(Mp)) {
        Mp=0
    }
    return Mp
    
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
            game_choice();
        });
    } else {
        game_choice();

    }

}

function game_processing(data, dungeon_number) {

}

function seve_data() {
    //GAS WebアプリのURL
    //const END_POINT = "https://script.google.com/macros/s/AKfycbxY26C_z6TlaPzPI-cxNPZNbS0N36OPGb7m1W0oKoZRnS2wcnI4ttTW0dtDcDLqyPOk/exec";
    //読み書きするスプレッドシート（タブ）の番号
    const SHEET_NO = 1;
    const loaddata = JSON.parse(localStorage.getItem('data'))
    const Mp = JSON.parse(localStorage.getItem('Mp'))
    let success = JSON.parse(sessionStorage.getItem('success'))
    let failure = JSON.parse(sessionStorage.getItem('failure'))
    let password = JSON.parse(localStorage.getItem('key'))
    let end = new Date();
    
    const Year = end.getFullYear();
    const Month = end.getMonth() + 1;
    const date = end.getDate();

    let play_time = end.getTime() - start.getTime()

    
    if (Math.abs(play_time) / (60 * 60 * 1000) > 0) {
        var playtime_H = Math.floor(Math.abs(play_time) / (60 * 60 * 1000))
    } else {
        var playtime_H = 0
    }

    if (Math.abs(play_time) / (60 * 1000) > 0) {
        var playtime_M = Math.floor(Math.abs(play_time) / (60 * 1000))
    } else {
        var playtime_M = 0
    }

    let playtime_S = Math.floor(Math.abs(play_time) / 1000)
    
    let play_time1 = playtime_H + "時間" + playtime_M + "分" + playtime_S + "秒"
    let today = Year + "/" + Month + "/" + date

    console.log(play_time1)

    let data2 = [{ name: loaddata, password: password, strength: Mp, success: success, failure: failure, day: today, playtime: play_time1 }]
    console.log(data2);

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
        alert("error:" + e);
        return;
    }
    //POST送信
    $.ajax({
        type: "POST",//データの送信方法
        url: END_POINT,//送る場所のURL
        dataType: "json",//データの形式
        data: { sheetNo: SHEET_NO, data: dataJSON }
    })

    //ajaxが終わると動く
    $(document).ajaxStop(function () {

        setTimeout('window.close()');
    });

}

//ゲームリセット（デバックのための）
function alldelete() {
    //ローカルストレージの全てのデータ削除
    localStorage.clear()
}

function ID_judge(data) {
}