int numBacterias = 40;
float spring = 0.01;
float gravity = 0.00;
float friction = -0.9;
Bacteria[] Bacterias = new Bacteria[numBacterias];
Bacteria[] Bacterias2 = new Bacteria[numBacterias];


void setup() {
  size(500, 500, P2D);
  for (int i = 0; i < numBacterias; i++) {
    Bacterias[i] = new Bacteria(random(width), random(height), random(45, 100), i, Bacterias, width, height);
  }
  for (int i = 0; i < numBacterias; i++) {
    Bacterias2[i] = new Bacteria(random(width), random(height), random(5, 30), i, Bacterias, width, height);
  }
  noStroke();
  fill(255, 204);

}

void draw() {
  background(0);
  for (Bacteria Bacteria : Bacterias2) {
    Bacteria.collide();
    Bacteria.move();
    Bacteria.display();
  }
  fill(0, 0, 0, 200);
  rect(0,0,width, height);
  for (Bacteria Bacteria : Bacterias) {
    Bacteria.collide();
    Bacteria.move();
    Bacteria.display();
  }
}

void mousePressed() {
   for (int i = 0; i < numBacterias; i++) {
    Bacterias[i] = new Bacteria(random(width), random(height), random(30, 100), i, Bacterias, width, height);
  }
  for (int i = 0; i < numBacterias; i++) {
    Bacterias2[i] = new Bacteria(random(width), random(height), random(5, 30), i, Bacterias, width, height);
  }
}

class Bacteria {

  float x, y;
  float diameter;
  float vx = random(-1,1);
  float vy = random(-1,1);
  float shapeMultiplier = random(0,10)/10;
  float shapeMultiplier2 = random(0,10)/10;
  int id;
  float width;
  float height;
  Bacteria[] others;
  
PShader shader;

  Bacteria(float xin, float yin, float din, int idin, Bacteria[] oin, float widthin, float heightin) {
    width = widthin;
    height = heightin;
    x = xin;
    y = yin;
    diameter = din;
    id = idin;
    others = oin;
    shader = loadShader("bacteria.frag");

  } 

  void collide() {
    for (int i = id + 1; i < numBacterias; i++) {
      float dx = others[i].x - x;
      float dy = others[i].y - y;
      float distance = sqrt(dx*dx + dy*dy);
      float minDist = others[i].diameter*0.4 + diameter*0.4;
      if (distance < minDist) { 
        float angle = atan2(dy, dx);
        float targetX = x + cos(angle) * minDist;
        float targetY = y + sin(angle) * minDist;
        float ax = (targetX - others[i].x) * spring;
        float ay = (targetY - others[i].y) * spring;
        vx -= ax;
        vy -= ay;
        others[i].vx += ax;
        others[i].vy += ay;
      }
    }
  }

  void move() {
    vy += gravity;
    x += vx;
    y += vy;
    if (x + diameter/2 > width) {
      x = width - diameter/2;
      vx *= friction;
    } else if (x - diameter/2 < 0) {
      x = diameter/2;
      vx *= friction;
    }
    if (y + diameter/2 > height) {
      y = height - diameter/2;
      vy *= friction;
    } else if (y - diameter/2 < 0) {
      y = diameter/2;
      vy *= friction;
    }
  }

  void display() {
   shader.set("u_canvas_size", (width), (height));
   shader.set("u_size", (diameter), (diameter));
   shader.set("u_position", (x), (y));
   shader.set("u_multiplier", shapeMultiplier);
   shader.set("u_multiplier2", shapeMultiplier2);
   shader.set("u_time", millis() / 1000.0);
   shader(shader);
   rect(x, y, diameter, diameter);

  }
}