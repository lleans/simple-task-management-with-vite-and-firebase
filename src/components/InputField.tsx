import { Input } from '@/components/ui/input';
import type { FieldError } from 'react-hook-form';

interface InputFieldProps {
  register: any;
  name: string;
  placeholder: string;
  error?: FieldError;
  type?: string;
}

export function InputField({ register, name, placeholder, error, type = 'text' }: InputFieldProps) {
  return (
    <div>
      <Input {...register(name)} placeholder={placeholder} type={type} />
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}