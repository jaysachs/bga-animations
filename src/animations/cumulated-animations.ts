interface BgaCumulatedAnimationsSettings extends BgaAnimationSettings {
    animations: IBgaAnimation<BgaAnimationSettings>[];
    mode: "parallel" | "sequential";
}

/**
 * Just use playSequence from animationManager
 */

class BgaCumulatedAnimation<T extends BgaCumulatedAnimationsSettings> extends BgaAnimation<T> {
    constructor(
        settings: T,
    ) {
        super(
            settings,
        );
        this.playWhenNoAnimation = true;
    }

    protected doAnimate(animationManager: AnimationManager): Promise<any> {
        if (this.settings.mode == "parallel") {
            return animationManager.playParallel(this.settings.animations);
        } else {
            return animationManager.playSequence(this.settings.animations);
        }
    }
}