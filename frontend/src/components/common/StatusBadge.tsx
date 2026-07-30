import { Tag } from 'antd';

import type { RecordStatus } from '../../types/api';

interface StatusBadgeProps {
  status: RecordStatus;
}

function StatusBadge({
  status,
}: StatusBadgeProps) {
  const isActive = status === 'active';

  return (
    <Tag color={isActive ? 'green' : 'default'}>
      {isActive ? 'Active' : 'Inactive'}
    </Tag>
  );
}

export default StatusBadge;