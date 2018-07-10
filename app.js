let socket = io('http://ec2-54-93-171-91.eu-central-1.compute.amazonaws.com:8008');
//let socket = io('http://localhost:8008');
let socket2 = io('http://ec2-54-93-171-91.eu-central-1.compute.amazonaws.com:5000');
let chess = new Chess();
let count = 0;
let onDrop = function(source, target, piece, newPos, oldPos, orientation) {
//console.log(chess.fen());
//console.log(chess.moves({sloppy: true}));
    if(source !== target) {

        if(chess.move(source + target, {sloppy: true}) == null) return 'snapback';
			if(count == 1)
			{
				socket.emit('receive', {
				FEN: chess.fen(),
				ID_game: 0,
				turns: getallMoves()
				})
				count = 1;
			}
			else
			{
				socket2.emit('receive', {
				FEN: chess.fen(),
				ID_game: 0,
				turns: getallMoves()
				})
				count = 0;
			}

    }
};
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}



let cfg = {
    draggable: true,
    position: 'start',
    onDrop: onDrop
};

let board = ChessBoard('board', cfg);

function start(){
	if(count == 0)
		{
			socket.emit('receive', {
			FEN: chess.fen(),
			ID_game: 0,
			turns: getallMoves()
			})
			count = 1;
		}
		else
		{
			socket2.emit('receive', {
			FEN: chess.fen(),
			ID_game: 0
			})
			count = 0;
		}
};

socket.on('makeMove', data => {
    console.log("ki1:" + data.Move);
    chess.move(data.Move, {sloppy: true});
    board.move(data.Move.substr(0,2) + '-' + data.Move.substr(2,4));
	sleep(200).then(() => {
		start();
	});
	
});
socket2.on('makeMove', data => {
    console.log("ki2:" + data);
    chess.move(data, {sloppy: true});
    board.move(data.substr(0,2) + '-' + data.substr(2,4));
	sleep(200).then(() => {
		start();
	});
});

function getallMoves()
{
    let chesspos = ['a1','a2','a3','a4','a5','a6','a7','a8','b1','b2','b3','b4','b5','b6','b7','b8','c1','c2','c3','c4','c5','c6','c7','c8','d1','d2','d3','d4','d5','d6','d7','d8','e1','e2','e3','e4','e5','e6','e7','e8','f1','f2','f3','f4','f5','f6','f7','f8','g1','g2','g3','g4','g5','g6','g7','g8','h1','h2','h3','h4','h5','h6','h7','h8'];
    let chessmoves = [];
    for(var i of chesspos)
    {
       // console.log(i);
        //console.log(chess.moves({square : i}));
        let mvs = chess.moves({square: i});
		//console.log(mvs);
        if(mvs.length != 0)
        {
            for(var o of mvs)
            {
                let move;
                if(o.length >= 3)
                {
					if(o.includes("+") ||  o.includes("#"))
					{
						move = i + o.substr(-3,-1);
						chessmoves.push(move);
					}
					else
					{
						move = i + o.substr(-2);
						chessmoves.push(move);
					}
                }
                else if(o.length == 3)
                {
                    move = i + o;
					chessmoves.push(move);
                }
            }
        }
    }
    return chessmoves;
}


