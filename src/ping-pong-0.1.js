$(function() {

  // TODO: FIX COLLISIONS WITH THE LEFT CORNER
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var canvas = $("#game_screen")[0];

  
  var Player = function(canvas, y, agent) {
    this.canvas = canvas;
    this.width  = 30;
    this.height = 10;
    this.agent = agent || false;
    this.dirX = +1;
    this.speed = 10;

    var posY = y;
    // INITIAL POSX = middle of canvas;
    var posX = canvas.width/2;

    this.posicaoX = function() {
      return posX;
    };
    this.posicaoY = function() {
      return posY;
    };

    this.posicao = function ()  {
      if(this.agent) {
        posX = this.agent(posX);
        return [posX,posY];
      } else {
        return [this.posicaoX(),this.posicaoY()];
      };
    };

    this.moveLeft = function() {
      if(posX - this.speed >= 0) {
        posX = posX - this.speed;
      };
    };

    this.moveRight = function() {
      if((posX + this.speed + this.width) <= canvas.width) {
        posX = posX + this.speed;
      };
    };
  };
  var Target = function(canvas, p1, p2) {
    this.canvas = canvas;
    this.width  = 10;
    this.height = 10;
    this.p1 = p1;
    this.p2 = p2;
    var speed = 1;
    var direction_y = +1;
    var direction_x = +1;

    // INITIAL POSITION MIDDLE OF CANVAS
    var posY = canvas.height/2;
    var posX = canvas.width/2;

    this.posicaoX = function() {
      return posX;
    };
    this.posicaoY = function() {
      return posY;
    };

    this.directionX = function() {
      return direction_x;
    };
    this.directionY = function() {
      return direction_y;
    };


    this.posicao = function ()  {
      if(direction_x == 0 && direction_y == 0) {
        return [posX,posY];
      };

      if(posX == 0) {
        direction_x = +1;
      };
      if((posX+this.width) == canvas.width) {
        direction_x = -1;
      };

      if((posY-this.height) <= p1.posicaoY()) {
        if(p1.posicaoX() <= posX && posX <= p1.posicaoX()+p1.width) {
          direction_y = +1;
        } else {
          if(posY == 0) {
            alert('P2 WIN!');
            direction_x = 0;
            direction_y = 0;
          };
        };
      };

      if((posY+this.height) >= p2.posicaoY()) {
        if(p2.posicaoX() <= posX && posX <= p2.posicaoX()+p2.width) {
          direction_y = -1;
        } else {
          if(posY == canvas.height) {
            alert('P1 WIN!');
            direction_x = 0;
            direction_y = 0;
          };
        };
      };

      posX = posX + speed*direction_x;
      posY = posY + speed*direction_y;

      return [posX,posY];
    };

    this.moveLeft = function() {
      if(posX - 5 >= 0) {
        posX = posX - 5;
      };
    };

    this.moveRight = function() {
      if((posX + 5 + this.width) <= canvas.width) {
        posX = posX + 5;
      };
    };
  };


  function start() {
    var paused = false;
    var P1 = new Player(canvas, 30);
    var P2 = new Player(canvas, canvas.height - 30);
    var t  = new Target(canvas, P1, P2);
    P2.agent = function(posX) { 
      if(t.directionX() != this.dirX) {
        this.dirX = t.directionX();
      };
      var new_pos = posX + this.speed*this.dirX;
      if(new_pos >= t.posicaoX() && new_pos <= t.posicaoX()) {
        return new_pos; 
      } else {
        return posX;
      };
    };


    $("body").bind('keydown',function(event) {
       switch(event.which) {
        case 37:
          if(paused) 
            return;
          P1.moveLeft();
          break;
        case 39:
          if(paused) 
            return;
          P1.moveRight();
          break;
        case 80:
          paused = !paused;
          break;
       };
    });
  
    function render() {
      var context = canvas.getContext('2d');
      if(paused) {
        context.font = "bold 48px arial";
        context.textAlign = 'center';
        context.fillText("Paused", canvas.width/2, canvas.height/2);

        return;
      };
      context.fillStyle = 'rgb(77,189,51)';
      // GAME
      context.fillRect( 0, 0, canvas.width, canvas.height);
      // TABLE 
      // CENTER
      context.fillStyle = 'white';
      context.fillRect(0, (canvas.height - P1.height - P2.height)/2, canvas.width, 2);

      // P1 
      context.fillStyle = 'white';
      context.fillRect(0, P1.posicao()[1], canvas.width, 2);

      // P2 
      context.fillStyle = 'white';
      context.fillRect(0, P2.posicao()[1], canvas.width, 2);

      // CENTER VERTICAL
      context.fillStyle = 'white';

      context.fillRect(canvas.width/2, 30, 3, canvas.height - 60);


      // P1
      context.fillStyle = '#26466D';
      context.fillRect(P1.posicao()[0], P1.posicao()[1], P1.width, P1.height);
      // P2
      context.fillStyle = '#26466D';
      context.fillRect(P2.posicao()[0], P2.posicao()[1], P2.width, P2.height);
      // Target
      context.fillStyle = '#26466D';
      context.fillRect(t.posicao()[0], t.posicao()[1], t.width,t.height);
      context.fill();
    };

    (function animloop(){
      requestAnimFrame(animloop);
      render();
    })();
  };

  start();
});
