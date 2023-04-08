import React from 'react';
import { FieldHookConfig, useField } from 'formik';

const toLocalISO = (
  isoDatetime: string
) => {
  // Get timezone offset in milliseconds.
  const tzoOffset = (new Date()).getTimezoneOffset() * 60000;

  // Offset the passed datetime by the timezone, convert to ISO, and slice of the 'Z' at the end,
  // usually to indicate a zero UTC offset, which this is not. 
  return (new Date(new Date(isoDatetime).getTime() - tzoOffset)).toISOString().slice(0, -1);
}

const OptionalField = (
  props: {
    className?: string
  } & FieldHookConfig<any>
) => {

  const type = props.type;

  const [field, meta, helpers] = useField(props);

  // If this input is for local datetime,
  // ensure the initial value passed is in local datetime form.
  const initVal = type === 'datetime-local' && meta.initialValue
    ? toLocalISO(meta.initialValue)
    : meta.initialValue;

  const [value, setValue] = React.useState(initVal);


  const set = (val: any) => {

    // If datetime-local, save value in ISO form.
    const isoVal = type === 'datetime-local'
      ? new Date(val).toISOString()
      : val;

    setValue(val);
    helpers.setValue(isoVal);
  }

  return (
    <input
    className={props.className}
    {...field}
    type={props.type}
    value={value ?? ''}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {

      if (props.type === 'checkbox' || props.type === 'radio') {
        set(e.target.checked);
      }

      else {
        const result = e.target.value;
        if (result) {
          set(result);
        }
        else {
          set(undefined);
        }
      }
    }}
    />
  );
}

export default OptionalField;