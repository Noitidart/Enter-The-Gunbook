// @flow

export function getMaxScrollY(e: ScrollEvent) {
    const { contentSize:{ height:contentHeight }, layoutMeasurement:{ height:maxScrollYOffset } } = e.nativeEvent;
    const maxScrollY = contentHeight - maxScrollYOffset;
    return maxScrollY;
}

export function getScrollY(e: ScrollEvent) {
    return e.nativeEvent.contentOffset.y
}
