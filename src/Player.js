export default class Player extends PIXI.Graphics {
  constructor(grid) {
    super();
    this.grid = grid;
    
    if (grid.square_size < 8) this.speed = 0.5;
    else if (grid.square_size < 15) this.speed = 1;
    else this.speed = 1.5;
    this.vx = this.speed;
    this.vy = 0;
    
    this.player_size = 10 * this.grid.square_size;
    this.win = false;
    
    // These represent direction of the movement
    // (needs for the player remember where it must turn)
    this.direction_buffer = [];
    this.left = 1;
    this.right = 2;
    this.down = 3;
    this.up = 4;
    
    // Initial position
    this.set_x(0);
    this.set_y(1);
    
    this._draw_player();
  }
  
  _draw_player() {
    this.beginFill(0xff0000);
    this.drawRoundedRect(
      0, 0,
      this.grid.square_size,
      this.grid.square_size,
      this.player_size
    );
    this.endFill();
  }
  
  update() {
    // If the player must turn
    if (this.direction_buffer.length) {
      const direction = this.direction_buffer[0];
      switch (direction) {
        case this.left:
          this.go_left();
          break;
        case this.right:
          this.go_right();
          break;
        case this.up:
          this.go_up();
          break;
        case this.down:
          this.go_down();
          break;
      }
    }
    
    const x = this.x + this.vx;
    const y = this.y + this.vy;
    // If the player's going horizontally
    if (this.vy === 0) {
      // If the player's going right
      if (this.vx > 0) {
       if ((this.grid.squares[this.get_y_down()][this.get_x_down() + 1] !== 0) &&
           (this.get_x_down() !== this.grid.width - 1)) {
         this.x = x;
       }
        // If the player's going left
      } else {
        if ((this.grid.squares[this.get_y_down()][this.get_x_up() - 1] !== 0) &&
             (this.get_x_up() !== 0)) {
          this.x = x;
        }
      }
      // If the player's going vertically
    } else {
      // If the player's going down
      if (this.vy > 0) {
        if (this.grid.squares[this.get_y_down() + 1][this.get_x_down()] !== 0) {
          this.y = y;
        }
        // If the player's going up
      } else {
        if (this.grid.squares[this.get_y_up() - 1][this.get_x_down()] !== 0) {
          this.y = y;
        }
      }
    }
    
    this._check_if_win();
  }
  
  _check_if_win() {
    if (this.get_x_down() === this.grid.width - 1 &&
        this.get_y_down() === this.grid.height - 2) {
      this.win = true;
    }
  }
  
  go_left() {
    this.direction_buffer[0] = this.left;
    this._go_horizontally(-1);
  }
  
  go_right() {
    this.direction_buffer[0] = this.right;
    this._go_horizontally(1);
  }
  
  go_up() {
    this.direction_buffer[0] = this.up;
    this._go_vertically(-1);
  }
  
  go_down() {
    this.direction_buffer[0] = this.down;
    this._go_vertically(1);
  }
  
  _go_vertically(direction) {
    if (this.vx > 0) {
      if (this.grid.squares[this.get_y_down()+direction][this.get_x_down()] === 1) {
        this.vy = this.speed * direction;
        this.vx = 0;
        this.set_x(this.get_x_down());
        this.direction_buffer.length = 0;
      }
    } else {
      if (this.grid.squares[this.get_y_down()+direction][this.get_x_up()] === 1) {
        this.vy = this.speed * direction;
        this.vx = 0;
        this.set_x(this.get_x_up());
        this.direction_buffer.length = 0;
      }
    }
  }
  
  _go_horizontally(direction) {
    if (this.vy > 0) {
      if (this.grid.squares[this.get_y_down()][this.get_x_down()+direction] === 1) {
        this.vx = this.speed * direction;
        this.vy = 0;
        this.set_y(this.get_y_down());
        this.direction_buffer.length = 0;
      }
    } else {
      if (this.grid.squares[this.get_y_up()][this.get_x_down()+direction] === 1) {
        this.vx = this.speed * direction;
        this.vy = 0;
        this.set_y(this.get_y_up());
        this.direction_buffer.length = 0;
      }
    }
  }
  
  set_x(number) {
    this.x = number * this.grid.square_size;
  }
  
  set_y(number) {
    this.y = number * this.grid.square_size;
  }
  
  get_x_down() {
    return Math.floor(this.x / this.grid.square_size);
  }
  
  get_y_down() {
    return Math.floor(this.y / this.grid.square_size);
  }
  
  get_x_up() {
    return Math.ceil(this.x / this.grid.square_size);
  }
  
  get_y_up() {
    return Math.ceil(this.y / this.grid.square_size);
  }
}