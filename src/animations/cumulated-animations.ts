interface BgaCumulatedAnimationsSettings extends BgaAnimationSettings {
    animations: IBgaAnimation<BgaAnimationSettings>[];
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
        return animationManager.playSequence(this.settings.animations);
    }
}