interface BgaGame {
    getBoundingClientRectIgnoreZoom(element: Element): DOMRect;
}

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
    constructor(public game: {
        getBoundingClientRectIgnoreZoom(element: Element): DOMRect;
        // cannot add it here, else TS build will say BgaGame interface isn't fulfilled
        // instantaneousMode?: boolean;
        }, private settings?: AnimationManagerSettings) {
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
            for (let i = 0; i < animations.length; i++) {
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

    /**
     * Return the x and y delta, based on the animation settings;
     *
     * @param settings an `AnimationSettings` object
     * @returns a promise when animation ends
     */
    public getDeltaCoordinates(element: HTMLElement, settings: BgaAnimationWithOriginSettings): { x: number, y: number } {
        if (!settings.fromDelta && !settings.fromRect && !settings.fromElement) {
            throw new Error(`[bga-animation] fromDelta, fromRect or fromElement need to be set`);
        }

        let x = 0;
        let y = 0;

        if (settings.fromDelta) {
            x = settings.fromDelta.x;
            y = settings.fromDelta.y;
        } else {
            const originBR = settings.fromRect ?? this.game.getBoundingClientRectIgnoreZoom(settings.fromElement);

            // TODO make it an option ?
            const originalTransform = element.style.transform;
            element.style.transform = '';
            const destinationBR = this.game.getBoundingClientRectIgnoreZoom(element);
            element.style.transform = originalTransform;

            x = (destinationBR.left + destinationBR.right) / 2 - (originBR.left + originBR.right) / 2;
            y = (destinationBR.top + destinationBR.bottom) / 2 - (originBR.top + originBR.bottom) / 2;
        }

        if (settings.scale) {
            x /= settings.scale;
            y /= settings.scale;
        }

        return { x, y };
    }

}