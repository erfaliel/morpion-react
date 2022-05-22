import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square" 
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }
function Square(props) {
  return (
    <button
      className='square'
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
    <Square 
      value={this.props.squares[i]}
      onClick={() =>  this.props.onClick(i)}
    />
    );
  }

  render() {
    const column = [0, 3, 6];
    const raws = [0, 1, 2];
    return (
      <div>
        {column.map((i) => {
          return(
          <div key={i} className='board-row'>
          {raws.map((value) => {
            return ( 
              <i key={value+i}>
                {this.renderSquare(value+i) }
              </i>
            )
          })}
        </div>)
        })}
      </div>
    )
    
    // la balise html <i> m'a permit de conserver la structure du tableau
    // tout ent permettant d'avoir une Key sur chaque élément du tableau jsx
    /* rappel :
    Each child in an array or iterator should have a unique “key” prop

      /* permet de générer le contenu ci-dessus qui pour ma part me semble plus simple d'utilisation qu'une boucle
      imbriquée dans le jsx.
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
      */

  }
}


class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step %2) === 0,
    })
  }

  makeTrack(squares) {
    let result = ""
    result = squares.map((square, posi) => {
      const spot = ['1, 1', '1, 2', '1, 3', '2, 1', '2, 2', '2, 3', '3, 1', '3, 2', '3, 3'];
      let value = spot[posi]  + " => " + (square === null ? "Vide": square );
      return result + " | " + value;
    })
    return result;
  }

  render() {
    const history = this.state.history; // all history
    const current = history[this.state.stepNumber]; // history for this step
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => { // step: value, move: index
      console.log("index", move, "coups:", step, "squares: ", step.squares.toString());
      const track = this.makeTrack(step.squares);
      if (move) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>Revenir au tour n° <b>{move}</b> coups: {track} </button>
          </li>
        )
      } else {
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>Revenir au début de la partie. </button>
            </li>
          )
      }
    })
    console.log("moves", moves);
    let status;
    if (winner) {
      status = winner + ' a gagné!';
    } else {
      status = 'Prochain joueur : ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // then break for loop
    }
  }
  return null;
}