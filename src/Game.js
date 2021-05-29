import Grid from './Grid.js';
import Maze from './Maze.js';
import Player from './Player.js';

export default class Game extends PIXI.Application {
  constructor(options, square_size) {
    super(options);
    
    this.width = this.view.width;
    this.height = this.view.height;
    this.square_size = square_size;
    
    const square_color = '#057aa0';
    
    this.grid = new Grid(this.width, this.height, this.square_size);
    //this._show_grid(this.grid);
    this.maze = new Maze(this.grid, this.width, this.height, square_color);
    this.player = new Player(this.grid);
    
    this.stage.addChild(this.maze);
    this.stage.addChild(this.player);
    
    this._game_loop = this._game_loop.bind(this);
    this.ticker.add(this._game_loop);
  
    this._key_down = this._key_down.bind(this);
    document.addEventListener('keydown', this._key_down);
  }
  
  _game_loop() {
    this.player.update();
    if (this.player.win) {
      this._end_game();
    }
  }
  
  _end_game() {
    this.maze.alpha = 0.3;
    this.player.visible = false;
    this._draw_message('Maze Completed!', 'rgb(245, 128, 37)');
    this.ticker.stop();
    document.removeEventListener('keydown', this._key_down);
  }
  
  /**
   * Displays the end message
   */
  _draw_message(message_text, css_color) {
    const message = new PIXI.Text(
      message_text,
      new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: this.width / 10,
        fill: css_color,
        stroke: 'white',
        strokeThickness: 3,
        wordWrap: true,
        wordWrapWidth: this.width / 20,
        align: 'center',
        dropShadow: true,
        dropShadowColor: "#057aa0",
        dropShadowBlur: 1,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: this.width / 100,
      })
    );
    message.anchor.set(0.5, 0.5);
    message.position.set(
      this.width / 2 - this.square_size / 1.5,
      this.height / 2 - this.square_size / 2,
    );
    this.stage.addChild(message);
  }
  
  _key_down(event) {
    switch (event.code) {
      case 'ArrowLeft':
        this.player.go_left();
        break;
    
      case 'ArrowRight':
        this.player.go_right();
        break;
    
      case 'ArrowUp':
        this.player.go_up();
        break;
    
      case 'ArrowDown':
        this.player.go_down();
        break;
    }
  }
  
  _show_grid(grid) {
    console.log(grid);
    for (let i = 0; i < grid.squares.length; i++) {
      console.log(grid.squares[i]);
    }
  }
}