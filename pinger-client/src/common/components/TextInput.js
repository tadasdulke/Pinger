import React from 'react';
import cx from 'classnames';

function TextInput({
  field,
  label,
  labelClassName,
  name,
  id,
  value,
  form: { touched, errors },
  wrapperClassName,
  ...props
}) {
  return (
    <div className={wrapperClassName}>
      <div>
        <label
          htmlFor={id}
          className={labelClassName}
        >
          <span>{label}</span>
        </label>
        <input
          id={id}
          type="text"
          className={cx('w-full border border-tuna rounded-[3px] p-[8px]', {
            'mt-[7px]': label,
          })}
          {...field}
          {...props}
        />
      </div>

      {touched[field.name] && errors[field.name] && (
        <div className="text-red-600 mt-[5px]">
          {errors[field.name]}
        </div>
      )}
    </div>
  );
}

export default TextInput;
