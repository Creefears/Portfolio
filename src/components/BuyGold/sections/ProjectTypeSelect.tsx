import React from 'react';
import { Film, Gamepad2 } from 'lucide-react';
import { Select } from '../../ui/Select';

interface ProjectTypeSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const projectTypeOptions = [
  { value: 'cgi', label: 'CGI & Animation 3D', icon: <Gamepad2 className="w-5 h-5" /> },
  { value: 'real', label: 'Prise de Vue Réel', icon: <Film className="w-5 h-5" /> }
];

export function ProjectTypeSelect({ value, onChange }: ProjectTypeSelectProps) {
  return (
    <Select
      name="type"
      label="Type de Projet"
      value={value}
      onChange={onChange}
      options={projectTypeOptions}
      className="bg-white/10 border-white/20 text-white placeholder-white/60"
    />
  );
}