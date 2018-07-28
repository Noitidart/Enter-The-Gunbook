import React from 'react'
import { Text, View, ActivityIndicator, FlatList, PanResponder } from 'react-native'

import { getScrollY, getMaxScrollY } from './scroll-view-utils'

import Icon from '../../../../../../Icon'

import styles from './styles'

type Props = {|
    // ...FlatListProps
|}

type State = {|
    canOverScroll: boolean
|}

class FlatListPullable extends React.PureComponent<Props, State> {
    state = {
        canOverScroll: false
    }

    render() {
        const { canOverScroll } = this.state;
        const flatListProps = this.props;

        return (
            <View style={styles.flatListWrap}>
                <FlatList
                    { ...flatListProps }
                    style={styles.flatList}
                    contentContainerStyle={styles.flatListContent}
                    onScroll={this.handleScroll}
                    onScrollEndDrag={this.handleScrollEnd}
                    scrollEventThrottle={16}
                    { ...(canOverScroll ? this._panResponder.panHandlers : {}) }
                    scrollEnabled={!canOverScroll}
                    // pointerEvents={canOverScroll ? 'none' : undefined}
                    // overScrollMode={canOverScroll ? 'never' : undefined}
                />
                { canOverScroll &&
                    <View style={styles.loadMore}>
                        <Icon style={styles.loadMoreIcon} name="sync" />
                        <Text style={styles.loadMoreLabel}>Pull to load more</Text>
                    </View>
                }
            </View>
        )
    }

    handleScrollEnd = (e: ScrollEvent) => {
        const { canOverScroll } = this.state;
        // console.log('scroll ended, nativeEvent:', e.nativeEvent);

        if (!canOverScroll && getScrollY(e) === getMaxScrollY(e)) {
            console.log('overscroll enabled');
            this.setState(() => ({ canOverScroll:true }));
        }
    }

    // handleScroll = (e: ScrollEvent) => {
    //     const { canOverScroll } = this.state;
    //     // if scroll up, and overscroll is enabled, disable it
    //     // console.log('scrolled, nativeEvent:', nativeEvent);
    //     if (canOverScroll && getScrollY(e) < getMaxScrollY(e)) {
    //         console.log('overscroll disabled');
    //         this.setState(() => ({ canOverScroll:false }));
    //     }
    // }

    _panResponder = PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onPanResponderGrant: (evt, gestureState) => {
            // The gesture has started. Show visual feedback so the user knows
            // what is happening!

            // gestureState.d{x,y} will be set to zero now
        },
        onPanResponderMove: (evt, gestureState) => {
            // The most recent move distance is gestureState.move{X,Y}

            // The accumulated gesture distance since becoming responder is
            // gestureState.d{x,y}
            console.log('pan move, gestureState:', JSON.parse(JSON.stringify(gestureState)));
            const isMovingUp = gestureState.vy < 0;
            const { canOverScroll } = this.state;
            if (canOverScroll && isMovingUp) {
                this.setState(() => ({ canOverScroll:false }));
            }
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
            // The user has released all touches while this view is the
            // responder. This typically means a gesture has succeeded
        },
        onPanResponderTerminate: (evt, gestureState) => {
            // Another component has become the responder, so this gesture
            // should be cancelled
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
            // Returns whether this component should block native components from becoming the JS
            // responder. Returns true by default. Is currently only supported on android.
            return true;
        }
      })
}

export default FlatListPullable
