import {
    Color3,
    CubeTexture,
    Engine,
    FreeCamera, GlowLayer,
    HemisphericLight,
    MeshBuilder,
    PBRMaterial,
    Scene, SceneLoader,
    Texture,
    Vector3
} from "@babylonjs/core"
import "@babylonjs/loaders"
export class CustomModels {

    scene:Scene
    engine:Engine
    constructor(private canvas:HTMLCanvasElement) {
        this.engine = new Engine(this.canvas,true)
        this.scene = this.CreateScene()

        this.engine.runRenderLoop(()=>{
            this.scene.render()
        })
    }
    CreateScene():Scene {
        const scene = new Scene(this.engine)
        const camera = new FreeCamera("camera",new Vector3(0,1,-5),this.scene)
        camera.attachControl()
        camera.speed = 0.25
        const hemiLight = new HemisphericLight("hemilight",new Vector3(0,1,0),this.scene)
        hemiLight.intensity = 0
        const envTex = CubeTexture.CreateFromPrefilteredData("./environments/sky.env",scene)
        scene.environmentTexture = envTex
        scene.createDefaultSkybox(envTex,true)
        //this.CreateGround()
        //this.CreateBarrel()
        this.CreateCampFire().then().catch((e)=>{console.log(e)})
        return scene
    }
    CreateGround():void {
        const ground = MeshBuilder.CreateGround("ground",{width:10,height:10},this.scene)
        ground.material = this.CreateAsphalt()
    }
    CreateBall():void {
        const ball = MeshBuilder.CreateSphere("ball",{diameter:1},this.scene)
        ball.position = new Vector3(0,1,0)
        ball.material = this.CreateAutumn()
    }
    CreateAsphalt():PBRMaterial {
        const pbr = new PBRMaterial("pbr",this.scene)
        pbr.albedoTexture = new Texture("./textures/asphalt/asphalt_diffuse.jpg")
        pbr.bumpTexture = new Texture("./textures/asphalt/asphalt_normal.jpg")
        pbr.useAmbientOcclusionFromMetallicTextureRed = true
        pbr.useRoughnessFromMetallicTextureGreen = true
        pbr.useMetallnessFromMetallicTextureBlue = true
        pbr.metallicTexture = new Texture("./textures/asphalt/asphalt_arm.jpg")
        return pbr
    }
    CreateAutumn():PBRMaterial {
        const pbr = new PBRMaterial("pbr",this.scene)
        pbr.albedoTexture = new Texture("./textures/fautumn_lef/FreshAutumnLeafLitter_basecolor.png")
        pbr.bumpTexture = new Texture("./textures/fautumn_lef/FreshAutumnLeafLitter_normal.png")
        pbr.ambientTexture = new Texture("./textures/fautumn_lef/FreshAutumnLeafLitter_ambientocclusion.png")
        pbr.metallicTexture = new Texture("./textures/fautumn_lef/FreshAutumnLeafLitter_metallic.png")
        pbr.emissiveColor = new Color3(1,1,1)
        pbr.emissiveIntensity = 5
        pbr.emissiveTexture = new Texture("./textures/fautumn_lef/FreshAutumnLeafLitter_emissive.png")
        const glowLayer = new GlowLayer("glow",this.scene)
        glowLayer.intensity = 1
        return pbr
    }
    CreateBarrel():void {
        SceneLoader.ImportMesh("","./models/","Barrel1.glb",this.scene,(meshes)=>{
            console.log(meshes)
        })
    }
    async CreateCampFire():Promise<void> {
        const model = await SceneLoader.ImportMeshAsync("","./models/","campfire.glb")
        console.log(model)
    }
}