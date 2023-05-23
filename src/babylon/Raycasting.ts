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
    Matrix
} from "@babylonjs/core";
import "@babylonjs/loaders";
import Ammo from "ammojs-typed"

export class Raycasting {
    scene: Scene;
    engine: Engine;
    camera!: FreeCamera;
    splatters!:PBRMaterial[]

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        this.CreateEnvironment().then().catch(e=>console.log(e))
        this.CreatePhysics().then().catch(e=>console.log(e))
        this.CreateTextures()
        this.CreatingPickingRay()
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
        const ground = MeshBuilder.CreateGround("ground", {
            width: 40,
            height: 40,
        });
        ground.isVisible = false;
        ground.physicsImpostor = new PhysicsImpostor(
            ground,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, friction: 1 }
        );
        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 3 });
        const sphereMat = new PBRMaterial("sphereMat", this.scene);
        sphereMat.roughness = 1;
        sphere.position.y = 3;
        sphereMat.albedoColor = new Color3(1, 0.5, 0);
        sphere.material = sphereMat;
        sphere.physicsImpostor = new PhysicsImpostor(
            sphere,
            PhysicsImpostor.SphereImpostor,
            { mass: 2, friction: 1 }
        );
    }
    async CreatePhysics():Promise<void> {
        const ammo = await Ammo()
        const physics = new AmmoJSPlugin(true,ammo)
        this.scene.enablePhysics(new Vector3(0,-9.81,0),physics)
        this.CreateImposters()
    }
    CreateTextures():void {
        const blue = new PBRMaterial("blue",this.scene)
        const orange = new PBRMaterial("orange",this.scene)
        const green = new PBRMaterial("green",this.scene)
        blue.roughness = 1
        orange.roughness = 1
        green.roughness = 1
        blue.albedoTexture = new Texture("./textures/blue.png",this.scene)
        green.albedoTexture = new Texture("./textures/green.png",this.scene)
        orange.albedoTexture = new Texture("./textures/orange.png",this.scene)
        blue.albedoTexture.hasAlpha = true
        green.albedoTexture.hasAlpha = true
        orange.albedoTexture.hasAlpha = true
        blue.zOffset = -.25
        green.zOffset = -.25
        orange.zOffset = -.25
        this.splatters = [blue,green,orange]
    }
    CreatingPickingRay():void {
        this.scene.onPointerDown = ()=>{
            const ray = this.scene.createPickingRay(this.scene.pointerX,this.scene.pointerY,Matrix.Identity(),this.camera)
            const raycastHit = this.scene.pickWithRay(ray)
            if (raycastHit?.hit && raycastHit?.pickedMesh?.name == "sphere") {
                const decal = MeshBuilder.CreateDecal("decal",raycastHit?.pickedMesh, {
                    position:raycastHit.pickedPoint as Vector3,
                    normal:raycastHit.getNormal(true) as Vector3,
                    size: new Vector3(1,1,1)})
                decal.material = this.splatters[Math.floor(Math.random()*this.splatters.length)]
                decal.setParent(raycastHit.pickedMesh)
                raycastHit.pickedMesh.applyImpulse(ray.direction,raycastHit.pickedPoint as Vector3)
            }
        }
    }
}