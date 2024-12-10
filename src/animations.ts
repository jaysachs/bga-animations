interface BgaAnimationSettings {
    /**
     * The element to animate.
     */
    element?: HTMLElement;

    /**
     * The game class. Used to know if the game is in instantaneous mode (replay) becausewe don't want animations in this case.
     */
    game?: Game;

    /**
     * The animation duration, in ms (default: 500).
     */
    duration?: number;

    /**
     * The animation CSS timing function, 'linear', 'ease-in-out' (default: linear).
     */
    transitionTimingFunction?: string;

    /**
     * The cumulated scale of the element to animate (default: 1).
     */
    scale?: number;

    /**
     * The class to add to the animated element.
     */
    animationClass?: string;

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
     * The element to animate.
     */
    element: HTMLElement;

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
    played: boolean | null;
    result: any | null;

    playWhenNoAnimation: boolean;
}

abstract class BgaAnimation<T extends BgaAnimationSettings> implements IBgaAnimation<BgaAnimationSettings> {
    public played: boolean | null = null;
    public result: any | null = null;

    public playWhenNoAnimation: boolean = false;

    constructor(
        public settings: T,
    ) {
    }

    private timeoutId: number | null;

    protected wireUp(element: HTMLElement, duration: number, success: (a: void) => any): void {
        const originalZIndex = element.style.zIndex;
        const originalTransition = element.style.transition;

        const cleanOnTransitionEnd = () => {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
        };

        const cleanOnTransitionCancel = () => {
            element.style.transition = ``;
            element.offsetHeight;
            // TODO: fix this.
            element.style.transform = null; // this.settings?.finalTransform ?? null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        }

        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);

        // safety in case transitionend and transitioncancel are not called
        this.timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
}

    protected abstract doAnimate(animationManager: AnimationManager): Promise<void>;

    public async play(animationManager: AnimationManager): Promise<any> {
        this.played = this.playWhenNoAnimation || animationManager.animationsActive();
        if (this.played) {
            const settings = this.settings;

            settings.animationStart?.(this);
            settings.element?.classList.add(settings.animationClass ?? 'bga-animations_animated');

            this.settings = {
                duration: this.settings?.duration ?? animationManager.getSettings()?.duration ?? 500,
                scale: this.settings?.scale ?? animationManager.getZoomManager()?.zoom ?? undefined,
                ...this.settings,
            };
            this.result = await this.doAnimate(animationManager);

            this.settings.animationEnd?.(this);
            settings.element?.classList.remove(settings.animationClass ?? 'bga-animations_animated');
        } else {
            return Promise.resolve(this);
        }
    }
}