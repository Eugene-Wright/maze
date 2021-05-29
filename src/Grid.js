import {random_int_exclusive} from '../../../libs/helpers.js';

/**
 * Creates the array that represents a randomly generated maze.
 *  0 = black
 *  1 = white
 */
export default class Grid {
  constructor(canvas_width, canvas_height, square_size) {
    this.square_size = square_size;
    this.width = Math.trunc(canvas_width / square_size);
    this.height = Math.trunc(canvas_height / square_size);
  
    this._check_grid_sizes();
    this._check_canvas_size();
  
    this.squares = [];
    for (let i = 0; i < this.height; i++) {
      this.squares.push(new Array(this.width).fill(0, 0, this.width));
    }
  
    // Initialize all the squares to white
    // except a lattice framework of black squares
    for (let i = 1; i < this.width - 1; i++) {
      for (let j = 1; j < this.height - 1; j++) {
        if (((i & 1) !== 0) || ((j & 1) !== 0)) {
          this.squares[j][i] = 1;
        }
      }
    }
  
    // The entrance to the maze
    this.squares[1][0] = 1;
  
    // The exit out of the maze
    this.squares[this.squares.length - 2][this.squares[0].length - 1] = 1;
    
    this._create_maze();
  }
  
  /**
   * This method randomly generates the maze.
   * Values are used during the maze creation:
   *   2 = the square could possibly be appended to the maze this round.
   *   3 = the square will be white but is not close enough to be appended
   *       to the maze this round.
   */
  _create_maze() {
    // Create an initial framework of black squares
    for (let i = 1; i < this.width - 1; i++) {
      for (let j = 1; j < this.height - 1; j++) {
        if (((i + j) & 0x1) !== 0) {
          this.squares[j][i] = 0;
        }
      }
    }
    
    // Initialize the squares that will be white and act
    // as vertices: set the value to 3 which means the
    // square has not been connected to the maze tree
    for (let i = 1; i < this.width - 1; i += 2) {
      for (let j = 1; j < this.height - 1; j += 2) {
        this.squares[j][i] = 3;
      }
    }

    // Those squares that can be selected to be open
    // (white) paths are given the value of 2.
    // Randomly select the square where the tree of maze
    // paths will begin. The maze is generated starting from
    // this initial square and branches out from here in all
    // directions to fill the maze grid
    const possible_squares = [];
    const start_square = [];
    start_square[0] = random_int_exclusive(0, Math.floor(this.height * 0.5)) * 2 + 1;
    start_square[1] = random_int_exclusive(0, Math.floor(this.width * 0.5)) * 2 + 1;
    this.squares[start_square[0]][start_square[1]] = 2;
    possible_squares.push(start_square);

    // Loop to select squares one by one to append to
    // the maze pathway tree
    while (possible_squares.length > 0) {
      // The next square to be joined on is selected randomly
      const chosen_index = random_int_exclusive(0, possible_squares.length);
      const chosen_square = possible_squares[chosen_index];

      // Set the chosen square to white and then
      // remove it from the list of possible_squares (i.e. squares
      // that can possibly be added to the maze), and link
      // the new square to the maze
      this.squares[chosen_square[0]][chosen_square[1]] = 1;
      possible_squares.splice(chosen_index, 1);
      this._link(chosen_square, possible_squares);
    }
  }
  
  /**
   * Checks the four squares surrounding
   * the chosen square. Of those that are already connected to
   * the maze, one is randomly selected to be joined to the
   * current square (to attach the current square to the
   * growing maze). Those squares that were not previously in
   * a position to be joined to the maze are added to the list
   * of "possible" squares (that can be chosen to be attached
   * to the maze in the next round).
   */
  _link(chosen_square, possible_squares) {
    let link_count = 0;
    const i = chosen_square[0];
    const j = chosen_square[1];
    const links = [];
    
    if (i >= 3) {
      if (this.squares[i - 2][j] === 1) {
        links[2 * link_count] = i - 1;
        links[2 * link_count + 1] = j;
        link_count++;
      } else if (this.squares[i - 2][j] === 3) {
        this.squares[i - 2][j] = 2;
        const new_square = [];
        new_square[0] = i - 2;
        new_square[1] = j;
        possible_squares.push(new_square);
      }
    }
    
    if (j + 3 <= this.width) {
      if (this.squares[i][j + 2] === 3) {
        this.squares[i][j + 2] = 2;
        const new_square = [];
        new_square[0] = i;
        new_square[1] = j + 2;
        possible_squares.push(new_square);
      } else if (this.squares[i][j + 2] === 1) {
        links[2 * link_count] = i;
        links[2 * link_count + 1] = j + 1;
        link_count++;
      }
    }
    
    if (j >= 3) {
      if (this.squares[i][j - 2] === 3) {
        this.squares[i][j - 2] = 2;
        const new_square = [];
        new_square[0] = i;
        new_square[1] = j - 2;
        possible_squares.push(new_square);
      } else if (this.squares[i][j - 2] === 1) {
        links[2 * link_count] = i;
        links[2 * link_count + 1] = j - 1;
        link_count++;
      }
    }
    
    if (i + 3 <= this.height) {
      if (this.squares[i + 2][j] === 3) {
        this.squares[i + 2][j] = 2;
        const new_square = [];
        new_square[0] = i + 2;
        new_square[1] = j;
        possible_squares.push(new_square);
      } else if (this.squares[i + 2][j] === 1) {
        links[2 * link_count] = i + 1;
        links[2 * link_count + 1] = j;
        link_count++;
      }
    }
    
    if (link_count > 0) {
      const link_choice = random_int_exclusive(0, link_count);
      const link_x = links[2 * link_choice];
      const link_y = links[2 * link_choice + 1];
      this.squares[link_x][link_y] = 1;
      const index_of_square = possible_squares.findIndex(
        (square) => square[0] === link_x && square[1] === link_y
      );
      if (index_of_square > 0) possible_squares.splice(index_of_square, 1);
    }
  }
  
  /**
   * The grid sizes must be odd
   * for the maze-generation algorithm to work
   */
  _check_grid_sizes() {
    if ((this.width & 1) === 0) {
      this.width -= 1;
    }
    if ((this.height & 1) === 0) {
      this.height -= 1;
    }
  }
  
  /**
   * If the canvas is too small to make
   * a reasonable maze, throws an Exception
   */
  _check_canvas_size() {
    const min_grid_width = 15;
    const max_square_size = Math.min(
      this.width / min_grid_width,
      this.height / min_grid_width
    );
    if (max_square_size < this.mySquareSize) {
      throw new Error("Canvas too small");
    }
  }
}