import {loadGLTF} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targetsnuevos/targets.mind',
      maxTrack: 2,
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    //primer modelo 
    const raccoon = await loadGLTF('../../assets/models/panda.glb');
    raccoon.scene.scale.set(0.5, 0.5, 0.5);
    raccoon.scene.position.set(0, 0, 0);

    //segundo modelo 
    const bear = await loadGLTF('../../assets/models/mariposa.glb');
    bear.scene.scale.set(0.4, 0.4, 0.4);
    bear.scene.position.set(0, 0, 0);
    

    //0 representa la primera imagen
    const raccoonAnchor = mindarThree.addAnchor(0);
    raccoonAnchor.group.add(raccoon.scene);

    const mixer1 = new THREE.AnimationMixer(raccoon.scene);
    //0 controla la animacion del modelo
    const action1 = mixer1.clipAction(raccoon.animations[0]);
    action1.play();
   

    //1 representa la imagen 2
    const bearAnchor = mindarThree.addAnchor(1);
    bearAnchor.group.add(bear.scene);

    const mixer = new THREE.AnimationMixer(bear.scene);
    const action = mixer.clipAction(bear.animations[0]);
    action.play();
   
    const clock = new THREE.Clock();
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta);
      
      mixer1.update(delta);
     
      renderer.render(scene, camera);
    });
  }
  start();
});
