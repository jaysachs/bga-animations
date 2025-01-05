interface BgaAnimationSettings {
    /**
     * The game class. Used to know if the game is in instantaneous mode (replay) becausewe don't want animations in this case.
     */
    game?: Game;
    /**
     * The animation duration, in ms (default: 500).
     */
    duration?: number;
    /**
     * A function called when animation starts (for example to add a zoom effect on a card during a reveal animation).
     */
    animationStart?: (animation: IBgaAnimation<BgaAnimationSettings>) => any;
    /**
     * A function called when animation ends.
     */
    animationEnd?: (animation: IBgaAnimation<BgaAnimationSettings>) => any;
}
interface BgaElementAnimationSettings extends BgaAnimationSettings {
    /**
    * The animation CSS timing function, 'linear', 'ease-in-out' (default: linear).
    */
    transitionTimingFunction?: string;
    /**
    * The cumulated scale of the element to animate (default: 1).
    */
    scale?: number;
    /**
     * The element to animate.
     */
    element: HTMLElement;
    /**
     * The class to add to the animated element.
     */
    animationClass?: string;
    /**
     * The zIndex to apply during animation (default: 10).
     */
    zIndex?: number;
    /**
     * The transform property to set after the animation.
     */
    finalTransform?: string;
}
interface BgaAnimationWithOriginSettings extends BgaElementAnimationSettings {
    /**
     * A delta coordinates (object with x and y properties).
     */
    fromDelta?: {
        x: number;
        y: number;
    };
    /**
     * An initial Rect position. Can be the moved object BoundingClientRect itself, before being attached.
     */
    fromRect?: DOMRect;
    /**
     * The element to move the card from.
     */
    fromElement?: HTMLElement;
}
interface BgaSlideAnimationSettings extends BgaElementAnimationSettings {
    direction?: "normal" | "reverse" | "alternate";
    iterations?: number;
}
interface IBgaAnimation<T extends BgaAnimationSettings> {
    settings: T;
    play(animationManager: AnimationManager): Promise<any>;
}
declare abstract class BgaAnimation<T extends BgaAnimationSettings> implements IBgaAnimation<T> {
    settings: T;
    result: any | null;
    playWhenNoAnimation: boolean;
    constructor(settings: T);
    protected preAnimate(animationManager: AnimationManager): void;
    protected postAnimate(animationManager: AnimationManager): void;
    protected abstract doAnimate(animationManager: AnimationManager): Promise<void>;
    play(animationManager: AnimationManager): Promise<any>;
}
declare abstract class BgaElementAnimation<T extends BgaElementAnimationSettings> extends BgaAnimation<T> {
    constructor(settings: T);
    private timeoutId;
    protected preAnimate(animationManager: AnimationManager): void;
    protected postAnimate(animationManager: AnimationManager): void;
    protected wireUp(element: HTMLElement, duration: number, success: (a: void) => any): void;
}
declare function shouldAnimate(settings?: BgaAnimationSettings): boolean;
/**
 * Return the x and y delta, based on the animation settings;
 *
 * @param settings an `AnimationSettings` object
 * @returns a promise when animation ends
 */
declare function getDeltaCoordinates(element: HTMLElement, settings: BgaAnimationWithOriginSettings, animationManager: AnimationManager): {
    x: number;
    y: number;
};
declare function logAnimation(animationManager: AnimationManager, animation: IBgaAnimation<BgaCumulatedAnimationsSettings>): Promise<any>;
/**
 * Fade the element.
 */
interface BgaFadeAnimationSettings extends BgaElementAnimationSettings {
    kind: "in" | "out" | "outin";
}
declare class BgaFadeAnimation<T extends BgaFadeAnimationSettings> extends BgaElementAnimation<T> {
    constructor(settings: T);
    protected doAnimate(animationManager: AnimationManager): Promise<any>;
}
/**
 * Slide of the element from origin to destination.
 */
declare class BgaSlideAnimation<T extends BgaSlideAnimationSettings> extends BgaElementAnimation<T> {
    constructor(settings: T);
    protected doAnimate(animationManager: AnimationManager): Promise<any>;
}
/**
 * Show the element at the center of the screen
 */
declare class BgaShowScreenCenterAnimation<T extends BgaElementAnimationSettings> extends BgaElementAnimation<T> {
    constructor(settings: T);
    protected doAnimate(animationManager: AnimationManager): Promise<void>;
}
/**
 * Just does nothing for the duration
 */
declare class BgaPauseAnimation<T extends BgaAnimationSettings> extends BgaAnimation<T> {
    constructor(settings: T);
    protected doAnimate(animationManager: AnimationManager): Promise<any>;
}
interface BgaAttachWithAnimationSettings extends BgaAnimationSettings {
    animation: IBgaAnimation<BgaAnimationWithOriginSettings>;
    /**
     * The target to attach the element to.
     */
    attachElement: HTMLElement;
    /**
     * A function called after attaching the element.
     */
    afterAttach?: (element: HTMLElement, attachElement: HTMLElement) => void;
}
/**
 * Just use playSequence from animationManager
 */
declare class BgaAttachWithAnimation<T extends BgaAttachWithAnimationSettings> extends BgaAnimation<T> {
    constructor(settings: T);
    protected doAnimate(animationManager: AnimationManager): Promise<any>;
}
interface BgaCumulatedAnimationsSettings extends BgaAnimationSettings {
    animations: IBgaAnimation<BgaAnimationSettings>[];
}
/**
 * Just use playSequence from animationManager
 */
declare class BgaCumulatedAnimation<T extends BgaCumulatedAnimationsSettings> extends BgaAnimation<T> {
    constructor(settings: T);
    protected doAnimate(animationManager: AnimationManager): Promise<any>;
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
declare class AnimationManager {
    game: Game;
    private settings?;
    /**
     * The zoom manager, providing the current scale.
     */
    private zoomManager?;
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `AnimationManagerSettings` object
     */
    constructor(game: Game, settings?: AnimationManagerSettings);
    getZoomManager(): IZoomManager;
    /**
     * Set the zoom manager, to get the scale of the current game.
     *
     * @param zoomManager the zoom manager
     */
    setZoomManager(zoomManager: IZoomManager): void;
    getSettings(): AnimationManagerSettings | null | undefined;
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    animationsActive(): boolean;
    /**
     * Plays an animation if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @param animation the animation to play
     * @returns the animation promise.
     */
    play(animation: IBgaAnimation<BgaAnimationSettings>): Promise<IBgaAnimation<BgaAnimationSettings>>;
    /**
     * Plays multiple animations in parallel.
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    playParallel(animations: IBgaAnimation<BgaAnimationSettings>[]): Promise<IBgaAnimation<BgaAnimationSettings>[]>;
    /**
     * Plays multiple animations in sequence (the second when the first ends, ...).
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    playSequence(animations: IBgaAnimation<BgaAnimationSettings>[]): Promise<IBgaAnimation<BgaAnimationSettings>[]>;
    /**
     * Plays multiple animations with a delay between each animation start.
     *
     * @param animations the animations to play
     * @param delay the delay (in ms)
     * @returns a promise for all animations.
     */
    playWithDelay(animations: IBgaAnimation<BgaAnimationSettings>[], delay: number): Promise<IBgaAnimation<BgaAnimationSettings>[]>;
    /**
     * Attach an element to a parent, then play animation from element's origin to its new position.
     *
     * @param animation the animation function
     * @param attachElement the destination parent
     * @returns a promise when animation ends
     */
    attachWithAnimation(animation: IBgaAnimation<BgaAnimationWithOriginSettings>, attachElement: HTMLElement): Promise<IBgaAnimation<any>>;
}
declare const define: any;
