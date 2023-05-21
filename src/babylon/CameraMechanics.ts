import {
    AbstractMesh, ArcRotateCamera,
    CubeTexture,
    Engine,
    Scene, SceneLoader,
    Vector3
} from "@babylonjs/core"
import "@babylonjs/loaders";
export class CameraMechanics {

    scene: Scene
    engine: Engine
    watch: AbstractMesh | undefined
    camera: ArcRotateCamera | undefined

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true)
        this.scene = this.CreateScene()
        this.engine.displayLoadingUI()
        this.engine.runRenderLoop(() => {
            this.scene.render()
        })
    }
    CreateScene(): Scene {
        const scene = new Scene(this.engine)
        const envTex = CubeTexture.CreateFromPrefilteredData("./environments/christmas.env", scene)
        envTex.gammaSpace = false
        envTex.rotationY = Math.PI
        scene.environmentTexture = envTex
        scene.createDefaultSkybox(envTex, true,1000,0.25)
        this.CreateCamera()
        this.CreateWatch().then().catch()
        return scene
    }
    CreateCamera():void {
        this.camera = new ArcRotateCamera("camera",-Math.PI/2,Math.PI/2,3,Vector3.Zero(),this.scene)
        this.camera.attachControl(this.canvas,true)
        this.camera.wheelPrecision = 100
        this.camera.minZ = 0.3
        this.camera.lowerRadiusLimit = 1
        this.camera.upperRadiusLimit = 7
        this.camera.panningSensibility = 0
        this.camera.useAutoRotationBehavior = true
        this.camera.autoRotationBehavior!.idleRotationSpeed = 0.9
        this.camera.autoRotationBehavior!.zoomStopsAnimation = true
    }
    async CreateWatch():Promise<void> {
        const {meshes} = await SceneLoader.ImportMeshAsync("","./models/","vintage_pocket_watch.glb")
        this.watch = meshes[0]
        this.watch.scaling = new Vector3(13,13,13)
        this.engine.hideLoadingUI()
    }
}