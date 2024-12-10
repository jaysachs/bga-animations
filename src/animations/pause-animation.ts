/**
 * Just does nothing for the duration
 */
class BgaPauseAnimation<T extends BgaAnimationSettings> extends BgaAnimation<T> {
    constructor(
        settings: T,
    ) {
        super(
            settings,
        );
    }

    protected doAnimate(animationManager: AnimationManager): Promise<any> {
        return new Promise<void>((success) => {
            const duration = this.settings?.duration ?? 500;
            setTimeout(() => success(), duration);
        });
    }
}
