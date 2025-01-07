let zoomManager;
let animationManager;
const FAKE_MOBILE_ZOOM = 0.75;

let game = {
    instantaneousMode: false,

    getBoundingClientRectIgnoreZoom: (element) => {
        var rect = element.getBoundingClientRect();
        var zoomCorr = FAKE_MOBILE_ZOOM;
        rect.x /= zoomCorr;
        rect.y /= zoomCorr;
        rect.width /= zoomCorr;
        rect.height /= zoomCorr;
        return rect;
    }
};

function initManager() {
    document.getElementById('game_area_wrap').style.zoom = `${FAKE_MOBILE_ZOOM}`;

    zoomManager = new ZoomManager({
        element: document.getElementById('game-table'),
        localStorageZoomKey: 'bga-animations-demo',
    });

    animationManager = new AnimationManager(game, {
        zoomManager
    });
}

function applyToMovedSquares(fn, max = 4) {
    for (let i=1; i<=max; i++) {
        const element = document.getElementById(`moved-square-${i}`);
        setTimeout(() => fn(element), 200 * (i - 1));
    }
}

function slideTo(toElement) {
    applyToMovedSquares(element => animationManager.attachWithAnimation(
        new BgaSlideAnimation({
            element,
            direction: "reverse",
        }),
        toElement
    ));
}

function slideToScreenCenterThen(toElement) {
    applyToMovedSquares(element => animationManager.play(
        new BgaCompoundAnimation({ animations: [
            new BgaShowScreenCenterAnimation({ element, transitionTimingFunction: 'ease-in', }),
            new BgaPauseAnimation({ element }),
            new BgaAttachWithAnimation({
                animation: new BgaSlideAnimation({ direction: 'reverse', element, transitionTimingFunction: 'ease-out' }),
                attachElement: toElement
            })
        ]})
    ), 1);
}

function slideToScreenCenter(toElement) {
    applyToMovedSquares(element => animationManager.play(
        new BgaShowScreenCenterAnimation({ element })
    ));
}

function slideFromTitle(element) {
    console.log("start slideFromTitle", element);
    animationManager.play(
        new BgaSlideAnimation({
            element,
            direction: "reverse",
            fromElement: document.getElementById('instantaneousMode')
        })
    ).then(() => console.log("end slideFromTitle", element));
}

function slideToHereThenDelete(toElement) {
    applyToMovedSquares(element => animationManager.play(
        new BgaSlideAnimation({
            element,
            direction: "reverse",
            fromElement: toElement,
            scale: 1
        })
    ).then(() => element.remove()), 1);
}

function fadeOutIn(element) {
    animationManager.play(
        new BgaFadeAnimation({
            element,
            duration: 1000,
            kind: "outin",
        })
    );
}

function fadeOut(element) {
    animationManager.play(
        new BgaFadeAnimation({
            element,
            duration: 1000,
            kind: "out",
        })
    );
}

function fadeIn(element) {
    animationManager.play(
        new BgaFadeAnimation({
            element,
            duration: 1000,
            kind: "in",
        })
    );
}

async function spinGrow(id) {
    await animationManager.play(
        new BgaSpinGrowAnimation({
            text: "100",
            parentId: id,
            duration: 3000,
            className: "",
            color: 'red',
        }));
}

async function slideTemp() {
    await animationManager.play(
        new BgaSlideTempAnimation({
            className: 'temp-square',
            duration:2000,
            parentId: 'game-table',
            fromId: 'instantaneousMode',
            toId: 'temp-slide'
        }));
}

async function compoundTest() {
    await animationManager.play(
        new BgaCompoundAnimation(
            {
                mode: "sequential",
                animations: [
                    new BgaCompoundAnimation(
                        {
                            mode: "parallel",
                            animations: [
                                new BgaFadeAnimation(
                                    {
                                        element: document.getElementById('moved-square-1'),
                                        kind: "outin",
                                        duration: 1200,
                                    }
                                ),
                                new BgaFadeAnimation(
                                    {
                                        element: document.getElementById('moved-square-3'),
                                        kind: "outin",
                                        duration: 1200,
                                    }
                                )
                            ],
                        }
                    ),
                    new BgaCompoundAnimation(
                        {
                            mode: "parallel",
                            animations: [
                                new BgaFadeAnimation(
                                    {
                                        element: document.getElementById('moved-square-2'),
                                        kind: "outin",
                                        duration: 1200,
                                    }
                                ),
                                new BgaFadeAnimation(
                                    {
                                        element: document.getElementById('moved-square-4'),
                                        kind: "outin",
                                        duration: 1200,
                                    }
                                )
                            ],
                        }
                    )
                ],
            }
        )
    );
}
