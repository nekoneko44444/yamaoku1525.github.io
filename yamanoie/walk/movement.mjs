// Grounded visitor movement in the existing model's relative coordinate system.
// Independent of rendering: fixed maximum travel per collision query prevents
// crossing thin walls during long frames; axes slide along obstacles.
export class WalkWorld {
  constructor(data) { this.data=data; this.radius=data.radius; }
  floor(x,z) { return this.data.floors.find(f=>x>=f.minX&&x<=f.maxX&&z>=f.minZ&&z<=f.maxZ); }
  canStand(x,z) {
    const r=this.radius;
    if(!this.floor(x,z)) return false;
    for(let i=0;i<16;i++) {
      const a=i*Math.PI/8;
      if(!this.floor(x+Math.cos(a)*r,z+Math.sin(a)*r)) return false;
    }
    const floorHeight=this.floor(x,z).height;
    const profiles=this.data.avatarProfile??[{radius:r,bottom:0,top:2}];
    return !this.data.obstacles.some(o=>profiles.some(profile=>{
      if(o.top<=floorHeight+profile.bottom||o.bottom>=floorHeight+profile.top)return false;
      const dx=x-Math.max(o.minX,Math.min(x,o.maxX));
      const dz=z-Math.max(o.minZ,Math.min(z,o.maxZ));
      return dx*dx+dz*dz<profile.radius*profile.radius-1e-8;
    }));
  }
  move(position,dx,dz) {
    const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.035));
    // Only the simulation passes bounded movement, but guard external misuse.
    if(steps>10000) throw new RangeError('Unbounded movement');
    const next={...position};
    for(let i=0;i<steps;i++) {
      const x=next.x+dx/steps,z=next.z+dz/steps;
      if(this.canStand(x,z)) { next.x=x;next.z=z; }
      else {
        if(this.canStand(x,next.z)) next.x=x;
        if(this.canStand(next.x,z)) next.z=z;
      }
    }
    next.floor=this.floor(next.x,next.z)?.height??0;
    return next;
  }
}

export function movementVector(forward,right,yaw,speed,dt) {
  const length=Math.hypot(forward,right);
  if(!length) return {dx:0,dz:0};
  const s=Math.min(1,length)*speed*Math.min(Math.max(dt,0),.10)/length;
  return {dx:(Math.sin(yaw)*forward+Math.cos(yaw)*right)*s,
          dz:(-Math.cos(yaw)*forward+Math.sin(yaw)*right)*s};
}
