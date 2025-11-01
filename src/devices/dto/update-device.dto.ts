import { deviceTypes, OS } from '../../common/enum/devices.type';

export class UpdateDeviceDto {
    profile: number;

    device_type: deviceTypes;

    device_name: string;

    os: OS;
}
