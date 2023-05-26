import {
    Scene,
    Engine,
    SceneLoader,
    HemisphericLight,
    Vector3,
    FreeCamera,
    AmmoJSPlugin,
    MeshBuilder,
    PhysicsImpostor,
    CubeTexture,
    PBRMaterial,
    Color3,
    ActionManager,
    ExecuteCodeAction,
    Texture,
    Matrix, AbstractMesh, Animation, Mesh
} from "@babylonjs/core";
import "@babylonjs/loaders";
import Ammo from "ammojs-typed"

export class Animations {
    scene: Scene;
    engine: Engine;
    target!:AbstractMesh

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.CreateEnvironment().then().catch(e=>console.log(e))
        this.CreateTarget()
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
                mesh.setEnabled(false)
            }
        })
    }
    async CreateTarget():Promise<void> {
        const {meshes} = await SceneLoader.ImportMeshAsync("","/models/","targetB.glb",this.scene)
        meshes.shift()
        this.target = Mesh.MergeMeshes(meshes as Mesh[],true,true,undefined,false,true) as AbstractMesh
        this.target.position.y = 3
        this.target.rotation.y = -Math.PI / 2
        this.target.scaling = new Vector3(4, 4, 4);
        this.CreateAnimations()
    }
    CreateAnimations():void {
        const rotateFrames = []
        const slideFrames = []
        const fadeFrames = []
        const fps = 60
        const rotateAnim = new Animation("rotateAnim","rotation.x",fps,Animation.ANIMATIONTYPE_FLOAT,Animation.ANIMATIONLOOPMODE_CYCLE)
        const slideAnim = new Animation("slideAnim","position",fps,Animation.ANIMATIONTYPE_VECTOR3,Animation.ANIMATIONLOOPMODE_CYCLE)
        const fadeAnim = new Animation("fadeAnim","visibility",fps,Animation.ANIMATIONTYPE_FLOAT,Animation.ANIMATIONLOOPMODE_CONSTANT)
        rotateFrames.push({frame:0,value:0})
        rotateFrames.push({frame:180,value:Math.PI/2})
        slideFrames.push({frame:0,value:new Vector3(0,3,0)})
        slideFrames.push({frame:45,value:new Vector3(-3,2,0)})
        slideFrames.push({frame:90,value:new Vector3(0,3,0)})
        slideFrames.push({frame:135,value:new Vector3(3,2,0)})
        slideFrames.push({frame:180,value:new Vector3(0,3,0)})
        fadeFrames.push({frame:0,value:1})
        fadeFrames.push({frame:180,value:0})
        rotateAnim.setKeys(rotateFrames)
        slideAnim.setKeys(slideFrames)
        fadeAnim.setKeys(fadeFrames)
        this.target.animations.push(rotateAnim)
        this.target.animations.push(slideAnim)
        this.target.animations.push(fadeAnim)
        this.scene.beginAnimation(this.target,0,180,true)
    }
}