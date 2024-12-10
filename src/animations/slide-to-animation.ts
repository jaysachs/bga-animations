/**
 * Slide of the element from destination to origin.
 */
class BgaSlideToAnimation<T extends BgaElementAnimationSettings> extends BgaElementAnimation<T> {
    constructor(
        settings: T,
    ) {
        super(
            settings,
        );
    }

    protected doAnimate(animationManager: AnimationManager): Promise<any> {
        return new Promise<void>((success) => {
            const element = this.settings.element;

            const transitionTimingFunction = this.settings.transitionTimingFunction ?? 'linear';
            const duration = this.settings?.duration ?? 500;

            this.wireUp(element, duration, success);

            let {x, y} = getDeltaCoordinates(element, this.settings, animationManager);

            element.style.zIndex = `${this.settings?.zIndex ?? 10}`;
            element.offsetHeight;
            element.style.transition = `transform ${duration}ms ${transitionTimingFunction}`;
            element.offsetHeight;
            element.style.transform = `translate(${-x}px, ${-y}px) rotate(${this.settings?.rotationDelta ?? 0}deg) scale(${this.settings.scale ?? 1})`;
        });
    }
}
