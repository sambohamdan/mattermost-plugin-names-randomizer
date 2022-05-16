import React from 'react';

import {FormattedMessage} from 'react-intl';

import {id as pluginId} from './manifest';

import Modal from './components/randomizer_modal';
import {
    HeaderIcon,
} from './components/icons';
import {
    channelHeaderButtonAction,
} from './actions';
import reducer from './reducer';

export default class DemoPlugin {
    initialize(registry, store) {
        registry.registerRootComponent(Modal);
        // eslint-disable-next-line no-unused-expressions
        registry.registerChannelHeaderButtonAction(
            <HeaderIcon/>,
            () => store.dispatch(channelHeaderButtonAction()),
            <FormattedMessage
                id='name-randomizer'
                defaultMessage='Names Randomizer'
            />,
        );
        registry.registerReducer(reducer);
    }

    uninitialize() {
        //eslint-disable-next-line no-console
        console.log(pluginId + '::uninitialize()');
    }
}
