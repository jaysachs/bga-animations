interface BgaAttachWithAnimationSettings extends BgaElementAnimationSettings {
    animation: BgaAnimation<BgaAnimationWithOriginSettings>;

    /**
     * The target to attach the element to.
     */
    attachElement: HTMLElement;

    /**
     * A function called after attaching the element.
     */
    afterAttach?: (element: HTMLElement, attachElement: HTMLElement) => void;
}

/**
 * Just use playSequence from animationManager
 * 
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
class BgaAttachWithAnimation<BgaAnimationWithAttachAndOriginSettings> extends BgaAnimation<any> {
    constructor(
        settings: BgaAnimationWithAttachAndOriginSettings,
    ) {
        super(
            null,
            settings,
        );
        this.playWhenNoAnimation = true;
    }

    protected async doAnimate(animationManager: AnimationManager, success: (a: void) => any) {
        const settings = this.settings;
        const element = settings.animation.settings.element;
    
        const fromRect = animationManager.game.getBoundingClientRectIgnoreZoom(element);
        settings.animation.settings.fromRect = fromRect;
        settings.attachElement.appendChild(element);
        settings.afterAttach?.(element, settings.attachElement);
        await animationManager.play(settings.animation);
     }
}