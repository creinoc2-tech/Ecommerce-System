import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CategoryFormValues } from "../../../lib/validator";
import type { FC } from "react";

interface Props {
  className?: string;
  placeholder?: string;
  label: string;
  type: string;
  name: keyof CategoryFormValues;
  register: UseFormRegister<CategoryFormValues>;
  errors: FieldErrors<CategoryFormValues>;
  required?: boolean;
}
export const InputCategories: FC<Props> = ({
  className,
  label,
  type,
  name,
  register,
  errors,
  required,
  placeholder,
}) => {
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <label
          htmlFor={name}
          className="block text-[15px] font-semibold text-gray-800"
        >
          {label}
        </label>
        {required && (
          <span className="text-sm font-bold text-red-500">*</span>
        )}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        id={name}
        className={`h-12 w-full rounded-lg border px-4 text-[15px] text-gray-800 transition duration-150 focus:border-[#0d59f2] focus:outline-none focus:ring-0 ${
          errors[name] ? "border-red-500" : "border-gray-300"
        } ${className ?? ""}`}
        autoComplete="off"
        {...register(name)}
      />
    </div>
  );
};
