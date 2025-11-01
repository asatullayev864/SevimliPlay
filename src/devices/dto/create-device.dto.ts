import { IsEnum, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { deviceTypes, OS } from '../../common/enum/devices.type';
import { Profile } from '../../profiles/entities/profile.entity';

export class CreateDeviceDto {
    @IsNumber()
    profile: number;

    @IsEnum(deviceTypes)
    device_type: deviceTypes;

    @IsString()
    @IsNotEmpty()
    device_name: string;

    @IsEnum(OS)
    os: OS;
}