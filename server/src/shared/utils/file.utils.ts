import { Bytes } from '../../common/constant/file.constants';
import { FileUnitEnum } from '../../common/enum/files.enum';

export function convertToBytes(size: number, unit?: FileUnitEnum): number {
    switch (unit) {
        case FileUnitEnum.GB:
            return size * convertToBytes(Bytes, FileUnitEnum.MB);
        case FileUnitEnum.MB:
            return size * convertToBytes(Bytes, FileUnitEnum.KB);
        case FileUnitEnum.KB:
            return size * convertToBytes(Bytes, FileUnitEnum.B);
        case FileUnitEnum.B:
            return size * Bytes;
        default:
            return size;
    }
}
