import {
    Tag,
} from 'antd';

import type {
    CrudStatus,
} from './crudTypes';

interface CrudStatusTagProps {
    status: CrudStatus;
}

export default function CrudStatusTag({
    status,
}: CrudStatusTagProps) {
    return (
        <Tag
            color={
                status === 'active'
                    ? 'success'
                    : 'default'
            }
        >
            {status.toUpperCase()}
        </Tag>
    );
}