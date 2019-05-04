import React from 'react'
import { ActivityIndicator, Alert, FlatList, Platform, Text, TouchableOpacity, View } from 'react-native'
import moment from 'moment'
import { delay } from 'redux-saga'
import DialogAndroid from 'react-native-dialogs'

import { fetchApi } from '../../../../../flow-control/utils'
import { updateAccount } from '../../../../../flow-control/account'

import Icon from '../../../../../Icon'
import SearchLink from '../SearchLink';

import styles from './styles'

import type { Card } from '../../../flow-control/cards'
import type { Shape as AppShape } from '../../../../../flow-control'

type Props = {|
    cardId: $PropertType<Card, 'id'>
|}

type State = {|
    sortFeedBy: 'thumbs' | 'thumbs-up' | 'thumbs-down' | 'recent' | 'comments' | 'helpful-comments'
|}

type Activity = {|
    id: number,
    entityId: string, // article name
    type: 'thumb_up' | 'thumb_down' | 'helpful' | 'comment',
    createdAt: DateIso,
    count?: number // if isCountBased
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
|} | {|
    // if "sortFeedBy" is by other than "recent-activity"
    article: {
        id: number,
        kind: null,
        name: string,
        created_at: DateIso,
        updated_at: DateIso
    },
    count: number
|}

const ITEMS_PER_PAGE = 100;

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
    if (isCountBased(rawActivity)) {
        const {
            count,
            id, // for most helpful comments, id is available here
            article:{
                id: articleId,
                name: entityId,
                created_at: createdAt
            }
        } = rawActivity;
        return {
            id: id || articleId,
            entityId,
            createdAt,
            type: null,
            count
        };
    } else {
        const { id, created_at:createdAt, type, article:{ name:entityId } } = rawActivity;
        return {
            id,
            entityId,
            createdAt,
            type: type !== 'thumb' ? type : (rawActivity.like ? 'thumb_up' : 'thumb_down'),
        };
    }
}

function isCountBased(activityOrRawActivity) {
    return activityOrRawActivity.hasOwnProperty('count');
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

class ActivityListBase extends React.PureComponent<Props, State> {
    state = {
        activitys: [],
        isFetching: false,
        sortFeedBy: 'recent'
    }

    componentDidMount() {
        this.fetchData()
    }

    handleSortPress = async () => {

        const PROMPT_TITLE = 'Sort Feed';

        const options: { label:string, value:string }[] = [
            { label: 'Most Votes (Likes + Dislikes)', value: 'thumbs'           },
            { label: 'Most Likes'                   , value: 'thumbs-up'        },
            { label: 'Most Dislikes'                , value: 'thumbs-down'      },
            { label: 'Recent Activity'              , value: 'recent'           },
            { label: 'Most Comments'                , value: 'comments'         },
            { label: 'Most Helpful Comments'        , value: 'helpful-comments' },
            { label: 'Cancel'                       , value: 'cancel'           }
        ];

        if (Platform.OS === 'ios') {
            Alert.alert(PROMPT_TITLE, undefined, options.map(option => ({
                text: option.label,
                onPress: () => this.sortFeed(option.value),
                style: option.value === 'cancel' ? 'cancel' : undefined
            })));
        } else {
            const { selectedItem } = await DialogAndroid.showPicker(PROMPT_TITLE, null, {
                items: options.slice(0, options.length-1), // no cancel button
                idKey: 'value',
                positiveText: null,
                negativeText: 'Cancel'
            });
            if (selectedItem) this.sortFeed(selectedItem.value)
        }
    }

    async sortFeed(sortFeedBy) {
        if (sortFeedBy === this.state.sortFeedBy) return;
        this.setState({ sortFeedBy });
        await new Promise(resolve => this.setState(
            {
                isFetching: false,
                activitys: []
            },
            resolve
        ));
        this.lastFetchedPage = -1;
        this.fetchData();
    }

    render() {
        const { isFetching, activitys, sortFeedBy } = this.state;
        const { cardId } = this.props;

        const titleLabel = (() => {
            switch (sortFeedBy) {
                case 'thumbs': return 'Most Votes';
                case 'thumbs-up': return 'Most Likes';
                case 'thumbs-down': return 'Most Dislikes';
                case 'recent': return 'Recent Social Activity';
                case 'comments': return 'Most Comments';
                case 'helpful-comments': return 'Most Helpful Comments';
                // no default
            }
        })();
        return (
            <View style={styles.activityListWrap}>
                <View style={styles.activityListTitleRow}>
                    <Text style={styles.title}>{titleLabel}</Text>
                    <TouchableOpacity onPress={this.handleSortPress}>
                        <Icon style={styles.titleRightIcon} name="sort" />
                    </TouchableOpacity>
                </View>
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
                    ListFooterComponent={isFetching && activitys.length && (
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

        if (isCountBased(activity)) {
            return (
                <View style={styles.activityItem}>
                    <Text style={styles.activityItem__itemName} numberOfLines={1}>
                        <SearchLink entityId={activity.entityId} cardId={cardId} />
                    </Text>
                    <Text style={styles.activityItem__time}>{activity.count}</Text>
                </View>
            )
        } else {
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
    }

    lastFetchedPage = -1
    fetchData = async () => {
        const { sortFeedBy, activitys, isFetching } = this.state;
        if (isFetching) return;

        const page = Math.floor(activitys.length / ITEMS_PER_PAGE) + 1;
        if (page === this.lastFetchedPage) return;

        this.setState(() => ({ isFetching:true }));

        const targetDelay = 3000;
        const startTime = Date.now();

        const res = await fetchApi('activity', {
            qs: {
                page,
                sort: sortFeedBy
            }
        });

        const repage = Math.floor(this.state.activitys.length / ITEMS_PER_PAGE) + 1
        if (
            this.state.sortFeedBy !== sortFeedBy
            || page !== repage
        ) {
            return;
        }

        if (page > 1) console.log('delaying:', Math.max(targetDelay - (Date.now() - startTime), 0));
        if (page > 1) await delay(Math.max(targetDelay - (Date.now() - startTime), 0));

        if (res.status === 200) {
            this.lastFetchedPage = page;

            const rawActivitys = await res.json();

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

const ActivityList = ActivityListBase;

export default ActivityList
