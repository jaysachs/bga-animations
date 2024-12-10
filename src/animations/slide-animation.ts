/**
 * Slide of the element from origin to destination.
 */

class BgaSlideAnimation<BgaAnimationWithAttachAndOriginSettings> extends BgaAnimation<any> {
    constructor(
        settings: BgaAnimationWithAttachAndOriginSettings,
    ) {
        super(
            null,
            settings,
        );
    }
    protected doAnimate(animationManager: AnimationManager): Promise<any> {
        const promise = new Promise<void>((success) => {
            const settings = this.settings;
            const element = settings.element;
    
            let {x, y} = getDeltaCoordinates(element, settings, animationManager);
    
            const duration = settings.duration ?? 500;
            const originalZIndex = element.style.zIndex;
            const originalTransition = element.style.transition;
            const transitionTimingFunction = settings.transitionTimingFunction ?? 'linear';
    
            element.style.zIndex = `${settings?.zIndex ?? 10}`;
            element.style.transition = null;
            element.offsetHeight;
            element.style.transform = `translate(${-x}px, ${-y}px) rotate(${settings?.rotationDelta ?? 0}deg)`;
    
            let timeoutId = null;
    
            const cleanOnTransitionEnd = () => {
                element.style.zIndex = originalZIndex;
                element.style.transition = originalTransition;
                success();
                element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
                element.removeEventListener('transitionend', cleanOnTransitionEnd);
                document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
    
            const cleanOnTransitionCancel = () => {
                element.style.transition = ``;
                element.offsetHeight;
                element.style.transform = settings?.finalTransform ?? null;
                element.offsetHeight;
                cleanOnTransitionEnd();
            }
    
            element.addEventListener('transitioncancel', cleanOnTransitionCancel);
            element.addEventListener('transitionend', cleanOnTransitionEnd);
            document.addEventListener('visibilitychange', cleanOnTransitionCancel);
    
            element.offsetHeight;
            element.style.transition = `transform ${duration}ms ${transitionTimingFunction}`;
            element.offsetHeight;
            element.style.transform = settings?.finalTransform ?? null;
            // safety in case transitionend and transitioncancel are not called
            timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
        });
    
        return promise;
    }
    }