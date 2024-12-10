/**
 * Just does nothing for the duration
 */
class BgaPauseAnimation<BgaAnimation> extends BgaAnimation<any> {
    constructor(
        settings: BgaAnimation,
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
