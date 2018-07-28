import React from 'react'
import { Text, View, ActivityIndicator, FlatList } from 'react-native'
import moment from 'moment'
import { delay } from 'redux-saga'

import { fetchApi } from '../../../../../flow-control/utils'

import Icon from '../../../../../Icon'
import SearchLink from '../SearchLink';

import styles from './styles'

import type { Card } from '../../../flow-control/cards'

type Props = {|
    cardId: $PropertType<Card, 'id'>
|}

type State = {||}

type Activity = {|
    id: number,
    entityId: string, // article name
    type: 'thumb_up' | 'thumb_down' | 'helpful' | 'comment',
    createdAt: DateIso
|}

type ActivityRaw = {|
    id: number,
    like: boolean, //only if type thumb
    displayname_id: number,
    article_id: number,
    created_at: DateIso,
    updated_at: DateIso,
    type: 'thumb_up' | 'thumb_down' | 'helpful' | 'comment',
    article: {
        id: number,
        kind: null,
        name: string,
        created_at: DateIso,
        updated_at: DateIso
    }
|}

function getIconsNameFromActivity(rawActivity: ActivityRaw) {
    switch (rawActivity.type) {
        case 'helpful': return [
            <Icon name="add" key="add" />,
            <Icon name="comment" key="comment" />
        ];
        default: return <Icon name={rawActivity.type} />;
    }
}

function getActivityFromRawActivity(rawActivity: ActivityRaw) {
    const { id, created_at:createdAt, type, article:{ name:entityId } } = rawActivity;
    return {
        id,
        entityId,
        createdAt,
        type: type !== 'thumb' ? type : (rawActivity.like ? 'thumb_up' : 'thumb_down'),
    };
}

function extractKeyFromActivity(activity: Activity) {
    return activity.type + activity.id;
}

export function formatAgoShort(iso: DateIso) {
    const m = moment.utc(iso).local();
    if (m.isSameOrAfter(moment().subtract(44, 'm'))) {
        return m.fromNow(true)
                .replace('minutes', 'min')
                .replace('a minute', '1 min')
                .replace('a few seconds', 'now');
    } else {
        return m.calendar(null, {
            sameDay: '[Today]',
            lastDay: '[Yesterday]',
            lastWeek: 'ddd',
            sameElse: function(now) {
                if (this.isSameOrAfter(now.startOf('year'))) return 'MMM D'; // this year
                else return 'MMM YYYY';
            }
        });
    }
}

class ActivityList extends React.PureComponent<Props, State> {
    state = {
        activitys: [],
        isFetching: false
    }

    componentDidMount() {
        this.fetchData()
    }

    render() {
        const { isFetching, activitys } = this.state;
        const { cardId } = this.props;

        return (
            <View style={styles.activityListWrap}>
                <Text style={styles.title}>Recent Social Activity</Text>
                { isFetching && !activitys.length &&
                    <ActivityIndicator color="#FFFFFF" size="large" />
                }
                <FlatList
                    style={styles.activityList}
                    contentContainerStyle={styles.activityListContent}
                    data={activitys}
                    keyExtractor={extractKeyFromActivity}
                    keyboardShouldPersistTaps="handled"
                    onEndReached={this.fetchData}
                    renderItem={this.renderItem}
                    ListFooterComponent={isFetching && (
                        <View style={styles.loadMore}>
                            <ActivityIndicator size="small" color="#FFFFFF" />
                            <Text style={styles.loadMoreLabel}>Loading more...</Text>
                        </View>
                    )}
                />
            </View>
        )
    }

    renderItem = ({ item:activity }) => {
        const { cardId } = this.props;

        return (
            <View style={styles.activityItem}>
                <Text style={styles.activityItem__itemName} numberOfLines={1}>
                    <SearchLink entityId={activity.entityId} cardId={cardId} />
                </Text>
                <Text style={styles.activityItem__description}>
                    { getIconsNameFromActivity(activity) }
                </Text>
                <Text style={styles.activityItem__time} numberOfLines={1}>{ formatAgoShort(activity.createdAt) }</Text>
            </View>
        )
    }

    lastFetchedPage = -1
    fetchData = async () => {
        const { activitys, isFetching } = this.state;
        if (isFetching) return;

        const page = Math.floor(activitys.length / 10) + 1;
        if (page === this.lastFetchedPage) return;

        this.setState(() => ({ isFetching:true }));

        const targetDelay = 3000;
        const startTime = Date.now();

        const res = await fetchApi('activity', {
            qs: {
                page
            }
        });

        if (page > 1) console.log('delaying:', Math.max(targetDelay - (Date.now() - startTime), 0));
        if (page > 1) await delay(Math.max(targetDelay - (Date.now() - startTime), 0));

        if (res.status === 200) {
            this.lastFetchedPage = page;

            const rawActivitys = await res.json();
            console.log('rawActivitys:', rawActivitys);

            this.setState(({ activitys }) => ({
                isFetching: false,
                activitys: [
                    ...activitys,
                    ...rawActivitys.map(getActivityFromRawActivity)
                ]
            }));
        } else {
            this.setState( () => ({ isFetching:false }));
        }
    }
}

export default ActivityList
