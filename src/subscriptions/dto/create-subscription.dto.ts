import {
    IsInt,
    IsBoolean,
    IsDateString,
    IsOptional,
    IsEnum,
} from 'class-validator';
import { subscriptions } from '../../common/enum/subscription.enum';

export class CreateSubscriptionDto {
    @IsInt()
    user_id: number;

    @IsInt()
    plan_id: number;

    @IsEnum(subscriptions)
    @IsOptional()
    status?: subscriptions;

    @IsDateString()
    start_date: string;

    @IsDateString()
    end_date: string;

    @IsBoolean()
    @IsOptional()
    auto_renew?: boolean;
}