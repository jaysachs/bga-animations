/**
 * Show the element at the center of the screen
 */
class BgaShowScreenCenterAnimation<T extends BgaElementAnimationSettings> extends BgaElementAnimation<T> {
    constructor(
        settings: T,
    ) {
        super(
            settings,
        );
    }

    protected doAnimate(animationManager: AnimationManager): Promise<void> {
        return new Promise<void>((success) => {
            const element = this.settings.element;

            const elementBR = animationManager.game.getBoundingClientRectIgnoreZoom(element);

            const xCenter = (elementBR.left + elementBR.right)/2;
            const yCenter = (elementBR.top + elementBR.bottom)/2;

            const x = xCenter - (window.innerWidth / 2);
            const y = yCenter - (window.innerHeight / 2);

            const transitionTimingFunction = this.settings.transitionTimingFunction ?? 'linear';
            const duration = this.settings?.duration ?? 500;

            this.wireUp(element, duration, success);

            element.style.zIndex = `${this.settings?.zIndex ?? 10}`;

            // element.offsetHeight;
            let a = element.animate(
             [
               { transform: `translate3D(0, 0, 0)` },
               { transform: `translate3D(${-x}px, ${-y}px, 0)` }
               // { transform: `translate3D(0, 0, 0)` }
             ],
             {
               duration: duration,
               fill: "forwards",
               easing: transitionTimingFunction
             });
            a.pause();
            // element.offsetHeight;
            a.onfinish = e => {
              a.commitStyles();
              a.cancel();
              // element.style.transform = this.settings?.finalTransform ?? null;
            };
            a.play();
         });
    }
}
