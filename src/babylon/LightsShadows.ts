import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    SceneLoader,
    AbstractMesh,
    GlowLayer,
    LightGizmo,
    GizmoManager,
    Light,
    Color3,
    DirectionalLight,
    PointLight,
    SpotLight,
    ShadowGenerator, CubeTexture,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class LightScene {
    scene: Scene;
    engine: Engine;
    lightTubes!: AbstractMesh[];
    models!: AbstractMesh[];
    ball!: void;

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.engine.displayLoadingUI()
        this.scene = this.CreateScene();
        this.CreateEnvironment().then().catch((e)=>{console.log(e)});
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        const camera = new FreeCamera("camera", new Vector3(0, 10, 45), this.scene);
        camera.attachControl();
        camera.speed = 0.5;
        // const newDirection = new Vector3(0, 3.3, 0); // Set the new direction vector
        // camera.rotation = newDirection;
        const target = new Vector3(0, 4, 0); // Update the target position if needed
        camera.setTarget(target);
        return scene;
    }
    async CreateEnvironment(): Promise<void> {
        const envTex = CubeTexture.CreateFromPrefilteredData("./environments/sky.env",this.scene)
        this.scene.environmentTexture = envTex
        this.scene.createDefaultSkybox(envTex,true)
        const { meshes } = await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "room.glb"
        );
        this.models = meshes;
        //this.CreateBall().then().catch((e)=>{console.log(e)})
        //this.CreateLightHouse().then().catch((e)=>{console.log(e)})
        // const glowLayer = new GlowLayer("glowLayer", this.scene);
        // glowLayer.intensity = 3;
        //this.CreateLights()
        this.engine.hideLoadingUI()
    }
    CreateLights():void {
        const pointLight = new PointLight("pointLight",new Vector3(0,4,0),this.scene)
        pointLight.intensity = 10
        pointLight.diffuse = new Color3(172/255,246/255,250/255)
        pointLight.position = new Vector3(-10,0,0)
        const pointLightClone = pointLight.clone("pointLightClone") as PointLight
        pointLightClone.position = new Vector3(10,0,0)
    }
    CreateGizmos(customLight: Light): void {
        const lightGizmo = new LightGizmo();
        lightGizmo.scaleRatio = 2;
        lightGizmo.light = customLight;

        const gizmoManager = new GizmoManager(this.scene);
        gizmoManager.positionGizmoEnabled = true;
        gizmoManager.rotationGizmoEnabled = true;
        gizmoManager.usePointerToAttachGizmos = false;
        gizmoManager.attachToMesh(lightGizmo.attachedMesh);
    }
    async CreateLightHouse():Promise<void> {
        const model = await SceneLoader.ImportMeshAsync("","./models/","lighthouse.glb")
        const {meshes} = model
        const root = meshes[0];
        // root.scaling = new Vector3(100, 100, 100)
        root.position = new Vector3(0,0,20)
    }
    async CreateBall():Promise<void> {
        const model = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, this.scene);
        model.scaling = new Vector3(80,80,80)
        model.position = new Vector3(0,200,0)
    }
}
