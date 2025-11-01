import { subscriptions } from '../../common/enum/subscription.enum';

export class UpdateSubscriptionDto {
    user_id: number;

    plan_id: number;

    status?: subscriptions;

    start_date?: string;

    end_date?: string;

    auto_renew?: boolean;
}
