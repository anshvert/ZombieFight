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

export class CharacterAnimations {
    scene: Scene;
    engine: Engine;
    target!:AbstractMesh

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.CreateEnvironment().then().catch(e=>console.log(e))
        this.CreateCharacter()
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
        camera.speed = 0.5
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
    async CreateCharacter():Promise<void> {
        const {meshes,animationGroups} = await SceneLoader.ImportMeshAsync("","./models/","Character.glb",this.scene);
        meshes[0].rotate(Vector3.Up(),Math.PI)
        console.log(animationGroups)
        animationGroups[0].stop()
        animationGroups[2].play(true)
    }
}