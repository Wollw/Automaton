var game = new Automaton();
var cellSize = 8;
var click = {};
var runGame;
var rules;
var pauseplayButton;
var blankButton;
var randomizeButton;
var revertButton;
var saveButton;

// JQuery Events
$(function(){
	// Record mouse position
	$("#petridish").mousedown(function(e){
	        click.x = Math.floor((e.pageX - this.offsetLeft)/cellSize);
	        click.y = Math.floor((e.pageY - this.offsetTop)/cellSize);
		click.justClicked = true;
		if (game.board) {
			if (game.board[click.y][click.x]) {
				game.board[click.y][click.x] = 0;
			}
			else {
				game.board[click.y][click.x] = 1;
			}
		}
	});
});

function loop(game,ctx,w,h) {
	game.setRules(rules);
	game.print(ctx,w,h,
		document.getElementById("liveColor").value,
		document.getElementById("deadColor").value);

	
	if (blankButton) {
		blankButton = false;
		game.changeScreen("blank");
		document.getElementById("pauseplay").value="Run";
		runGame=false;
	} else
	if (randomizeButton) {
		randomizeButton = false;
		game.changeScreen("random");
		document.getElementById("pauseplay").value="Run";
		runGame=false;
	} else
	if (revertButton) {
		revertButton = false;
		game.changeScreen("revert");
		document.getElementById("pauseplay").value="Run";
		runGame=false;
	} else
	if (saveButton) {
		saveButton = false;
		game.saveBoard();
	} else
	if (pauseplayButton) {
		pauseplayButton = false;
		if (runGame){
			runGame = false;
			document.getElementById("pauseplay").value="Start";
		}
		else {
			rules = document.getElementById("rulesString").value;
			document.getElementById("pauseplay").value="Stop";
			runGame = true;
		}
	}

	if (runGame) {
		game.nextGen();
	}

	if (click.justClicked) {
		click.justClicked = false;
	}

	return 0;
}

function init() {
	// enable javascript only elements and disable javascript warning
	document.getElementById("jsDisabled").style.visibility = 'hidden';
	document.getElementById("jsEnabled").style.visibility = 'visible';

	// Get canvas contexts or return 1
	game.canvas = document.getElementById('petridish');
	if (game.canvas.getContext) {
		// Setup petridish
		game.init(game.canvas.width/cellSize,game.canvas.height/cellSize,"blank");
	        game.ctx = game.canvas.getContext('2d');
	} else {
	        return 1;
	}


	// Run main() at set interval
	setInterval(function(){loop(game,game.ctx,cellSize,cellSize);},75);
	return 0;
}
