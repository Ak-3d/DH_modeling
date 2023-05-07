const lineControl ={
    maxRange: 1,
    mat : new THREE.LineBasicMaterial({color:0xffffff}),
    update: (axs) => {
        axs.forEach((p, i) => {
            const v = new THREE.Vector3();
            p.getWorldPosition(v);

            lineControl.points[i*3] = v.x;
            lineControl.points[i*3 + 1] = v.y;
            lineControl.points[i*3 + 2] = v.z;
        });
        lineControl.geo.setDrawRange(0, axs.length);
        lineControl.line.geometry.attributes.position.needsUpdate = true;
    }
};
const MAX_POINTS = 20;
lineControl.points = new Float32Array(MAX_POINTS * 3);

lineControl.geo = new THREE.BufferGeometry();
lineControl.geo.setAttribute('position', new THREE.BufferAttribute(lineControl.points, 3))
lineControl.geo.setDrawRange(0, 1);

lineControl.line = new THREE.Line(lineControl.geo, lineControl.mat);