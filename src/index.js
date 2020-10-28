import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

class Square extends React.Component {
  cssMatrix = [
    { borderRight: "solid", borderBottom: "solid" }, // top-left
    { borderBottom: "solid" }, // top-mid
    { borderLeft: "solid", borderBottom: "solid" }, // top-right
    { borderRight: "solid", borderBottom: "solid" }, // mid-left
    { borderBottom: "solid" }, // mid-mid
    { borderLeft: "solid", borderBottom: "solid" }, // mid-right
    { borderRight: "solid" }, // bottom-left
    {},
    { borderLeft: "solid" }, // bottom-mid
  ];

  render() {
    return (
      <button
        className="square"
        onClick={this.props.onClick}
        // style={this.cssMatrix[this.props.pos]}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        pos={i}
      />
    );
  }

  render() {
    return (
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
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick = (i) => {
    const history = this.state.history;
    const squares = history[this.state.stepNumber].squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: this.state.stepNumber + 1,
    });
  };

  jumpTo = (i) => {
    const history = this.state.history;
    const newHistroy = history.slice(0, i + 1);
    this.setState({
      history: newHistroy,
      stepNumber: i,
      xIsNext: i % 2 === 0,
    });
  };

  handleUndo = () => {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const newHistroy = history.slice(0, stepNumber);
    this.setState({
      history: newHistroy,
      stepNumber: stepNumber - 1,
      xIsNext: (stepNumber - 1) % 2 === 0,
    });
  };

  render() {
    const history = this.state.history;
    const squares = history[history.length - 1].squares;
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((squares, index) => {
      const desc = index ? `Go to move #${index}` : `Go to start`;

      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <div className="status">{status}</div>
          <Board
            squares={this.state.history[history.length - 1].squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <FontAwesomeIcon
            icon={faUndo}
            style={{ display: this.state.stepNumber === 0 ? "none" : "inline" }}
            onClick={this.handleUndo}
          ></FontAwesomeIcon>
          {/* <button>Undo</button> */}
          {/* <div>status</div>
          <ol>{moves}</ol> */}
        </div>
      </div>
    );
  }
}

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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
