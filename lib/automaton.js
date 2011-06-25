/*	Cellular Automaton Library	*/
function Automaton () {
	// Rules for Survival/Birth
	// this.rules.survive and this.rules.birth
	// are arrays holding the sum of neighbors
	// for each action to take
	this.rules = {};


	// Save the petridish
	this.saveBoard = function() {
		this.boardSaved = new Array(this.board.length);
		for (var x = 0; x < this.board.length; x++) {
			this.boardSaved[x] = new Array(this.board[x].length);
			for (var y = 0; y < this.board[x].length; y++) {
				this.boardSaved[x][y] = this.board[x][y];
			}
		}
	}

	// Rewrite the screen to be either "revert"ed to a previously saved
	// state, "blank", or "random".
	this.changeScreen = function (mode) {
		// Load saved state
		if (mode == "revert" && this.boardSaved) {
			for (var x = 0; x < this.boardSaved.length; x++) {
				for (var y = 0; y < this.boardSaved[x].length; y++) {
					this.board[x][y] = this.boardSaved[x][y];
				}
			}
			return 0;
		}
		// change each cell to either 0 or a random 0 or 1 (dead or alive)
		// based on what mode is set to
		for (var x = 0; x < this.board.length; x++) {
			for (var y = 0; y < this.board[x].length; y++) {
				if (mode == "blank")
					this.board[x][y] = 0;
				else if (mode == "random")
					this.board[x][y] = Math.round(Math.random());
			}
		}
		return 0;
	}

	// Initialize a new board. width and height in cell size,
	// blank as a boolean, rules in "S*/B*" form
	this.init = function (width,height,blank,rules) {
		// If rules were passed to the function parse and save them
		if (rules)
			this.setRules(rules);
		// Initialize the petridish
		this.board = new Array(height);
		for (var x = 0; x < height; x++) {
			this.board[x] = new Array(width);
			for (var y = 0; y < width; y++) {
				// Either blank or randomize each cell based on
				// content of blank. Blank being defined as a truthy value
				// will zero the cell, blank undefined or falsey will randomize
				if (blank)
					this.board[x][y] = 0;
				else
					this.board[x][y] = Math.round(Math.random());
			}
		}
	}
	
	// Parse and save a 'rules' string
	this.setRules = function (rules) {
		// Setup game rules
		this.rules.survive = new Array();
		this.rules.birth = new Array();
		if (!rules)
			rules = "B3/S23";	// Default to Conway's Game of Life
		rules.match("B([^\d]*)\/S([^\d]*)");
		// Places rules into appropriate arrays
		var tmp = RegExp.$2
		for (var i = 0; i < tmp.length; i++) {
			this.rules.survive[i] = tmp[i];
		}
		tmp = RegExp.$1
		for (var i = 0; i < tmp.length; i++) {
			this.rules.birth[i] = tmp[i];
		}
		return 0;
	}

	// Increment the petridish to the next generation
	this.nextGen = function() {
		// Calculate the next generation into a new array so
		// new values don't influence the calculation of the new
		// generation
		this.boardNext = new Array(this.board.length);
		for (var i = 0; i < this.board.length; i++) {
			this.boardNext[i] = new Array(this.board[i].length);
		}

		// For each cell calculate value N (sum of live neighbors)
		for (var x = 0; x < this.board.length; x++) {
			for (var y = 0; y < this.board[x].length; y++) {
				var n = 0;
				for (var dx = -1; dx <= 1; dx++) {
					for (var dy = -1; dy <= 1; dy++) {
						if ( dx == 0 && dy == 0){}
						// Take care not to count the current cell 
						// and if the neighboring is undefined treat it as dead
						else if (typeof this.board[x+dx] !== 'undefined'
								&& typeof this.board[x+dx][y+dy] !== 'undefined'
								&& this.board[x+dx][y+dy]) {
							n++;
						}
					}	
				}

				// Apply rules
				var c = this.board[x][y];
				if (c) { // Survival test for currently living cell
					var s = 0;
					for (var i = 0; i < this.rules.survive.length; i++) {
						if (this.rules.survive[i] == n)
							s = 1;
						// save into next generation petridish
						c = s;
					}
				}
				else {	// Birth test for currently dead cell
					for (var i = 0; i <this.rules.birth.length; i++) {
						if (this.rules.birth[i] == n)
						// save into next generation petridish
							c = 1;
					}
				}
				this.boardNext[x][y] = c;
			}
		}
		// copy next generation into main petridish
		this.board = this.boardNext.slice();
	}

	this.print = function(ctx,w,h,liveclr,deadclr) {
		if (!w)
			w = 8;
		if (!h)
			h = 8;
		for (var x = 0; x < this.board.length; x++) {
			var l = "";
			for (var y = 0; y < this.board[x].length; y++) {
				if (this.board[x][y])
				// x and y reversed to draw matrix like it looks in source
				// rather than the "actual" positions
					ctx.fillStyle = liveclr;
				else
					ctx.fillStyle = deadclr;
				ctx.fillRect(y*h,x*w,h,w);
			}
		}
	}
}


