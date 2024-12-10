/**
 * Just does nothing for the duration
 * 
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
class BgaPauseAnimation<BgaAnimation> extends BgaAnimation<any> {
    constructor(
        settings: BgaAnimation,
    ) {
        super(
            null,
            settings,
        );
    }

    public play(animationManager: AnimationManager): Promise<any> {
        console.log("play: ", this);
        // this.played = this.playWhenNoAnimation || animationManager.animationsActive();
        // if (this.played) {
            console.log("in pause play");
            const settings = this.settings;
            const duration = settings?.duration ?? 500;

            const p = new Promise<void>((success) => {
                setTimeout(() => { success(); }, duration);
            });
            return p;
            // console.log("timeout done");
        }
    //     return Promise.resolve(this);
    // }
}
