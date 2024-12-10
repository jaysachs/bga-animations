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

    protected doAnimate(animationManager: AnimationManager): Promise<void> {
        return new Promise<void>((success) => {
            console.log("doAnimate:", this);
            const element = this.settings.element;

            // , success: (a: void) => any

            const transitionTimingFunction = this.settings.transitionTimingFunction ?? 'linear';
            const duration = this.settings?.duration ?? 500;

            this.wireUp(element, duration, success);

            let {x, y} = getDeltaCoordinates(element, this.settings, animationManager);    

            element.style.transition = `transform ${duration}ms ${transitionTimingFunction}`;
            element.style.zIndex = `${this.settings?.zIndex ?? 10}`;    
            element.style.transform = `translate(${-x}px, ${-y}px) rotate(${this.settings?.rotationDelta ?? 0}deg) scale(${this.settings.scale ?? 1})`;
        });
    }
}
