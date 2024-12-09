/**
 * Slide of the element from destination to origin.
 * 
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
class BgaSlideToAnimation<BgaAnimationWithAttachAndOriginSettings> extends BgaAnimation<any> {
    constructor(
        settings: BgaAnimationWithAttachAndOriginSettings,
    ) {
        super(
            null,
            settings,
        );
    }

    private timeoutId: number | null;

    private wireUp(element: HTMLElement, duration: number, success: (a: void) => any): void {
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
            element.style.transform = this.settings.finalTransform ?? null;
            cleanOnTransitionEnd();
        }

        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);

        // safety in case transitionend and transitioncancel are not called
        this.timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
}

    protected doAnimate(animationManager: AnimationManager): Promise<void> {
        const promise = new Promise<void>((success) => {
            const element = this.settings.element;

            const transitionTimingFunction = this.settings.transitionTimingFunction ?? 'linear';
            const duration = this.settings?.duration ?? 500;

            this.wireUp(element, duration, success);

            let {x, y} = getDeltaCoordinates(element, this.settings, animationManager);    

            element.style.transition = `transform ${duration}ms ${transitionTimingFunction}`;
            element.style.zIndex = `${this.settings?.zIndex ?? 10}`;    
            element.style.transform = `translate(${-x}px, ${-y}px) rotate(${this.settings?.rotationDelta ?? 0}deg) scale(${this.settings.scale ?? 1})`;
        });
        return promise;            
    }
}
