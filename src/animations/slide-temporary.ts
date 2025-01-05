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

    protected doAnimate(animationManager: AnimationManager): Promise<any> {
        var delta = { x: 0, y: 0 };
        return new Promise<void>((success) => {
            const parent = document.getElementById(this.settings.parentId);

            const parentRect = parent.getBoundingClientRect();
            const toRect = document.getElementById(this.settings.toId).getBoundingClientRect();
            const fromRect = document.getElementById(this.settings.fromId).getBoundingClientRect();

            const top = fromRect.top - parentRect.top;
            const left = fromRect.left - parentRect.left;

            const div = document.createElement('div');
            div.id = `bbl_tmp_slideTmpDiv${BgaSlideTempAnimation.lastId++}`;
            div.className = this.settings.className;
            // Unclear why setting `style` attribute directly doesn't work.
            div.style.position = 'absolute';
            div.style.top = `${top}px`;
            div.style.left = `${left}px`;
            div.style.zIndex = '100';
            parent.appendChild(div);

            const divRect = div.getBoundingClientRect();
            const toTop = toRect.top - parentRect.top + (toRect.height - divRect.height)/2;
            const toLeft = toRect.left - parentRect.left + (toRect.width - divRect.width)/2

            delta = {
                x: left - toLeft,
                y: top - toTop
            };

            new BgaSlideAnimation({ element: div, fromDelta: delta }).play(animationManager)
                .then(() => div.remove());
        });
    }
}
