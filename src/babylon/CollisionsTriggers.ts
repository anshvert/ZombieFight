import {
    Scene,
    Engine,
    SceneLoader,
    AbstractMesh,
    MeshBuilder,
    Vector3,
    PhysicsImpostor,
    HemisphericLight, FreeCamera, CannonJSPlugin, StandardMaterial, Color3
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from 'cannon'
import {StandardMaterials} from "@/babylon/standardMaterials";

export class CollisionsTriggers {
    scene: Scene;
    engine: Engine;
    sphere: AbstractMesh | undefined
    box: AbstractMesh | undefined
    ground: AbstractMesh | undefined

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.CreateEnvironment().then().catch(e=>console.log(e))
        this.CreateImposters()
        this.DetectTrigger()
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        new HemisphericLight("hemi",new Vector3(0,1,0),this.scene)
        const camera = new FreeCamera("camera",new Vector3(0,10,-20),this.scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl()
        camera.minZ = 0.5
        scene.enablePhysics(new Vector3(0,-9.81,0),new CannonJSPlugin(true,10,CANNON))
        return scene;
    }
    async CreateEnvironment(): Promise<void> {
        const { meshes } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "Prototype_Level.glb",
            this.scene
        );
        meshes.map((mesh)=>{
            if (mesh.name == "Ramp") {
                mesh.position = new Vector3(12,0,0)
            }
        })
    }
    CreateImposters():void {
        // this.box = MeshBuilder.CreateBox("box",{size:2})
        // this.box.position = new Vector3(0,3,0)
        // this.box.physicsImpostor = new PhysicsImpostor(this.box,PhysicsImpostor.BoxImpostor,{mass:1,friction:0,restitution:1.1})
        this.ground = MeshBuilder.CreateGround("ground",{width:40,height:40})
        this.ground.position.y = 0.3
        this.ground.isVisible = false
        this.ground.physicsImpostor = new PhysicsImpostor(this.ground,PhysicsImpostor.BoxImpostor,{mass:0,friction:10,restitution:1})
        this.sphere = MeshBuilder.CreateSphere("sphere",{diameter:3})
        this.sphere.position = new Vector3(0,8,0)
        this.sphere.physicsImpostor = new PhysicsImpostor(this.sphere,PhysicsImpostor.SphereImpostor,{mass:1,restitution:0.8,friction:1})
        // this.box.physicsImpostor.registerOnPhysicsCollide(this.sphere.physicsImpostor,this.DetectCollisions)
        //this.sphere.physicsImpostor.registerOnPhysicsCollide([this.box.physicsImpostor,this.ground.physicsImpostor],this.DetectCollisions)
    }
    DetectCollisions(boxCol:PhysicsImpostor,colAgainst:PhysicsImpostor):void {

        const redMat = new StandardMaterial("mat",this.scene)
        redMat.diffuseColor = new Color3(1,0,0);

        // boxCol.object.scaling = new Vector3(3,3,3)
        // boxCol.setScalingUpdated();
        (colAgainst.object as AbstractMesh).material = redMat
    }
    DetectTrigger():void {
        const box = MeshBuilder.CreateBox("box",{width:4,height:1,depth:4})
        box.position.y = 0.5
        box.visibility = 0.25
        this.scene.registerBeforeRender(()=>{
            //console.log(box.intersectsMesh(this.sphere as AbstractMesh))
        })
    }
}