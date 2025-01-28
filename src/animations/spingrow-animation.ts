/**
 * spin/grow temp text.
 */

interface BgaSpinGrowAnimationSettings extends BgaAnimationSettings {
  attrs?: Record<string, string>;
  className?: string;
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
      if (!parent) {
        throw new Error(`No parent element with id ${this.settings.parentId}`);
      }
      const id = `bgaanim_tmp_spinGrowFx-${BgaSpinGrowAnimation.lastId++}`;
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
      if (!centerNode) {
        throw new Error(`No center node found for ${this.settings}`);
      }
      const prect = parent.getBoundingClientRect();
      const crect = centerNode.getBoundingClientRect();
      const left = (crect.left + crect.width / 2 - nrect.width / 2 - prect.left);
      const top = (crect.top + crect.height / 2 - nrect.height / 2 - prect.top);
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

      if (this.settings.className) {
        node.className = this.settings.className;
      }
      if (this.settings.attrs) {
        for (const name in this.settings.attrs) {
            node.setAttribute(name, this.settings.attrs[name]!);
        }
      }

      // this maybe ought to be a parameter, or part of the incoming class.
      // it also causes multiples of the text to show up!?!?
      // node.style.textShadow = "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000";
      node.style.setProperty('-webkit-text-stroke', 'thin black');

      const fontSize = this.settings.fontSize || 190;
      node.style.fontSize = `${fontSize}pt`;
      node.style.opacity = '0';

      const duration = this.settings?.duration ?? 1000;
      const degrees = (this.settings.spinCount || 2) * 360;
      this.wireUp(node, duration, success);

      let a = new Animation(new KeyframeEffect(node,
        [
          { opacity: 1, transform: `rotate(0deg) scale(0.01)` },
          { opacity: 1, transform: `rotate(${degrees}deg) scale(1)` },
          { opacity: 0, transform: `rotate(${degrees}deg) scale(1)` },
        ],
        { duration: duration }));
      a.onfinish = e => {
        //    element.style.transform = this.settings?.finalTransform ?? null;
        outer.remove();
      };

      a.play();
    });
  }
}
