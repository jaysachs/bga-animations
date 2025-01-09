interface GameGui {
    // instantaneousMode?: boolean; // cannot add it here, else TS build will say Game interface isn't fulfilled
    getBoundingClientRectIgnoreZoom(element: Element): DOMRect;
}
