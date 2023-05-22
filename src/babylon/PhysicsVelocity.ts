import {
    Scene,
    Engine,
    SceneLoader,
    HemisphericLight,
    Vector3,
    FreeCamera,
    CannonJSPlugin,
    MeshBuilder, PhysicsImpostor, CubeTexture
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as CANNON from "cannon"

export class PhysicsVelocity {
    scene: Scene;
    engine: Engine;
    camera!: FreeCamera;

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.CreateEnvironment().then().catch(e=>console.log(e))
        this.CreateImposters()
        this.CreateRocket().then().catch(e=>console.log(e))
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        new HemisphericLight("hemi",new Vector3(0,1,0),this.scene)
        const envTex = CubeTexture.CreateFromPrefilteredData("./environments/sky.env",scene)
        scene.environmentTexture = envTex
        scene.createDefaultSkybox(envTex,true,100,0.25)
        const camera = new FreeCamera("camera",new Vector3(0,3,-10),this.scene)
        camera.attachControl()
        camera.minZ = 0.5
        this.camera = camera
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
        // const box = MeshBuilder.CreateBox("box",{size:2})
        // box.position = new Vector3(-7,10,0)
        // box.physicsImpostor = new PhysicsImpostor(box,PhysicsImpostor.BoxImpostor,{mass:1,friction:0,restitution:0.8})
        const ground = MeshBuilder.CreateGround("ground",{width:40,height:40})
        ground.isVisible = false
        ground.physicsImpostor = new PhysicsImpostor(ground,PhysicsImpostor.BoxImpostor,{mass:0,friction:0,restitution:1})
        // const sphere = MeshBuilder.CreateSphere("sphere",{diameter:3})
        // sphere.position = new Vector3(7,10,0)
        // sphere.physicsImpostor = new PhysicsImpostor(sphere,PhysicsImpostor.SphereImpostor,{mass:1,restitution:0.8})
    }
    async CreateRocket():Promise<void> {
        const {meshes} = await SceneLoader.ImportMeshAsync("","/models/","toon_rocket.glb",this.scene)
        const rocketCol = MeshBuilder.CreateBox("rocketCol",{width:1,height:1.7,depth:1})
        rocketCol.position.y = 0.85
        rocketCol.visibility = 0
        rocketCol.physicsImpostor = new PhysicsImpostor(rocketCol,PhysicsImpostor.BoxImpostor,{mass:1})
        meshes[0].setParent(rocketCol)
        rocketCol.rotate(Vector3.Forward(),1.5)
        const rocketPhysics = ()=>{
            rocketCol?.physicsImpostor?.setLinearVelocity(rocketCol.up.scale(5))
            rocketCol?.physicsImpostor?.setAngularVelocity(new Vector3(0,1,0))
            this.camera.position = new Vector3(rocketCol.position.x,rocketCol.position.y,this.camera.position.z)
        }
        let gameOver = false
        if (!gameOver){
            this.scene.registerBeforeRender(rocketPhysics)
        }
        this.scene.onPointerDown = () => {
            gameOver = true
            this.scene.unregisterBeforeRender(rocketPhysics)
        }
    }
}