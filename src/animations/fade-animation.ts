/**
 * Fade the element.
 */

interface BgaFadeAnimationSettings extends BgaElementAnimationSettings {
   kind: "in" | "out" | "outin";
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
            let frames = [];
            switch      (this.settings.kind) {
            case "in":  frames.push({ opacity: 1 }); break;
            case "out": frames.push({ opacity: 0 }); break;
            case "outin": frames.push({opacity: 1}, { opacity: 0 }, { opacity: 1 }); break;
            }
//            var direction: "reverse" | "normal" | "alternate"  = "normal";
//            var iterations = 1;
//            if (this.settings.kind == "in") { direction = "reverse"; }
//            else if (this.settings.kind == "outin") { direction = "alternate"; iterations = 2 }
            let a = new Animation(
            new KeyframeEffect(element,
            frames,
             {
               duration: duration,
  //             easing: this.settings.transitionTimingFunction ?? 'linear',
//               direction: direction,
               fill: "forwards",
               iterations: 1,
             }));
             a.onfinish = e => {
              a.commitStyles();
             //    element.style.transform = this.settings?.finalTransform ?? null;
             };
             a.play();
        });
    }
}
