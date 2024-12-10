interface BgaCumulatedAnimationsSettings extends BgaAnimationSettings {
    animations: IBgaAnimation<BgaAnimationSettings>[];
}

/**
 * Just use playSequence from animationManager
 */

class BgaCumulatedAnimation<BgaCumulatedAnimationsSettings> extends BgaAnimation<any> {
    constructor(
        settings: BgaCumulatedAnimationsSettings,
    ) {
        super(
            null,
            settings,
        );
        this.playWhenNoAnimation = true;
    }

    protected doAnimate(animationManager: AnimationManager): Promise<any> {
        return animationManager.playSequence(this.settings.animations);
    }
}