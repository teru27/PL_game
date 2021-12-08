var END_POINT = "https://script.google.com/macros/s/AKfycbwxFZCHFDGTMbzkBK9sLily0DDPnMIWRK_pIMYmXPltfTwmJn7-y3CQ52MIFzcVYXY1/exec";
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
function game_Start() {
    let existence =localStorage.getItem('key')
    sessionStorage.setItem('success', JSON.stringify(0));
    sessionStorage.setItem('failure', JSON.stringify(0));
    localStorage.setItem('login', JSON.stringify(0));
    localStorage.setItem('login_failure', JSON.stringify(0));
    

    if (existence == null) {
        game_rule()
    }
    else {
        login()
    }
    document.querySelector("#start").style.display = "none";//非表示
}
function game_rule() {
   
    document.querySelector("#commentary").style.display = "block";//表示
    const newbutton1 = document.getElementById('button_commentary')//登録
    newbutton1.onclick = function () {
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
   
}


//初期登録
function game_register(josn_data) {
    document.querySelector("#commentary").style.display = "none";//非表示
    document.querySelector("#register").style.display = "block";//表示
    const newbutton1 = document.getElementById('button1')//登録
    let name//空の箱を作る
    //string型なのでオブジェクト型にする
    

    //jQueryからpatternLockを取得して、#patternLock1に表示する
    $('#patternLock_register').patternLock({
        timeout: 100000,//表示時間(1000で1秒)
        //showPatternLine: false,//ルートの非表示
        drawEnd: function (data) {
            let Mp = patten_strength(data)

            newbutton1.onclick = function () {
                
                josn_data = (new Function("return" + josn_data))();
                console.log(josn_data)
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
                patternLockseve(data, 2, name, Mp)
            }
        }
    });

}

function re_login() {
    document.querySelector("#re_login").style.display = "block";//表示
    document.querySelector("#login").style.display = "none";//非表示
    const newbutton3 = document.getElementById('button3')//登録
    $('#patternLock_re_login').patternLock({
        timeout: 1000,//表示時間(1000で1秒)
        //showPatternLine: false,//ルートの非表示
        drawEnd: function (data) {
            let Mp = patten_strength(data)
            newbutton3.onclick = function () {
                localStorage.setItem('key', JSON.stringify(data))
                localStorage.setItem('Mp', JSON.stringify(Mp))
                login()
            }
        }
    });
}
//ログインシステム
function login() {

    document.querySelector("#login").style.display = "block";//表示
    document.querySelector("#re_login").style.display = "none";//表示
    const login_button = document.getElementById('login_button')//登録
    $('#patternLock_login').patternLock({
        timeout: 1000,//表示時間(1000で1秒)
        //showPatternLine: false,//ルートの非表示
        drawEnd: function (data) {
            login_button.onclick = function () {
                let login = JSON.parse(localStorage.getItem('login'))
                let login_failure = JSON.parse(localStorage.getItem('login_failure'))
                let password = JSON.parse(localStorage.getItem('key'))
                if (data == password) {
                    login = login + 1
                    alert("ログイン成功")
                    localStorage.setItem('login', login);
                    game_choice()
                } else {
                    login_failure = login_failure + 1
                    alert("ログイン失敗")
                    localStorage.setItem('login_failure', login_failure);
                }
            }

        }
    });
}

function try_login() {
    document.querySelector("#try_login").style.display = "block";//表示
    document.querySelector("#choice").style.display = "none";//非表示
    $('#patternLock_try_login').patternLock({
        timeout: 1000,//表示時間(1000で1秒)
        //showPatternLine: false,//ルートの非表示
        drawEnd: function (data) {
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
            }
        }
    });
}

//ダンジョン選択
function game_choice() {
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
    document.querySelector("#choice").style.display = "none";//非表示
    document.querySelector("#end").style.display = "block";//表示

    seve_data()

}
//パスワードの強度を計る
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
    
    $("#pgss9").css({ 'width': Mp * 100 + "%" });
    $("#pgss10").css({ 'width': Mp * 100 + "%" });
    $("#pgss11").css({ 'width': Mp * 100 + "%" });
    console.log(Mp)

    if (!isFinite(Mp)) {
        Mp = 0
    }
    return Mp

}
//ここからは色々な処理
function patternLockseve(data, a, name, Mp) {

    localStorage.setItem('key', JSON.stringify(data))
    localStorage.setItem('Mp', JSON.stringify(Mp))
    //初期登録の時だけ保存
    if (a == 1) {
        localStorage.setItem('data', JSON.stringify(name))
        console.log('登録完了')
        localStorage.setItem(1, 0)
        localStorage.setItem(2, 0)
        localStorage.setItem(3, 0)
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
//ゲームリセット（デバックのための）
function alldelete() {
    //ローカルストレージの全てのデータ削除
    localStorage.clear()
}