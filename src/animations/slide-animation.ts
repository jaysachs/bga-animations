/**
 * Slide of the element from origin to destination.
 */

class BgaSlideAnimation<T extends BgaElementAnimationSettings> extends BgaElementAnimation<T> {
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

            let {x, y} = getDeltaCoordinates(element, this.settings, animationManager);

            element.style.zIndex = `${this.settings?.zIndex ?? 10}`;
            element.offsetHeight;
            element.style.transition = null;
            element.offsetHeight;
            element.style.transform = `translate(${-x}px, ${-y}px) rotate(${this.settings?.rotationDelta ?? 0}deg) scale(${this.settings.scale ?? 1})`;

            this.wireUp(element, duration, success);

            element.offsetHeight;
            element.style.transition = `transform ${duration}ms ${transitionTimingFunction}`;
            element.offsetHeight;
            element.style.transform = this.settings?.finalTransform ?? null;
        });
    }
}
