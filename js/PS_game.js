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
    newbutton2.onclick = function () {
        let data = document.getElementsByClassName('passwd1')[0].value
        if (data == " " * data.length) {
            alert('文字を入力してください')
        }
        //ここで文字数制限をしている
        else if (data.length > 36) {
            alert('36文字以内にしてください')
            document.getElementById('textbox').value = ""//ここでテキストボックスの中身を消す
        } else {
            patternLockseve(data, 2, name, Mp)
        }
    }
}

//ダンジョン選択
function game_choice() {
    $("#pgss10").css({ 'width': 0 + "%" });
    document.getElementsByClassName('passwd1')[0].value = ""

    localStorage.setItem('map1', JSON.stringify(0));
    localStorage.setItem('map', JSON.stringify(0));
    sessionStorage.setItem('px', JSON.stringify(0));
    sessionStorage.setItem('py', JSON.stringify(0));
    sessionStorage.setItem('battle_now', JSON.stringify(0));
    sessionStorage.setItem('obstacle_now', JSON.stringify(0));
    sessionStorage.setItem('cun_num', JSON.stringify(0));
    localStorage.setItem('map1', JSON.stringify(0));
    localStorage.setItem('random_map_make', JSON.stringify(0));
    sessionStorage.setItem('button_down_num', JSON.stringify(0));
    sessionStorage.setItem('map_change', JSON.stringify(0));

    let num = JSON.parse(localStorage.getItem('num'))
    localStorage.setItem('hp', JSON.stringify(150 + (num * 15)));
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
//ゲームマップ切り替えなどの機能（1～3までの）
function game_map(num) {
    if (navigator.userAgent.match(/(iPhone|iPod|Android.*Mobile)/i)) {
        $("body").css("zoom", "50%");
    } else {
        console.log(11)
    }
    document.querySelector("#choice").style.display = "none";//非表示
    document.querySelector("#battle").style.display = "none";//非表示
    document.querySelector("#map_ch").style.display = "none";//非表示
    document.querySelector("#game_map").style.display = "block";//表示

    var gc
    if (num == 1) {
        var map1 = [//マップデータ
            [[1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
            [1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
            [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
            [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1, 0, 1],
            [0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1],
            [0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1],
            [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0],
            [1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0],
            [1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 3]],

            [[1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
            [1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1],
            [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
            [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
            [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
            [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
            [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3]]

        ];
    }
    else if (num == 2) {
        var map1 = [//マップデータ
            [[1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
            [0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
            [0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0],
            [1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
            [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1],
            [0, 1, 1, 1, 2, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
            [0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1],
            [0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1],
            [3, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1]],

            [[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3],
            [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 2, 1, 0, 1],
            [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
            [1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
            [1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]],

            [[1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
            [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
            [0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
            [0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
            [0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1],
            [0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
            [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1],
            [0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
            [0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
            [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
            [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 1],
            [0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0],
            [0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 3]]

        ];
    }
    else if (num == 3) {

        var map1 = [//マップデータ
            [[1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
            [1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1],
            [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
            [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1],
            [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 3]],

            [[1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 3],
            [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0],
            [1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1],
            [1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1],
            [0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
            [0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1],
            [0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1],
            [0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1]],

            [[1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
            [1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1],
            [0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1],
            [0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1],
            [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
            [0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0],
            [0, 0, 1, 0, 1, 0, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 3]],
            [[1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 3],
            [1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1],
            [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
            [0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
            [0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]]
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

    function keydown(e, a) {
        //イベント中は動かない
        let battle_now = JSON.parse(sessionStorage.getItem('battle_now'));
        let obstacle_now = JSON.parse(sessionStorage.getItem('obstacle_now'));
        if (battle_now != 1 && obstacle_now != 1) {
            if (a == 1) {
                charactermove(e);
            } else {
                charactermove(e.keyCode);
            }
        }
    }

    document.getElementById("button10").onclick = function () {
        keydown(38, 1)
    };
    document.getElementById("button11").onclick = function () {
        keydown(37, 1)
    };
    document.getElementById("button12").onclick = function () {
        keydown(40, 1)
    };
    document.getElementById("button13").onclick = function () {
        keydown(39, 1)
    };

    //キャラの移動
    function charactermove(keyCode) {
        let px = JSON.parse(sessionStorage.getItem('px'))
        let py = JSON.parse(sessionStorage.getItem('py'));
        let min = 0
        let max = 1
        let n
        let hitx = px, hity = py;//当たり判定用の変数を作成
        let d = 0, c = 0
        let ch = 0
        let map_move = 0
        switch (keyCode) {
            case 39:
            case 68:
                c = 0
                d = 32 * 2
                if ((map[hity][hitx + 1]) == 1) {
                    n = Math.random(min, max)
                    px++;//右移動
                } else if ((map[hity][hitx + 1]) == 2) {
                    map_move = 1
                    map[hity][hitx + 1] = 1
                    sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                    obstacle1(map_move, hitx, hity, c, d)
                } else if ((map[hity][hitx + 1]) == 3) {
                    ch = 1
                    sub(num)
                }
                break;
            case 37:
            case 65:
                c = 0
                d = 32
                if ((map[hity][hitx - 1]) == 1) {
                    n = Math.random(min, max)
                    px--;//左移動
                } else if ((map[hity][hitx - 1]) == 2) {
                    map_move = 2
                    map[hity][hitx - 1] = 1
                    sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                    obstacle1(map_move, hitx, hity, c, d)
                } else if ((map[hity][hitx - 1]) == 3) {

                    ch = 1
                    sub(num)
                }
                break;
            case 38:
            case 87:
                c = 0
                d = 32 * 3
                if (py > 0) {
                    if ((map[hity - 1][hitx]) == 1) {
                        n = Math.random(min, max)
                        py--;//上移動
                    } else if ((map[hity - 1][hitx]) == 2) {
                        map_move = 3
                        map[hity - 1][hitx] = 1
                        sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                        obstacle1(map_move, hitx, hity, c, d)
                    } else if ((map[hity - 1][hitx]) == 3) {
                        ch = 1
                        sub(num)
                    }
                }
                break;
            case 40:
            case 83:
                c = 0
                d = 0
                if (py < 14) {
                    if ((map[hity + 1][hitx]) == 1) {
                        n = Math.random(min, max)
                        py++;//下移動
                    } else if ((map[hity + 1][hitx]) == 2) {
                        map_move = 4
                        map[hity + 1][hitx] = 1
                        sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                        obstacle1(map_move, hitx, hity, c, d)
                    } else if ((map[hity + 1][hitx]) == 3) {
                        ch = 1
                        sub(num)
                    }
                }
                break;
        }
        console.log(px + "," + py)

        if (n < 0.1) {
            //プレイヤーの位置を更新
            //localStorage.setItem('map1', JSON.stringify(map));
            sessionStorage.setItem('battle_now', JSON.stringify(1));
            game_battle(num)
            console.log("接敵")
        }
        if (ch == 1) {
            sessionStorage.setItem('px', JSON.stringify(0));
            sessionStorage.setItem('py', JSON.stringify(0));
            ch = 0
        } else {
            sessionStorage.setItem('px', JSON.stringify(px));
            sessionStorage.setItem('py', JSON.stringify(py));
        }
        paint(c, d);
    }

    function paint(c, d) {
        let px = JSON.parse(sessionStorage.getItem('px'))
        let py = JSON.parse(sessionStorage.getItem('py'));
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[y].length; x++) {
                if (map[y][x] == 0) {
                    gc.drawImage(map002, 5 * 32, 32 * 40, 32, 32, x * 32, y * 32, 32, 32);
                }
                else if (map[y][x] == 1) {
                    gc.drawImage(map002, 0, 0, 32, 32, x * 32, y * 32, 32, 32);


                } else if (map[y][x] == 2) {
                    gc.drawImage(map002, 4 * 32, 32 * 40, 32, 32, x * 32, y * 32, 32, 32);

                } else if (map[y][x] == 3) {
                    gc.drawImage(map001, 0, 0, 32, 32, x * 32, y * 32, 32, 32);
                }
            }
        }

        if (c == undefined && d == undefined) {
            c = 0
            d = 0
        }

        gc.drawImage(character1, c, d, 32, 32, px * 32, py * 32, 32, 32);
    }

    //ダンジョン切り替えとクリア判定
    function sub() {
        let cun_num = JSON.parse(sessionStorage.getItem('cun_num'))
        cun_num = cun_num + 1
        console.log(num + 1)
        console.log(cun_num)
        if (num + 1 == cun_num) {
            game_clear(cun_num)
        } else {
            map = map1[cun_num]
            localStorage.setItem('map1', JSON.stringify(map));
            sessionStorage.setItem('cun_num', JSON.stringify(cun_num));
            
        }
       
    }
    function obstacle1(map_move, hitx, hity, c, d) {
        let yes_or_no = window.confirm('パスワードを使い、障害物を退かしますか？');
        if (yes_or_no) {
            obstacle(map_move, hitx, hity, c, d)
        }
    }


    function obstacle(map_move, hitx, hity, c, d) {
            document.querySelector("#game_map").style.display = "none";
        document.querySelector("#map_ch").style.display = "block";//表示
        document.getElementById("txet_co").textContent = "パスワードを使い、障害物を退かせ！";
            let key = JSON.parse(localStorage.getItem('key'))
            $('#patternLock_map').patternLock({
                timeout: 1000,//表示時間(1000で1秒)
                //showPatternLine: false,//ルートの非表示
                drawEnd: function (data) {
                    if (data == key) {
                        //マップの変更
                        gc.drawImage(map002, 0, 0, 32, 32, hitx * 32, hity * 32, 32, 32);
                        localStorage.setItem('map1', JSON.stringify(map));
                        sessionStorage.setItem('obstacle_now', JSON.stringify(0));
                        document.querySelector("#game_map").style.display = "block";//表示
                        document.querySelector("#map_ch").style.display = "none";//表示
                        paint(c, d)
                    }

                }
            });
    }
}
//ゲームマップ切り替えなどの機能（無限）
function game_random_map(num) {
    if (navigator.userAgent.match(/(iPhone|iPod|Android.*Mobile)/i)) {
        $("body").css("zoom", "50%");
    } else {
        console.log(11)
    }
    document.querySelector("#choice").style.display = "none";//非表示
    document.querySelector("#battle").style.display = "none";//非表示
    document.querySelector("#map_ch").style.display = "none";//非表示
    document.querySelector("#game_map").style.display = "block";//表示
    let map_change = JSON.parse(sessionStorage.getItem('map_change'));

    function initialize() {
        gc = document.getElementById("test").getContext("2d");
        document.onkeydown = keydown;
        paint();
    }
    var map
    console.log(map_change)
    function map_change_load (){
        var maze = new Maze();
        maze.create({ algorithm: Maze.ALGO.STICK });
        sessionStorage.setItem('px', JSON.stringify(1));
        sessionStorage.setItem('py', JSON.stringify(1));
        sessionStorage.setItem('map_change', JSON.stringify(1));
        map = JSON.parse(localStorage.getItem('random_map_make'));

        let aaa = Math.floor(Math.random() * (2 + 1 - 1)) + 1

        for (let i = 0; i < aaa; i++) {
            let max_ch_1=13
            let min_ch_1=2
            let num_random3 = Math.floor(Math.random() * (max_ch_1 + 1 - min_ch_1)) + min_ch_1
            let num_random4 = Math.floor(Math.random() * (max_ch_1 + 1 - min_ch_1)) + min_ch_1
            map[num_random3][num_random4] = 2
        }

        let max_map = 13
        let min_map = 2
        let num_random = Math.floor(Math.random() * (max_map + 1 - min_map)) + min_map
        let num_random1 = Math.floor(Math.random() * (max_map + 1 - min_map)) + min_map
        map[num_random][num_random1] = 3
        initialize()
    }

    if (map_change == 0) {
        map_change_load()
    }
    function keydown(e, a) {
        //イベント中は動かない
        let battle_now = JSON.parse(sessionStorage.getItem('battle_now'));
        let obstacle_now = JSON.parse(sessionStorage.getItem('obstacle_now'));
        if (battle_now != 1 && obstacle_now != 1) {
            if (a == 1) {
                charactermove(e);
            } else {
                charactermove(e.keyCode);
            }
        }
    }

    document.getElementById("button10").onclick = function () {
        keydown(38, 1)
    };
    document.getElementById("button11").onclick = function () {
        keydown(37, 1)
    };
    document.getElementById("button12").onclick = function () {
        keydown(40, 1)
    };
    document.getElementById("button13").onclick = function () {
        keydown(39, 1)
    };

    //キャラの移動
    function charactermove(keyCode) {
        let px = JSON.parse(sessionStorage.getItem('px'))
        let py = JSON.parse(sessionStorage.getItem('py'));
        let min = 0
        let max = 1
        let n
        let hitx = px, hity = py;//当たり判定用の変数を作成
        let d = 0, c = 0
        let ch = 0
        let map_move = 0
        switch (keyCode) {
            case 39:
            case 68:
                c = 0
                d = 32 * 2
                if ((map[hity][hitx + 1]) == 1) {
                    n = Math.random(min, max)
                    px++;//右移動
                } else if ((map[hity][hitx + 1]) == 2) {
                    map_move = 1
                    map[hity][hitx + 1] = 1
                    sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                    obstacle1(map_move, hitx, hity, c, d)
                } else if ((map[hity][hitx + 1]) == 3) {
                    ch = 1
                    sub()
                }
                break;
            case 37:
            case 65:
                c = 0
                d = 32
                if ((map[hity][hitx - 1]) == 1) {
                    n = Math.random(min, max)
                    px--;//左移動
                } else if ((map[hity][hitx - 1]) == 2) {
                    map_move = 2
                    map[hity][hitx - 1] = 1
                    sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                    obstacle1(map_move, hitx, hity, c, d)
                } else if ((map[hity][hitx - 1]) == 3) {

                    ch = 1
                    sub()
                }
                break;
            case 38:
            case 87:
                c = 0
                d = 32 * 3
                if (py > 0) {
                    if ((map[hity - 1][hitx]) == 1) {
                        n = Math.random(min, max)
                        py--;//上移動
                    } else if ((map[hity - 1][hitx]) == 2) {
                        map_move = 3
                        map[hity - 1][hitx] = 1
                        sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                        obstacle1(map_move, hitx, hity, c, d)
                    } else if ((map[hity - 1][hitx]) == 3) {
                        ch = 1
                        sub()
                    }
                }
                break;
            case 40:
            case 83:
                c = 0
                d = 0
                if (py < 14) {
                    if ((map[hity + 1][hitx]) == 1) {
                        n = Math.random(min, max)
                        py++;//下移動
                    } else if ((map[hity + 1][hitx]) == 2) {
                        map_move = 4
                        map[hity + 1][hitx] = 1
                        sessionStorage.setItem('obstacle_now', JSON.stringify(1));
                        obstacle1(map_move, hitx, hity, c, d)
                    } else if ((map[hity + 1][hitx]) == 3) {
                        ch = 1
                        sub()
                    }
                }
                break;
        }
        console.log(px + "," + py)

        if (n < 0.1) {
            //プレイヤーの位置を更新
            //localStorage.setItem('map1', JSON.stringify(map));
            sessionStorage.setItem('battle_now', JSON.stringify(1));
            game_battle(num)
            console.log("接敵")
        }
        if (ch == 1) {
            sessionStorage.setItem('px', JSON.stringify(1));
            sessionStorage.setItem('py', JSON.stringify(1));
            ch = 0
        } else {
            sessionStorage.setItem('px', JSON.stringify(px));
            sessionStorage.setItem('py', JSON.stringify(py));
        }
        paint(c, d);
    }

    function paint(c, d) {
        let px = JSON.parse(sessionStorage.getItem('px'))
        let py = JSON.parse(sessionStorage.getItem('py'));
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[y].length; x++) {
                if (map[y][x] == 0) {
                    gc.drawImage(map002, 5 * 32, 32 * 40, 32, 32, x * 32, y * 32, 32, 32);
                }
                else if (map[y][x] == 1) {
                    gc.drawImage(map002, 0, 0, 32, 32, x * 32, y * 32, 32, 32);


                } else if (map[y][x] == 2) {
                    gc.drawImage(map002, 4 * 32, 32 * 40, 32, 32, x * 32, y * 32, 32, 32);

                } else if (map[y][x] == 3) {
                    gc.drawImage(map001, 0, 0, 32, 32, x * 32, y * 32, 32, 32);
                }
            }
        }

        if (c == undefined && d == undefined) {
            c = 0
            d = 0
        }

        gc.drawImage(character1, c, d, 32, 32, px * 32, py * 32, 32, 32);
    }
    //ダンジョン切り替え
    function sub() {
        sessionStorage.setItem('map_change', JSON.stringify(0))
        map_change_load()
    }

    function obstacle1(map_move, hitx, hity, c, d) {
        let yes_or_no = window.confirm('障害部をパスワードを使い除けますか？');
        if (yes_or_no) {
            obstacle(map_move, hitx, hity, c, d)
        }
    }

    function obstacle(map_move, hitx, hity, c, d) {
        document.querySelector("#game_map").style.display = "none";
        document.querySelector("#map_ch").style.display = "block";//表示
        let key = JSON.parse(localStorage.getItem('key'))
        document.getElementById("txet_co").textContent = "パスワードを使い、障害物を退かせ！";
        $('#patternLock_map').patternLock({
            timeout: 1000,//表示時間(1000で1秒)
            //showPatternLine: false,//ルートの非表示
            drawEnd: function (data) {
                if (data == key) {
                    //マップの変更
                    gc.drawImage(map002, 0, 0, 32, 32, hitx * 32, hity * 32, 32, 32);

                    localStorage.setItem('map1', JSON.stringify(map));
                    sessionStorage.setItem('obstacle_now', JSON.stringify(0));
                    document.querySelector("#game_map").style.display = "block";//表示
                    document.querySelector("#map_ch").style.display = "none";//表示
                    paint(c, d)
                }

            }
        });
    }
}
//戦闘の処理
function game_battle(dungeon_number) {
    let success = JSON.parse(sessionStorage.getItem('success'))
    let failure = JSON.parse(sessionStorage.getItem('failure'))
    let Mp = JSON.parse(localStorage.getItem('Mp'))

    let img = document.getElementById("monster");
    let min = 1;//乱数用
    let max = 7;//乱数用
    let enemy_number = Math.floor(Math.random() * (max + 1 - min)) + min;//乱数生成
    let moster_random = Math.floor(Math.random() * (3 + 1 - 1)) + 1
    console.log(dungeon_number)
    if (dungeon_number!=4) {
        img.src = "img/" + dungeon_number + "/monster" + dungeon_number + "-" + enemy_number + ".png";
    } else {
        console.log(moster_random)
        img.src = "img/" + dungeon_number + "/monster" + moster_random + "-" + enemy_number + ".png";
        
    }
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
   
    let Defense_p = 20
    let Offensive_p = 0
    console.log(player_physical)
    
    document.getElementById("pgss1").textContent = enemy_physical;
    document.getElementById("ph1").textContent = player_physical;

    $("#pgss1").css({ 'width': 100 + "%" });
   $("#ph1").css({ 'width': (player_physical / player_physical_max) * 100 + "%" });
    document.querySelector("#game_map").style.display = "none";//非表示
    document.querySelector("#battle").style.display = "block";//表示


    
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
                    hp = hp - 50 - ((Defense_p * dungeon_number) - Math.floor(Mp * 100))//プレイヤーの体力を減らす
                    localStorage.setItem('hp', JSON.stringify(hp));//自分のHPの更新
                    document.getElementById("ph1").textContent = hp;
                    $("#ph1").css({ 'width': (hp / player_physical_max) * 100 + "%" });
                    if (hp < 0 || hp == 0) {
                        game_over(dungeon_number)
                    }
                } else {
                    console.log(Math.floor(Offensive_p))
                    enemy = enemy - Math.floor(Offensive_p)//敵の体力計算
                    sessionStorage.setItem('enemy', JSON.stringify(enemy));//敵のHPの更新
                    document.getElementById("pgss1").textContent = enemy;
                    sessionStorage.setItem('success', JSON.stringify(success));
                    //敵のHPゲージ
                    $("#pgss1").css({ 'width': (enemy / enemy_physical_max) * 100 + "%" });
                    console.log("成功" + enemy)
                }
                
                //倒した時の処理
                if (enemy < 0 || enemy == 0) {
                    const delay_processing = () => {
                        sessionStorage.setItem('battle_now', JSON.stringify(0));
                        if (dungeon_number == 4) {
                            game_random_map(dungeon_number)
                        } else {
                            game_map(dungeon_number)
                        }
                        
                    }
                    setTimeout(delay_processing, 500);
                }
            }
            else {
                failure = failure + 1
                sessionStorage.setItem('failure', JSON.stringify(failure));
                hp = hp - 50//プレイヤーの体力を減らす
                localStorage.setItem('hp', JSON.stringify(hp));//自分のHPの更新
                document.getElementById("ph1").textContent = hp;
                $("#ph1").css({ 'width': (hp / player_physical_max) * 100 + "%" });
                if (hp < 0 || hp == 0) {
                    game_over(dungeon_number)
                }
            }
        }
    });
}
//
function game_clear(dungeon_number) {
    localStorage.setItem('map1', JSON.stringify(0));
    localStorage.setItem('map', JSON.stringify(0));

    let num = JSON.parse(localStorage.getItem('num'))
    num = 1 + num
    localStorage.setItem('num', JSON.stringify(num));

    document.querySelector("#battle").style.display = "none";
    document.querySelector("#game_map").style.display = "none";
    document.querySelector("#clear").style.display = "block";//表示

    dungeon_sevedata(dungeon_number)

}
//
function game_over(dungeon_number) {
    localStorage.setItem('map1', JSON.stringify(0));
    localStorage.setItem('map', JSON.stringify(0));

    document.querySelector("#game_map").style.display = "none";
    document.querySelector("#battle").style.display = "none";
    document.querySelector("#over").style.display = "block";//表示

    dungeon_sevedata(dungeon_number)
}
//
function game_end() {
    document.querySelector("#battle").style.display = "none";//非表示
    document.querySelector("#choice").style.display = "none";//非表示
    document.querySelector("#end").style.display = "block";//表示

    seve_data()

}
//
function dungeon_sevedata(dungeon_number) {
    localStorage.setItem(dungeon_number, 1)
    seve_data(1)
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
            game_choice();
        });
    } else {
        game_choice();

    }

}

function seve_data(a) {
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
    if (a != 1) {
        //ajaxが終わると動く
        $(document).ajaxStop(function () {

            setTimeout('window.close()');
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