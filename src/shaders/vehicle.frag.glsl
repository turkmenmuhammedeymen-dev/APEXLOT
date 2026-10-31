uniform vec3 uBaseColor;
uniform vec3 uAccentColor;
uniform float uRoughness;
varying vec3 vWorldPosition;
varying vec3 vNormal;
void main(){vec3 n=normalize(vNormal);vec3 lightDir=normalize(vec3(-0.4,0.8,0.3));float diffuse=max(dot(n,lightDir),0.0);float rim=pow(1.0-max(dot(n,normalize(cameraPosition-vWorldPosition)),0.0),3.0);vec3 color=mix(uBaseColor,uAccentColor,rim*0.22);color*=0.28+diffuse*(1.0-clamp(uRoughness,0.0,1.0)*0.35);gl_FragColor=vec4(color,1.0);}