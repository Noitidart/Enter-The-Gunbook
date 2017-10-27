import React, { PureComponent } from 'react'
import { Image, View } from 'react-native'
import { connect } from 'react-redux'
import { wait } from 'cmn/lib/all'

import withMonitor from '../../withMonitor'

import styles from './styles'

import type { Shape as AppShape } from '../../flow-control'

type OwnProps = {
    setLoaded: () => void,
    setPreLoaded: () => void,
    setLoadingStatus: string => void,
    isBackgroundLoaded: boolean,
    isLogoLoaded: boolean,
    isPreLoaded: boolean
}

type Props = {
    ...OwnProps,
    // redux
    isRehydrated: boolean,
    isEntitysSynced: boolean
}

class LoadingDumb extends PureComponent<Props> {
    componentDidMount() {
        this.orchestrate();
    }
    render() {
        const { isPreLoaded } = this.props;

        return (
            <View style={styles.screen}>
                { !isPreLoaded && <Image source={{ uri:'splash' }} style={{ width:144, height:144 }} /> }
            </View>
        )
    }

    async orchestrate() {
        const { setPreLoaded, setLoadingStatus, setLoaded, dispatch } = this.props;

        await wait(5000);

        await this.monitor(props => props.isBackgroundLoaded && props.isLogoLoaded);

        setPreLoaded();
        setLoadingStatus('Initializing...');
        await wait(1000); // DEBUG:

        await this.monitor(props => props.isRehydrated);

        if (!this.props.isEntitysSynced) {
            setLoadingStatus('Downloading Wiki...');
            await this.monitor(props => props.isEntitysSynced);
        }

        setLoadingStatus('');
        setLoaded();
    }
}

const LoadingMonitor = withMonitor;

const LoadingConnected = connect(
    function({_persist:{ rehydrated },account:{ syncedEntitysAt } }: AppShape) {
        return {
            isRehydrated: rehydrated,
            isEntitysSynced: syncedEntitysAt > 0
        }
    }
)

const Loading = LoadingConnected(LoadingMonitor(LoadingDumb))

export default Loading
