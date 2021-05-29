export default class Maze extends PIXI.Container {
  constructor(grid, width, height, wall_color = 'black', background_color = 'white') {
    super();
    
    const canvas = this._draw_maze(grid, width, height, wall_color, background_color);
    const base_texture = new PIXI.BaseTexture(canvas);
    const sprite = new PIXI.Sprite(new PIXI.Texture(base_texture));
    this.addChild(sprite);
  }
  
  _draw_maze(grid, width, height, wall_color, background_color) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    
    context.save();
    const square_size = grid.square_size;
    for (let i = 0; i < grid.width; i++) {
      for (let j = 0; j < grid.height; j++) {
        if (grid.squares[j][i] === 0) {
          context.fillStyle = wall_color;
        } else {
          context.fillStyle = background_color;
        }
        context.beginPath();
        context.fillRect(
          i * square_size, j * square_size,
          square_size, square_size
        );
      }
    }
    context.restore();
    return canvas;
  }
}