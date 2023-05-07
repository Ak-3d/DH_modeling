const MeshLineControl = {
    
}
MeshLineControl.points = [];
for (let i = 0; i < 20; i++) {
    MeshLineControl.points.push(0,0,0);
}
MeshLineControl.line = new MeshLine();
MeshLineControl.line.setPoints(MeshLineControl.points);
MeshLineControl.matrial = new MeshLineMaterial({color: 0xffffff, lineWidth:0.1});
MeshLineControl.mesh = new THREE.Mesh(MeshLineControl.line, MeshLineControl.matrial);

MeshLineControl.update = (axs) => {
    axs.forEach((p, i) => {
        const v = new THREE.Vector3();
        p.getWorldPosition(v);

        MeshLineControl.points[i*3] = v.x;
        MeshLineControl.points[i*3 + 1] = v.y;
        MeshLineControl.points[i*3 + 2] = v.z;
    });
    MeshLineControl.line.setPoints(MeshLineControl.points);
}


