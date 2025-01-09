/**
 * Slide of the element from origin to destination.
 */

class BgaSlideAnimation<T extends BgaSlideAnimationSettings> extends BgaElementAnimation<T> {
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

            let { x, y } = animationManager.getDeltaCoordinates(element, this.settings);

            this.wireUp(element, duration, success);
            // this gets saved/restored in wireUp
            element.style.zIndex = `${this.settings?.zIndex ?? 10}`;

            let a = new Animation(new KeyframeEffect(element,
                [
                    { transform: `translate3D(0, 0, 0)` },
                    { transform: `translate3D(${-x}px, ${-y}px, 0)` }
                ],
                {
                    iterations: this.settings.iterations,
                    direction: this.settings.direction,
                    duration: duration,
                    easing: transitionTimingFunction,
                    fill: "forwards"
                }));
            a.onfinish = e => {
                a.commitStyles();
                //    element.style.transform = this.settings?.finalTransform ?? null;
            };
            a.play();
        });
    }
}
