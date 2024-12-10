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
 */
class BgaAttachWithAnimation<BgaAnimationWithAttachAndOriginSettings> extends BgaElementAnimation<any> {
    constructor(
        settings: BgaAnimationWithAttachAndOriginSettings,
    ) {
        super(
            settings,
        );
        this.playWhenNoAnimation = true;
    }

    protected doAnimate(animationManager: AnimationManager): Promise<any> {
        const settings = this.settings;
        const element = settings.animation.settings.element;
    
        const fromRect = animationManager.game.getBoundingClientRectIgnoreZoom(element);
        settings.animation.settings.fromRect = fromRect;
        settings.attachElement.appendChild(element);
        settings.afterAttach?.(element, settings.attachElement);
        return animationManager.play(settings.animation);
        // return settings.animation.play(animationManager);
     }
}