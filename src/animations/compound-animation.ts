interface BgaCompoundAnimationsSettings extends BgaAnimationSettings {
    animations: IBgaAnimation<BgaAnimationSettings>[];
    mode: "parallel" | "sequential";
}

/**
 * Just use playSequence from animationManager
 */

class BgaCompoundAnimation<T extends BgaCompoundAnimationsSettings> extends BgaAnimation<T> {
    constructor(
        settings: T,
    ) {
        super({
            playWhenNoAnimation: true,
            ...settings
        });
    }

    protected doAnimate(animationManager: AnimationManager): Promise<any> {
        if (this.settings.mode == "parallel") {
            return animationManager.playParallel(this.settings.animations);
        } else {
            return animationManager.playSequence(this.settings.animations);
        }
    }
}