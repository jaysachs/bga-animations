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

    /**
     * If the card is rotated at the start of animation.
     */
    rotationDelta?: number;
}

interface BgaAnimationWithOriginSettings extends BgaElementAnimationSettings {

    /**
     * A delta coordinates (object with x and y properties).
     */
    fromDelta?: {x: number, y: number};

    /**
     * An initial Rect position. Can be the moved object BoundingClientRect itself, before being attached.
     */
    fromRect?: DOMRect;

    /**
     * The element to move the card from.
     */
    fromElement?: HTMLElement;
}

interface IBgaAnimation<T extends BgaAnimationSettings> {
    settings: T;
    play(animationManager: AnimationManager): Promise<any>;
}

abstract class BgaAnimation<T extends BgaAnimationSettings> implements IBgaAnimation<T> {
    public result: any | null = null;

    public playWhenNoAnimation: boolean = false;

    constructor(
        public settings: T,
    ) {}

    protected preAnimate(animationManager: AnimationManager): void { }
    protected postAnimate(animationManager: AnimationManager): void { }
    protected abstract doAnimate(animationManager: AnimationManager): Promise<void>;

    public async play(animationManager: AnimationManager): Promise<any> {
        const shouldPlay = this.playWhenNoAnimation || animationManager.animationsActive();
        if (shouldPlay) {
            this.settings.animationStart?.(this);

            this.settings = {
                duration: this.settings?.duration ?? animationManager.getSettings()?.duration ?? 500,
                ...this.settings,
            };

            this.preAnimate(animationManager);
            this.result = await this.doAnimate(animationManager);
            this.postAnimate(animationManager);

            this.settings.animationEnd?.(this);
        } else {
            return Promise.resolve(this);
        }
    }
}

abstract class BgaElementAnimation<T extends BgaElementAnimationSettings> extends BgaAnimation<T> {
    constructor(settings: T) { super(settings); }
    private timeoutId: number | null;

    protected preAnimate(animationManager: AnimationManager): void {
        this.settings = {
            scale: this.settings?.scale ?? animationManager.getZoomManager()?.zoom ?? undefined,
            ...this.settings,
        };
        this.settings.element.classList.add(this.settings.animationClass ?? 'bga-animations_animated');
    }
    protected postAnimate(animationManager: AnimationManager): void {
        this.settings.element.classList.remove(this.settings.animationClass ?? 'bga-animations_animated');
    }

    protected wireUp(element: HTMLElement, duration: number, success: (a: void) => any): void {
        const originalZIndex = element.style.zIndex;
        const originalTransition = element.style.transition;

        const cleanOnTransitionEnd = () => {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            element.removeEventListener("animationend", cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
        };

        const cleanOnTransitionCancel = () => {
            element.style.transition = ``;
            element.offsetHeight;
            element.style.transform = this.settings?.finalTransform ?? null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        }

        element.addEventListener("animationend", cleanOnTransitionEnd, false);
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);

        // safety in case transitionend and transitioncancel are not called
        this.timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
}
}
