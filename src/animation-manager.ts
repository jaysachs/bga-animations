interface IZoomManager {
    /**
     * Returns the zoom level
     */
    zoom: number;
}

interface AnimationManagerSettings {
    /**
     * The default animation duration, in ms (default: 500).
     */
    duration?: number;

    /**
     * The zoom manager, providing the current scale.
     */
    zoomManager?: IZoomManager;
}


class AnimationManager {
    /**
     * The zoom manager, providing the current scale.
     */
    private zoomManager?: IZoomManager;

    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `AnimationManagerSettings` object
     */
    constructor(public game: Game, private settings?: AnimationManagerSettings) {
        this.zoomManager = settings?.zoomManager;

        if (!game) {
            throw new Error('You must set your game as the first parameter of AnimationManager');
        }
    }

    public getZoomManager(): IZoomManager {
        return this.zoomManager;
    }

    /**
     * Set the zoom manager, to get the scale of the current game.
     * 
     * @param zoomManager the zoom manager
     */
    public setZoomManager(zoomManager: IZoomManager): void {
        this.zoomManager = zoomManager;
    }

    public getSettings(): AnimationManagerSettings | null | undefined {
        return this.settings;
    }
    
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     * 
     * @returns if the animations are active.
     */
    public animationsActive(): boolean {
        return document.visibilityState !== 'hidden' && !(this.game as any).instantaneousMode;
    }

    /**
     * Plays an animation if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     * 
     * @param animation the animation to play
     * @returns the animation promise.
     */
    async play(animation: IBgaAnimation<BgaAnimationSettings>): Promise<IBgaAnimation<BgaAnimationSettings>> {
        return animation.play(this);
    }

    /**
     * Plays multiple animations in parallel.
     * 
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    async playParallel(animations: IBgaAnimation<BgaAnimationSettings>[]): Promise<IBgaAnimation<BgaAnimationSettings>[]> {
        return Promise.all(animations.map(animation => this.play(animation)));
    }

    /**
     * Plays multiple animations in sequence (the second when the first ends, ...).
     * 
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    async playSequence(animations: IBgaAnimation<BgaAnimationSettings>[]): Promise<IBgaAnimation<BgaAnimationSettings>[]> {
        const result = [];
        for (const a of animations) {
            result.push(await this.play(a));
        }
        return Promise.resolve(result);
    }

    /**
     * Plays multiple animations with a delay between each animation start.
     * 
     * @param animations the animations to play
     * @param delay the delay (in ms)
     * @returns a promise for all animations.
     */
    async playWithDelay(animations: IBgaAnimation<BgaAnimationSettings>[], delay: number): Promise<IBgaAnimation<BgaAnimationSettings>[]> {
        const promise = new Promise<IBgaAnimation<BgaAnimationSettings>[]>((success) => {
            let promises: Promise<IBgaAnimation<BgaAnimationSettings>>[] = [];
            for (let i=0; i<animations.length; i++) {
                setTimeout(() => {
                    promises.push(this.play(animations[i]));
                    if (i == animations.length - 1) {
                        Promise.all(promises).then(result => {
                            success(result);
                        });
                    }
                }, i * delay);
            }
        });
    
        return promise;
    }

    /**
     * Attach an element to a parent, then play animation from element's origin to its new position.
     * 
     * @param animation the animation function
     * @param attachElement the destination parent
     * @returns a promise when animation ends
     */
    public attachWithAnimation(animation: IBgaAnimation<BgaAnimationWithOriginSettings>, attachElement: HTMLElement): Promise<IBgaAnimation<any>> {
        const attachWithAnimation = new BgaAttachWithAnimation({
            animation,
            duration: null,
            attachElement
        });
        return this.play(attachWithAnimation);
    }
}