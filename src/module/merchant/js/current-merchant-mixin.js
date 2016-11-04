'use strict';

import RPC from '../../rest-json-rpc/js/rest-json-rpc';
import failHandler from '../../fail-handler/js/fail-handler';

export default {
    data() {
        return {
            currentMerchant: null
        };
    },

    ready() {
        const that = this;
        RPC.call('merchant.get_current_merchant', {})
            .then(failHandler(that))
            .then((res) => {
                that.currentMerchant = res.result;
                that.$emit('merchant.currentMerchantLoaded', that);
            });
    }
};
