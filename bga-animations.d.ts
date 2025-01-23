interface BgaAnimationSettings {
    /**
     * The animation duration, in ms (default: 500).
     */
    duration?: number | undefined;
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
    protected wireUp(element: HTMLElement, duration: number, success: (a: void) => any): void;
    private timeoutId;
}
declare abstract class BgaElementAnimation<T extends BgaElementAnimationSettings> extends BgaAnimation<T> {
    constructor(settings: T);
    protected preAnimate(animationManager: AnimationManager): void;
    protected postAnimate(animationManager: AnimationManager): void;
}
/**
 * Fade the element.
 */
interface BgaFadeAnimationSettings extends BgaElementAnimationSettings {
    kind: "in" | "out" | "outin";
    iterations?: number;
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
 * Slide of the element from origin to destination.
 */
interface BgaSlideTempAnimationSettings extends BgaAnimationSettings {
    attrs?: Record<string, string>;
    className?: string;
    parentId: string;
    fromId: string;
    toId: string;
}
declare class BgaSlideTempAnimation<T extends BgaSlideTempAnimationSettings> extends BgaAnimation<T> {
    constructor(settings: T);
    private static lastId;
    private boundingRectForId;
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
 * spin/grow temp text.
 */
interface BgaSpinGrowAnimationSettings extends BgaAnimationSettings {
    className: string;
    text: string;
    centeredOnId?: string;
    parentId: string;
    fontSize?: number;
    spinCount?: number;
    color?: string;
}
declare class BgaSpinGrowAnimation<T extends BgaSpinGrowAnimationSettings> extends BgaAnimation<T> {
    constructor(settings: T);
    private static lastId;
    protected doAnimate(animationManager: AnimationManager): Promise<any>;
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
interface BgaCompoundAnimationsSettings extends BgaAnimationSettings {
    animations: IBgaAnimation<BgaAnimationSettings>[];
    mode: "parallel" | "sequential";
}
/**
 * Just use playSequence from animationManager
 */
declare class BgaCompoundAnimation<T extends BgaCompoundAnimationsSettings> extends BgaAnimation<T> {
    constructor(settings: T);
    protected doAnimate(animationManager: AnimationManager): Promise<any>;
}
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
    duration?: number | undefined;
    /**
     * The zoom manager, providing the current scale.
     */
    zoomManager?: IZoomManager | undefined;
}
declare class NoopZoomManager implements IZoomManager {
    zoom: number;
}
declare class AnimationManager {
    game: {
        getBoundingClientRectIgnoreZoom(element: Element): DOMRect;
        instantaneousMode?: boolean;
    };
    private settings?;
    /**
     * The zoom manager, providing the current scale.
     */
    private zoomManager;
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `AnimationManagerSettings` object
     */
    constructor(game: {
        getBoundingClientRectIgnoreZoom(element: Element): DOMRect;
        instantaneousMode?: boolean;
    }, settings?: AnimationManagerSettings | undefined);
    getZoomManager(): IZoomManager | undefined;
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
    /**
     * Return the x and y delta, based on the animation settings;
     *
     * @param settings an `AnimationSettings` object
     * @returns a promise when animation ends
     */
    getDeltaCoordinates(element: HTMLElement, settings: BgaAnimationWithOriginSettings): {
        x: number;
        y: number;
    };
}
