window.onload = function() {
    'use strict';

    var cell_amount = 10,
        user = new Field(getElement('field_user_10x10'));

    function Field(field) {
        this.fieldSide	= 33 * cell_amount,
        this.shipSide	= 33,
        this.shipsData	= [
            '',
            [4, 'quadruple_deck'],
            [3, 'triple_deck'],
            [2, 'double_deck'],
            [1, 'single_deck']
        ],

        this.field		= field;
        this.fieldX		= field.getBoundingClientRect().top + window.pageYOffset;
        this.fieldY		= field.getBoundingClientRect().left + window.pageXOffset;
        this.fieldRight	= this.fieldY + this.fieldSide;
        this.fieldBtm	= this.fieldX + this.fieldSide;
        this.fleet   	= [];
    }

    function Ships(player, fc) {
        this.player 	= player;
        this.shipName 	= fc.shipName;
        this.decks		= fc.decks;
        this.x0			= fc.x;
        this.y0			= fc.y;
        this.kx			= fc.kx;
        this.ky 		= fc.ky;
        this.hits 		= 0;
        this.matrix		= [];
    }

    Field.prototype.randomLocationShips = function() {
        this.matrix = initMatrix();
        for (var i = 1, length = this.shipsData.length; i < length; ++i) {
            var decks = this.shipsData[i][0];
            for (var j = 0; j < i; j++) {
                var fc = this.getCoordinatesDecks(decks);

                fc.decks = decks,
                fc.shipName	= this.shipsData[i][1] + String(j + 1);

                var ship = new Ships(this, fc);
                ship.createShip();
            }
        }
    }

    Field.prototype.getCoordinatesDecks = function(decks) {
        var kx = getRandom(1),
            ky = (kx == 0) ? 1 : 0,
            x,
            y;

        if (kx == 0) {
            x = getRandom(cell_amount - 1);
            y = getRandom(cell_amount - decks);
        } else {
            x = getRandom(cell_amount - decks);
            y = getRandom(cell_amount - 1);
        }

        var result = this.checkLocationShip(x, y, kx, ky, decks);
        if (!result) {
            return this.getCoordinatesDecks(decks);
        }

        var obj = {
            x: x,
            y: y,
            kx: kx,
            ky: ky
        };
        return obj;
    }

    Field.prototype.checkLocationShip = function(x, y, kx, ky, decks) {
        var fromX, fromY, toX, toY;

        fromX = (x == 0) ? x : x - 1;
        if (x + kx * decks == cell_amount && kx == 1) {
            toX = x + kx * decks;
        } else if (x + kx * decks < cell_amount && kx == 1) {
            toX = x + kx * decks + 1;
        } else if (x == cell_amount - 1 && kx == 0) {
            toX = x + 1;
        } else if (x < cell_amount - 1 && kx == 0) {
            toX = x + 2;
        }

        fromY = (y == 0) ? y : y - 1;
        if (y + ky * decks == cell_amount && ky == 1) {
            toY = y + ky * decks;
        } else if (y + ky * decks < cell_amount && ky == 1) {
            toY = y + ky * decks + 1;
        } else if (y == cell_amount - 1 && ky == 0) {
            toY = y + 1;
        } else if (y < cell_amount - 1 && ky == 0) {
            toY = y + 2;
        }

        if (toX === undefined || toY === undefined) {
            return false;
        }

        for (var i = fromX; i < toX; ++i) {
            for (var j = fromY; j < toY; ++j) {
                if (this.matrix[i][j] == 1) {
                    return 0;
                }
            }
        }
        return 1;
    }

    Field.prototype.cleanField = function() {
        var parent	= this.field,
            id = parent.getAttribute('id'),
            divs = document.querySelectorAll('#' + id + ' > div');

        [].forEach.call(divs, function(el) {
            parent.removeChild(el);
        });
        this.fleet   .length = 0;
    }

    Ships.prototype.createShip = function() {
        var k       = 0,
            x       = this.x0,
            y       = this.y0,
            kx      = this.kx,
            ky      = this.ky,
            decks   = this.decks,
            player  = this.player
        
        while (k < decks) {
            player.matrix[x + k * kx][y + k * ky] = 1;
            this.matrix.push([x + k * kx, y + k * ky]);
            k++;
        }

        player.fleet.push(this);

        if (player == user) {
            this.showShip();
        }
    }

    Ships.prototype.showShip = function() {
        var div	= document.createElement('div'),
            dir	= (this.kx == 1) ? ' vertical' : '',
            className = this.shipName.slice(0, -1),
            player = this.player;

        div.setAttribute('id', this.shipName);
        div.className = 'ship ' + className + dir;
        div.style.cssText = 'left:' + (this.y0 * player.shipSide) + 'px; top:' + (this.x0 * player.shipSide) + 'px;';
        player.field.appendChild(div);
    }

    getElement('type_placement_10x10').addEventListener('click', function(e) {
        var shipsCollection = getElement('ships_collection');
        user.cleanField();

        shipsCollection.setAttribute('data-hidden', true);
        user.randomLocationShips();
    });
    getElement('type_placement_13x13').addEventListener('click', function(e) {
        var shipsCollection = getElement('ships_collection');
        user.cleanField();
        
        shipsCollection.setAttribute('data-hidden', true);
        user.randomLocationShips();
    });
    getElement('type_placement_15x15').addEventListener('click', function(e) {
        var shipsCollection = getElement('ships_collection');
        user.cleanField();
        
        shipsCollection.setAttribute('data-hidden', true);
        user.randomLocationShips();
    });

    getElement('size_10x10').addEventListener('click', function(e) {
        getElement('field_10x10').setAttribute("data-hidden", false);
        getElement('field_13x13').setAttribute("data-hidden", true);
        getElement('field_15x15').setAttribute("data-hidden", true);
        
        getElement('type_placement_10x10').setAttribute("data-hidden", false);
        getElement('type_placement_13x13').setAttribute("data-hidden", true);
        getElement('type_placement_15x15').setAttribute("data-hidden", true);

        user.cleanField();

        cell_amount = 10;
        user = new Field(getElement('field_user_10x10'));
    });

    getElement('size_13x13').addEventListener('click', function(e) {
        getElement('field_10x10').setAttribute("data-hidden", true);
        getElement('field_13x13').setAttribute("data-hidden", false);
        getElement('field_15x15').setAttribute("data-hidden", true);
        
        getElement('type_placement_10x10').setAttribute("data-hidden", true);
        getElement('type_placement_13x13').setAttribute("data-hidden", false);
        getElement('type_placement_15x15').setAttribute("data-hidden", true);

        user.cleanField();

        cell_amount = 13;
        user = new Field(getElement('field_user_13x13'));
    });

    getElement('size_15x15').addEventListener('click', function(e) {
        getElement('field_10x10').setAttribute("data-hidden", true);
        getElement('field_13x13').setAttribute("data-hidden", true);
        getElement('field_15x15').setAttribute("data-hidden", false);

        getElement('type_placement_10x10').setAttribute("data-hidden", true);
        getElement('type_placement_13x13').setAttribute("data-hidden", true);
        getElement('type_placement_15x15').setAttribute("data-hidden", false);

        user.cleanField();

        cell_amount = 15;
        user = new Field(getElement('field_user_15x15'));
    });

    function getElement(id) {
        return document.getElementById(id);
    }

    function getRandom(upperBound) {
        return Math.floor(Math.random() * (upperBound + 1));
    }

    function initMatrix() {
        var x = cell_amount, y = cell_amount, arr = [cell_amount];
        for (var i = 0; i < x; ++i) {
            arr[i] = [cell_amount];
            for (var j = 0; j < y; j++) {
                arr[i][j] = 0;
            }
        }
        return arr;
    }

    window.saveInput = function() {
        var input = document.getElementById("session_name").value;

        var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:attachment/text,' + JSON.stringify(input) + '\n' + JSON.stringify(cell_amount) + '\n' + JSON.stringify(JSON.decycle(user)) + '\n';
            hiddenElement.target = '_blank';
            hiddenElement.download = input + '.save';
            hiddenElement.click();
    }

    function saveInput() {
        var input = document.getElementById("session_name").value;

        var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:attachment/text,' + JSON.stringify(input) + '\n' + JSON.stringify(cell_amount) + '\n' + JSON.stringify(JSON.decycle(user)) + '\n';
            hiddenElement.target = '_blank';
            hiddenElement.download = input + '.save';
            hiddenElement.click();
    }

    // window.saveInput = function () {
    //     var userField = user;
    //     var cells = cell_amount;
    //     var input = document.getElementById("session_name").value;

    //     localStorage.setItem('input', JSON.stringify(input));
    //     localStorage.setItem('cells', JSON.stringify(cells));
    //     localStorage.setItem('userField', JSON.stringify(userField));
    // }

    // window.loadInput = function() {
    //     user = JSON.parse(localStorage.getItem('userField'));
    //     cell_amount = JSON.parse(localStorage.getItem('cells'));
    //     document.getElementById("session_name").value = JSON.parse(localStorage.getItem('input'));
    // }
}
