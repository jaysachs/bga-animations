/**
 * Fade the element.
 */

interface BgaFadeAnimationSettings extends BgaElementAnimationSettings {
   kind: "in" | "out" | "outin";
   iterations?: number;
}

class BgaFadeAnimation<T extends BgaFadeAnimationSettings> extends BgaElementAnimation<T> {
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
            const duration = this.settings?.duration ?? 500;
            this.wireUp(element, duration, success);
            // this gets saved/restored in wireUp
            // element.style.zIndex = `${this.settings?.zIndex ?? 10}`;
            const frames:{ opacity: number }[] = [];
            switch      (this.settings.kind) {
            case "in":  frames.push({ opacity: 0 }, { opacity: 1 }); break;
            case "out": frames.push({ opacity: 1 }, { opacity: 0 }); break;
            case "outin": frames.push({opacity: 1}, { opacity: 0 }, { opacity: 1 }); break;
            }
            let a = new Animation(
              new KeyframeEffect(
                element,
                frames,
                {
                  duration: duration,
                  easing: this.settings.transitionTimingFunction ?? 'linear',
                  fill: "forwards",
                  iterations: this.settings.iterations ?? 1,
                }));
             a.onfinish = e => {
              a.commitStyles();
             // element.style.transform = this.settings?.finalTransform ?? null;
             };
             a.play();
        });
    }
}
