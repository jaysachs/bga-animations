/**
 * spin/grow temp text.
 */

interface BgaSpinGrowAnimationSettings extends BgaAnimationSettings {
  className: string;
  text: string;
  centeredOnId?: string;
  parentId: string;
  fontSize?: number;
  spinCount?: number;
  color?: string;
}

class BgaSpinGrowAnimation<T extends BgaSpinGrowAnimationSettings> extends BgaAnimation<T> {
    constructor(settings: T) {
        super(settings);
    }

    private static lastId: number = 0;

    protected doAnimate(animationManager: AnimationManager): Promise<any> {
        var delta = { x: 0, y: 0 };
        var div: HTMLElement;

        return new Promise<void>((success) => {
            const parent = document.getElementById(this.settings.parentId);

            const id = `bbl_tmp_spinGrowFx-${BgaSpinGrowAnimation.lastId++}`;
            const outer = document.createElement('span');
            outer.id = id;
            outer.append(this.settings.text);
            parent.appendChild(outer);

            outer.style.color = "blue";
            outer.style.color = "transparent";
            outer.style.position = "absolute";
            outer.style.fontSize = (this.settings.fontSize || 128) + "pt";
            outer.style.display = "inline-block";
            outer.style.justifyContent = "center";
            outer.style.alignItems = "center";
            outer.style.display = "flex";
            // probably should allow a class to be passed in and used for these two
            outer.style.fontFamily = "Helvetica";
            outer.style.fontStyle = "bold";

            // get the ultimate dimensions of the container span
            const nrect = outer.getBoundingClientRect();
            outer.style.width = `${nrect.width}`;
            outer.style.height = `${nrect.height}`;

            // center the container on the center of the appropriate node
            const centerNode = document.getElementById(this.settings.centeredOnId || this.settings.parentId);
            const prect = parent.getBoundingClientRect();
            const crect = centerNode.getBoundingClientRect();
            const left = (crect.left + crect.width/2 - nrect.width/2 - prect.left);
            const top = (crect.top + crect.height/2 - nrect.height/2 - prect.top);
            outer.style.left = left + "px";
            outer.style.top = top + "px";

            // now create the node we're animating
            const node = document.createElement('span');
            node.append(this.settings.text);
            outer.append(node);
            node.style.position = "absolute";
            node.style.display = "inline-block";
            node.style.justifyContent = "center";
            node.style.alignItems = "center";
            node.style.display = "flex";
            node.style.color = this.settings.color || 'black';
            // text not viewable
            // node.style.fontSize = "0pt";
            // keep on top
            // node.style.zIndex = "100";


            // this maybe ought to be a parameter, or part of the incoming class.
            // it also causes multiples of the text to show up!?!?
            // node.style.textShadow = "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000";

            const duration = this.settings?.duration ?? 1000;

            const fontSize = this.settings.fontSize || 90;
            const degrees = 360; // (this.settings.spinCount || 2) * 360;
            this.wireUp(node, duration, success);

            node.style.fontSize = "1pt";
            let a = new Animation(new KeyframeEffect(node,
            [
              { transform: `rotate(0deg) scale(0.01)` },
              { opacity: 1, transform: `rotate(${degrees}deg) scale(${fontSize})` },
              { opacity: 0, transform: `rotate(${degrees}deg) scale(${fontSize})` },
            ],
            {
                    duration: duration,
                    //                iterations: 1,
             }));
             a.onfinish = e => {
             //    element.style.transform = this.settings?.finalTransform ?? null;
              outer.remove();
             };

             a.play();
        });
    }
}
