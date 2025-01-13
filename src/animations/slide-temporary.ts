/**
 * Slide of the element from origin to destination.
 */

interface BgaSlideTempAnimationSettings extends BgaAnimationSettings {
    className: string;
    parentId: string;
    fromId: string;
    toId: string;
}

class BgaSlideTempAnimation<T extends BgaSlideTempAnimationSettings> extends BgaAnimation<T> {
    constructor(settings: T) {
        super(settings);
    }

    private static lastId: number = 0;

    private boundingRectForId(id: string): DOMRect {
        const elem = document.getElementById(this.settings.parentId);
        if (!elem) {
            throw new Error(`Unable to find parent ${this.settings.parentId}`);
        }
        return elem.getBoundingClientRect();
    }

    protected doAnimate(animationManager: AnimationManager): Promise<any> {
        var delta = { x: 0, y: 0 };
        var div: HTMLElement;

        return new Promise<void>((success) => {
            const parent = document.getElementById(this.settings.parentId);
            if (!parent) {
                throw new Error(`Unable to find parent ${this.settings.parentId}`);
            }

            const parentRect = parent.getBoundingClientRect();
            const toRect = this.boundingRectForId(this.settings.toId);
            const fromRect = this.boundingRectForId(this.settings.fromId);

            const top = fromRect.top - parentRect.top;
            const left = fromRect.left - parentRect.left;

            div = document.createElement('div');
            div.id = `bbl_tmp_slideTmpDiv${BgaSlideTempAnimation.lastId++}`;
            div.className = this.settings.className;
            // Unclear why setting `style` attribute directly doesn't work.
            div.style.position = 'absolute';
            div.style.top = `${top}px`;
            div.style.left = `${left}px`;
            div.style.zIndex = '100';
            parent.appendChild(div);

            const duration = this.settings?.duration ?? 500;

            this.wireUp(div, duration, success);

            const divRect = div.getBoundingClientRect();
            const toTop = toRect.top - parentRect.top + (toRect.height - divRect.height) / 2;
            const toLeft = toRect.left - parentRect.left + (toRect.width - divRect.width) / 2

            delta = {
                x: left - toLeft,
                y: top - toTop
            };
            return new BgaSlideAnimation({ duration: duration, element: div, fromDelta: delta }).play(animationManager).then(() => div.remove());
        });
    }
}
