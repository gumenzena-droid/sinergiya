(() => {
  const canvas = document.querySelector('#core');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const particles = Array.from({length: 250}, (_, i) => ({
    angle: i * 2.399963,
    orbit: i % 5,
    radius: 1.22 + (i % 19) * .015,
    size: .65 + (i % 7) * .18
  }));
  const vertices = Array.from({length: 180}, (_, i) => {
    const y = 1 - 2 * (i + .5) / 180;
    const radius = Math.sqrt(1 - y*y);
    return [radius*Math.cos(i*2.399963), y, radius*Math.sin(i*2.399963)];
  });
  const edges = vertices.flatMap((a, i) => vertices.slice(i+1)
    .map((b, j) => [b, i+j+1])
    .filter(([b]) => Math.hypot(...a.map((v, k) => v-b[k])) < .305)
    .map(([,j]) => [i,j]));
  let width, height, level = 0;
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(width*ratio);
    canvas.height = Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  function draw(stamp) {
    const time = reduced.matches ? 0 : stamp/1000;
    const amplitude = Number(document.documentElement.style.getPropertyValue('--voice')) || 0;
    level += (amplitude-level)*.14;
    const x = width*.5, y = height*.49 + 3*Math.sin(time*.75);
    const size = Math.min(width,height)*(.293+.027*level);
    const project = ([px,py,pz]) => {
      const d = 4.4/(4.4-pz);
      return [x+px*size*d,y+py*size*d,pz,d];
    };
    const rotate = ([x,y,z], turn, tilt) => {
      const px=x*Math.cos(turn)-z*Math.sin(turn);
      const pz=x*Math.sin(turn)+z*Math.cos(turn);
      return [px,y*Math.cos(tilt)-pz*Math.sin(tilt),y*Math.sin(tilt)+pz*Math.cos(tilt)];
    };
    const points = vertices.map(vertex => project(rotate(vertex,time*.36,.28)));
    const orbits = particles.map((p,i) => {
      const a=p.angle+time*(.19+p.orbit*.105)*(p.orbit%2?1:-1);
      const radius=p.radius+.09*level;
      const point=rotate([radius*Math.cos(a),.055*Math.cos(i),radius*Math.sin(a)],.34*p.orbit,.40+p.orbit*.59);
      return {point:project(point),size:p.size,i};
    });
    function dots(front) {
      for(const {point:[px,py,z,d],size:radius,i} of orbits) {
        if ((z >= 0) !== front) continue;
        ctx.fillStyle = front ? (i%4 ? '#537cacb0' : '#ffffff') : '#8fa9c85c';
        ctx.beginPath();
        ctx.arc(px,py,radius*d*(1+.35*level),0,2*Math.PI);
        ctx.fill();
      }
    }
    ctx.clearRect(0,0,width,height);
    const aura=ctx.createRadialGradient(x,y,size*.16,x,y,size*1.72);
    aura.addColorStop(0,'#ffffff');
    aura.addColorStop(.49,'#a3c3e258');
    aura.addColorStop(1,'#adc8e400');
    ctx.fillStyle=aura;
    ctx.fillRect(0,0,width,height);
    dots(false);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI*2);
    ctx.clip();
    const glass=ctx.createRadialGradient(x-size*.32,y-size*.38,size*.02,x,y,size*1.03);
    glass.addColorStop(0,'#fff');
    glass.addColorStop(.29,'#e4f5ff88');
    glass.addColorStop(.67,'#a7c1d52a');
    glass.addColorStop(.91,'#53759672');
    glass.addColorStop(1,'#f9fdffeb');
    ctx.fillStyle=glass;
    ctx.fillRect(x-size,y-size,size*2,size*2);
    for(const [i,j] of edges) {
      const a=points[i], b=points[j], depth=(a[2]+b[2])/2;
      ctx.strokeStyle = depth>0 ? `rgba(68,106,149,${.16+.31*depth})` : 'rgba(112,147,182,.10)';
      ctx.lineWidth=depth>0 ? .84 : .62;
      ctx.beginPath();
      ctx.moveTo(a[0],a[1]);
      ctx.lineTo(b[0],b[1]);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle='#f9fdfff0';
    ctx.lineWidth=1.35;
    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI*2);
    ctx.stroke();
    dots(true);
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
