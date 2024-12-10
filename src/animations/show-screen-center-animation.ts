/**
 * Show the element at the center of the screen
 * 
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
class BgaShowScreenCenterAnimation<BgaAnimation> extends BgaAnimation<any> {
    constructor(
        settings: BgaAnimation,
    ) {
        super(
            null,
            settings,
        );
    }

    protected doAnimate(animationManager: AnimationManager): Promise<void> {
        const promise = new Promise<void>((success) => {
            const element = this.settings.element;

            const elementBR = animationManager.game.getBoundingClientRectIgnoreZoom(element);
    
            const xCenter = (elementBR.left + elementBR.right)/2;
            const yCenter = (elementBR.top + elementBR.bottom)/2;
    
            const x = xCenter - (window.innerWidth / 2);
            const y = yCenter - (window.innerHeight / 2);

            const transitionTimingFunction = this.settings.transitionTimingFunction ?? 'linear';
            const duration = this.settings?.duration ?? 500;

            this.wireUp(element, duration, success);

            element.style.transition = `transform ${duration}ms ${transitionTimingFunction}`;
            element.style.zIndex = `${this.settings?.zIndex ?? 10}`;    
            element.style.transform = `translate(${-x}px, ${-y}px) rotate(${this.settings?.rotationDelta ?? 0}deg) scale(${this.settings.scale ?? 1})`;
        });
        return promise;
    }
}

