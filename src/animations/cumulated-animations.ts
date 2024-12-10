interface BgaCumulatedAnimationsSettings extends BgaAnimationSettings {
    animations: IBgaAnimation<BgaAnimationSettings>[];
}

/**
 * Just use playSequence from animationManager
 * 
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
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

    protected async doAnimate(animationManager: AnimationManager, success: (a: void) => any) {
        await animationManager.playSequence(this.settings.animations);
        success();
        return Promise.resolve(this);
    }
}