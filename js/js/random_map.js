(function () {
    // �z����V���b�t������
    function shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
    /**
        ���H��\������N���X
    */
    window.Maze = function () {
        // �ǂƒʘH�̊֌W��A�T�C�Y�͊�ɂ��Ƃ�
        this.size = 15
        this.box = [];
        this.$maze = document.querySelector("#maze");
    };

    Maze.ALGO = { STICK: 1 };

    var p = Maze.prototype;

    p.show = function () {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (this.box[j][i] === 0) {
                    
                } else {
                    
                }
            }
        }
       
    }
    
    /**
        ���H�����
    */
    p.create = function (options) {
        options = options || {};
        if (options.algorithm === Maze.ALGO.STICK) {
            this._createByStick();
        }
        this.show();
    }

    /**
        ���H�����i�_�|���j
    */
    p._createByStick = function () {

        // ������
        // �܂��͕ǂƒʘH�����݂ɍ쐬����
        this.box = [];
        for (var i = 0; i < this.size; i++) {
            var row = [];
            this.box.push(row);
            for (var j = 0; j < this.size; j++) {
                // �ŏ��̍s�ƍŌ�s�͕�
                if (i === 0 || (i + 1) === this.size) {
                    row.push(0);
                    // �ŏ��̗�ƍŌ�̗����
                } else if (j === 0 || (j + 1) === this.size) {
                    row.push(0);
                    // ��s�͑S���ʘH
                } else if (i % 2 === 1) {
                    row.push(1);
                    // �����s�͕ǂƒʘH�����݂ɔz�u
                } else {
                    // �ǂƒʘH
                    row.push(j % 2);
                }
            }
        }

        // debug
        // return;

        // ��������Ǔ|���Ŗ��H�����
        for (var r = 0; r < this.box.length; r++) {
            // �ŏ��ƍŌ�̍s�͑ΏۊO
            if (r === 0 || (r + 1) === this.box.length) {
                continue;
            }
            // �ǂ�����s�݂̂�Ώ�
            if (r % 2 === 1) {
                continue;
            }
            // �s�����o��
            var row = this.box[r];

            // �ŏ��̍s�̂݁A�㉺���E�|����OK�i�d�Ȃ�̂�NG�j
            var direction = ['top', 'bottom', 'left', 'right'];
            if (r >= 4) {
                // �ŏ��ȊO�́A��ɂ͓|�����Ⴞ�߁[
                direction = direction.slice(1);
            }

            for (var i = 0; i < row.length; i++) {
                // �[�����͑ΏۊO
                if (i === 0 || (i + 1) === row.length) {
                    continue;
                }
                if (i % 2 === 0) {
                    direction = shuffle(direction);
                    for (var j = 0; j < direction.length; j++) {
                        if (direction[j] === "top") {
                            if (this.box[r - 1][i] === 1) {
                                this.box[r - 1][i] = 0;
                                break;
                            }
                        }
                        if (direction[j] === "left") {
                            if (this.box[r][i - 1] === 1) {
                                this.box[r][i - 1] = 0;
                                break;
                            }
                        }
                        if (direction[j] === "right") {
                            if (this.box[r][i + 1] === 1) {
                                this.box[r][i + 1] = 0;
                                break;
                            }
                        }
                        if (direction[j] === "bottom") {
                            if (this.box[r + 1][i] === 1) {
                                this.box[r + 1][i] = 0;
                                break;
                            }
                        }
                    }
                }
            }
        }
        let existence = JSON.parse(localStorage.getItem('random_map_make'))
        if (existence !=0 ) {
            let random_map_clear = JSON.parse(localStorage.getItem('random_map_clear'))
            random_map_clear = random_map_clear + 1
            localStorage.setItem('random_map_clear', JSON.stringify(random_map_clear));
        }
        localStorage.setItem('random_map_make', JSON.stringify(this.box));
    }

})();