#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_size;
uniform vec2 u_position;
uniform vec2 u_canvas_size;
uniform float u_multiplier;
uniform float u_multiplier2;
uniform float u_time;
const int follicles = 7;

vec2 random2(vec2 st){ st = vec2( dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)) ); return -1.0 + 2.0*fract(sin(st)*43758.5453123);}
float noise(vec2 st) {
    vec2 i = floor(st); vec2 f = fract(st); vec2 u = f*f*(3.0-2.0*f); return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),  dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x), mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),  dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);}

float blob(vec2 st, float radius) {
	st = vec2(0.5)-st; 
    float r = length(st)*2.0; 
    float a = atan(st.y,st.x);
    float m = abs(mod(a+u_time*2.,3.14*2.)-3.14)/2.6* u_multiplier2; 
    float f = radius;
    m += noise(st+u_time*0.1)*-3.220; 
    f += sin(a*7.)*noise(st+u_time*.2)*0.588* u_multiplier; 
    f += (sin(a*2.)*.1*pow(m,2.));  
    return 1.-smoothstep(f,f+0.,r);
}
float blobOutline(vec2 st, float radius, float width) { return blob(st,radius)-blob(st,radius-width); }

mat2 rotate2d(float _angle){ return mat2(cos(_angle),-sin(_angle), sin(_angle),cos(_angle)); }
float drawLine(vec2 st, vec2 p1, vec2 p2, float width) { float a = abs(distance(p1, st)); float b = abs(distance(p2, st)); float c = abs(distance(p1, p2)); if ( a >= c || b >=  c ) return 0.000;float p = (a + b + c) * 0.5; float h = 2. / c * sqrt( p * ( p - a) * ( p - b) * ( p - c)); return 1.-smoothstep(0.5 * width, 1.5 * width, h); }


void main() {
	vec2 st = (gl_FragCoord.xy -vec2(u_position.x, u_canvas_size.y - u_position.y) + vec2(0.0, u_size.y)) / u_size.xy;


vec4 color = vec4(0.);
    vec4 follicleColor = vec4(0.224,0.700,0.045, 1.0);
    
    
        float blobConstrain = blob(st, 0.6 - 0.04);

     for (int x = 0; x < follicles; x++) {
    float lineStart = float(x)/float(follicles);
    float lineEnd = 1.0 - lineStart;
    vec2(lineStart,1);
    vec2(lineEnd,0);
    float lineValue = drawLine(st,vec2(lineStart,1),vec2(lineEnd,0), 0.004);
        if (lineValue > .0 && blobConstrain > .0) {
            color = follicleColor;
        
        }
                               
    }
    
       for (int y = 0; y < follicles; y++) {
    float lineStart = float(y)/float(follicles);
    float lineEnd = 1.0 - lineStart;
    vec2(1, lineStart);
    vec2(0, lineEnd);
    float lineValue = drawLine(st,vec2(1, lineStart),vec2(0, lineEnd), 0.004);
    if (lineValue > .0 && blobConstrain > .0) {
            color = follicleColor;
        }
                               
    }
    
    float lineMask = blobOutline(st, 0.5, 0.04);
    if (lineMask > 0.) {
        color = vec4(0.000,1.000,0.304, 1.0);
    }
    
    float blobColor = blob(st, 0.5 - 0.04);
    	if (blobColor > 0.) {
            color = vec4(0.198,0.735,0.287, 1.0);
        }
    


    
        
	gl_FragColor = color;
    
    
}
  