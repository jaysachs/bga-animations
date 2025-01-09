interface BgaAttachWithAnimationSettings extends BgaAnimationSettings {
    animation: IBgaAnimation<BgaAnimationWithOriginSettings>;

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
class BgaAttachWithAnimation<T extends BgaAttachWithAnimationSettings> extends BgaAnimation<T> {
    constructor(
        settings: T,
    ) {
        super(
            settings,
        );
        this.playWhenNoAnimation = true;
    }

    protected doAnimate(animationManager: AnimationManager): Promise<any> {
        const settings = this.settings;
        const element = settings.animation.settings.element;
        element.offsetHeight;

        const fromRect = animationManager.game.getBoundingClientRectIgnoreZoom(element);
        settings.animation.settings.fromRect = fromRect;
        settings.attachElement.appendChild(element);
        settings.afterAttach?.(element, settings.attachElement);
        return animationManager.play(settings.animation);
    }
}