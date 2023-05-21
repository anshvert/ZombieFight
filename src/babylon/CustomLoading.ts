import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    CubeTexture,
    SceneLoader,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { CustomLoadingScreen } from "./CustomLoadingScreen";

export class CustomLoading {
    scene: Scene;
    engine: Engine;
    loadingScreen: CustomLoadingScreen;

    constructor(
        private canvas: HTMLCanvasElement,
        private loadingBar: HTMLElement,
        private percentLoaded: HTMLElement,
        private loader: HTMLElement
    ) {
        this.engine = new Engine(this.canvas, true);
        this.loadingScreen = new CustomLoadingScreen(
            this.loadingBar,
            this.percentLoaded,
            this.loader
        );
        this.engine.loadingScreen = this.loadingScreen;
        this.engine.displayLoadingUI();
        this.scene = this.CreateScene();
        this.CreateEnvironment();
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        const camera = new FreeCamera("camera", new Vector3(0, 10, 45), this.scene);
        camera.attachControl();
        camera.speed = 0.5;
        const target = new Vector3(0, 4, 0); // Update the target position if needed
        camera.setTarget(target);
        return scene;
    }
    async CreateEnvironment(): Promise<void> {
        const envTex = CubeTexture.CreateFromPrefilteredData("./environments/sky.env",this.scene)
        this.scene.environmentTexture = envTex
        this.scene.createDefaultSkybox(envTex,true)
        await SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "room.glb",
            this.scene,
            (evt)=> {
                let loadStatus = Math.floor(evt.loaded / 100000);
                loadStatus -= (loadStatus % 10)
                this.loadingScreen.updateLoadStatus(loadStatus.toFixed())
            }
        );
        this.engine.hideLoadingUI()
    }
}