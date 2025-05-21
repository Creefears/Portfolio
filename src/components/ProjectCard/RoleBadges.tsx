import React from 'react';
import { formatRoles } from '../../utils/projectUtils';

interface RoleBadgesProps {
  role: string;
}

const RoleBadges = React.memo(function RoleBadges({ role }: RoleBadgesProps) {
  const roles = formatRoles(role);
  
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {roles.map((r) => (
        <span
          key={r.role}
          className={`px-2 py-1 rounded-full text-xs font-medium ${r.colors.bg} ${r.colors.text}`}
        >
          {r.role}
        </span>
      ))}
    </div>
  );
});

export default RoleBadges;